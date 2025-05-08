const { PrismaClient, Decimal } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const {
  buildSearchCondition,
  buildFilterCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const { createUserSchema } = require("../validations/userValidation");
const { STATUS, ROLES } = require("../constants/constant");
const { sendEmail } = require("../emails/emailService");



/**
 * Get all users with filtering, search, and pagination
 * Note: SUPERADMIN users are always excluded from the results
 *
 * GET /api/users?page=1&perPage=10&search=john&status=ACTIVE&role=USER
 */
async function getAllUsers(req) {
  const {
    search,
    status,
    role,
    page = 1,
    perPage = 10,
    minBalance,
    maxBalance,
  } = normalizeQuery(req.query);

  const searchableFields = ["full_name", "email"];

  // Build base conditions
  const conditions = [
    buildSearchCondition(search, searchableFields),
    buildFilterCondition({ status, role }),
    { role: { not: ROLES.SUPERADMIN } }, // Exclude SUPERADMIN users
  ];

  // Add balance range filter if provided
  if (minBalance !== undefined || maxBalance !== undefined) {
    const balanceFilter = {
      balance: {
        ...(minBalance !== undefined && { gte: new Decimal(minBalance) }),
        ...(maxBalance !== undefined && { lte: new Decimal(maxBalance) }),
      },
    };
    conditions.push(balanceFilter);
  }

  // Filter out empty conditions
  const whereCondition = {
    AND: conditions.filter((condition) => Object.keys(condition).length > 0),
  };

  const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where: whereCondition,
      orderBy: { id: "desc" },
      skip,
      take,
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        code: true,
        dob: true,
        address: true,
        photo: true,
        balance: true,
        country_id: true,
        status: true,
        role: true,
        created_at: true,
        updated_at: true,
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    }),
    prisma.user.count({ where: whereCondition }),
  ]);

  // Format the users data
  const formattedUsers = users.map((user) => ({
    ...user,
    id: user.id.toString(),
    balance: Number(user.balance).toFixed(2),
    country_id: user.country_id?.toString() || null,
  }));

  const pagination = generatePaginationMetadata(
    req,
    pageInt,
    totalCount,
    perPageInt
  );

  return {
    status: true,
    message: "Users retrieved successfully",
    ...pagination,
    data: formattedUsers,
  };
}

async function getUserById(id) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: BigInt(id) },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        bankAccounts: {
          include: {
            bank: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Format the decimal values
    return {
      ...user,
      id: user.id.toString(),
      balance: Number(user.balance).toFixed(2),
      country_id: user.country_id?.toString() || null,
    };
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
async function updateUserStatus(id, status) {
  try {
    const user = await prisma.user.update({
      where: { id: BigInt(id) },
      data: { status },
    });

   //<---------------send email --------------------------->
    const emailTemplates = {
      [STATUS.ACTIVE]: {
        subject: "Your account was approved!",
        message: "Your account was approved! You can now receive ACH transfers directly in Qacent.",
      },
      [STATUS.FROZEN]: {
        subject: "Your account was frozen!",
        message: "Your account was frozen! Please contact support for more information.",
      },
      [STATUS.SUSPENDED]: {
        subject: "Your account was suspended!",
        message: "Your account was suspended! Please contact support for more information.",
      },
    };
    
    if (emailTemplates[status]) {
      sendEmail(user, emailTemplates[status]);
    }
    
  //<---------------send email --------------------------->
    return user;
  } catch (error) {
    throw new Error(`Failed to update user status: ${error.message}`);
  }
}

async function createUser(data) {
  try {
    // Validate user data
    const { error } = createUserSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if user with the same email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    // Generate unique user code
    let userCode = `USR-${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 1000
    )}`;

    // Check if code already exists
    const existingCode = await prisma.user.findFirst({
      where: { code: userCode },
    });

    // If code exists, regenerate with a different random number
    if (existingCode) {
      userCode = `USR-${Date.now().toString().slice(-6)}${
        Math.floor(Math.random() * 9000) + 1000
      }`;
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        password: hashedPassword,
        code: userCode, // Add the generated code
        phone: data.phone || null,
        dob: data.dob || null,
        address: data.address || null,
        photo: data.photo || null,
        country_id: data.country_id ? BigInt(data.country_id) : null,
        status: data.status || STATUS.PENDING,
        role: data.role || ROLES.USER,
        balance: data.balance ? new Decimal(data.balance) : new Decimal(0),
      },
    });

    // Format the user data for response
    return {
      ...user,
      id: user.id.toString(),
      balance: Number(user.balance).toFixed(2),
      country_id: user.country_id?.toString() || null,
      password: undefined, // Remove password from response
    };
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

async function updateUser(id, data) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.full_name) updateData.full_name = data.full_name;
    if (data.email) {
      // Check if email is already taken by another user
      const emailExists = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: BigInt(id) },
        },
      });

      if (emailExists) {
        throw new Error("Email is already taken by another user");
      }

      updateData.email = data.email;
    }
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(data.password, salt);
    }
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.dob !== undefined) updateData.dob = data.dob || null;
    if (data.address !== undefined) updateData.address = data.address || null;
    if (data.photo !== undefined) updateData.photo = data.photo || null;
    if (data.country_id !== undefined) {
      updateData.country_id = data.country_id ? BigInt(data.country_id) : null;
    }
    if (data.status) updateData.status = data.status;
    if (data.role) updateData.role = data.role;
    if (data.balance !== undefined) {
      updateData.balance = data.balance
        ? new Decimal(data.balance)
        : existingUser.balance;
    }

    // Update the user
    const user = await prisma.user.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Format the user data for response
    return {
      ...user,
      id: user.id.toString(),
      balance: Number(user.balance).toFixed(2),
      country_id: user.country_id?.toString() || null,
      password: undefined, // Remove password from response
    };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
}

async function deleteUser(id) {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Delete the user
    await prisma.user.delete({
      where: { id: BigInt(id) },
    });

    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
}

/**
 * Get active users for dropdown selection
 * Excludes users who already have bank accounts and SUPERADMIN users
 * @returns {Array} Array of active users without bank accounts
 */
async function getActiveUsersForDropdown() {
  try {
    // Get users that are active and don't already have a bank account
    // First, get all user IDs that already have bank accounts
    const usersWithBankAccounts = await prisma.bankAccount.findMany({
      where: {
        user_id: { not: null },
      },
      select: {
        user_id: true,
      },
    });

    // Extract the user IDs into an array
    const userIdsWithAccounts = usersWithBankAccounts.map(
      (account) => account.user_id
    );

    // Now get active users that are not in the list of users with bank accounts and not SUPERADMIN
    const users = await prisma.user.findMany({
      where: {
        status: STATUS.ACTIVE,
        role: { not: ROLES.SUPERADMIN }, // Exclude SUPERADMIN users
        id: {
          notIn:
            userIdsWithAccounts.length > 0 ? userIdsWithAccounts : [BigInt(-1)], // Use a dummy ID if no users have accounts yet
        }, // Exclude users with bank accounts
      },
      orderBy: { full_name: "asc" },
      select: {
        id: true,
        full_name: true,
        email: true,
      },
    });

    // Format the users data for dropdown
    return users.map((user) => ({
      id: user.id.toString(),
      full_name: user.full_name,
      email: user.email,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch active users: ${error.message}`);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserStatus,
  updateUser,
  deleteUser,
  getActiveUsersForDropdown,
};
