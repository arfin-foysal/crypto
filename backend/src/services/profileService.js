const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");
const Auth = require("../utils/auth");
const { updateUserSchema } = require("../validations/userValidation");

/**
 * Get authenticated user profile (basic info without relation data)
 * @param {Object} req - Request object
 * @returns {Object} User profile
 */
async function getAuthUserProfile(req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        country: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Format the user data for response
    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user profile: ${error.message}`);
  }
}

/**
 * Update authenticated user profile
 * @param {Object} req - Request object
 * @param {Object} data - User data to update
 * @returns {Object} Updated user profile
 */
async function updateAuthUserProfile(req, data) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Validate user data
    const { error } = updateUserSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided and allowed for client update
    if (data.full_name) updateData.full_name = data.full_name;
    if (data.email) {
      // Check if email is already taken by another user
      const emailExists = await prisma.user.findFirst({
        where: {
          email: data.email,
          id: { not: userId },
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

    // Don't allow clients to update these fields
    // status, role, balance

    // Update the user
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        full_name: true,
        email: true,
        phone: true,
        dob: true,
        code: true,
        address: true,
        photo: true,
        balance: true,
        country_id: true,
        status: true,
        role: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Format the user data for response
    return {
      ...user,
      id: user.id.toString(),
      balance: Number(user.balance).toFixed(2),
      country_id: user.country_id?.toString() || null,
    };
  } catch (error) {
    throw new Error(`Failed to update user profile: ${error.message}`);
  }
}

/**
 * Get authenticated user's bank account details
 * @param {Object} req - Request object
 * @returns {Object} User's bank account details
 */
async function getUserBankAccount(req) {
  try {
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Find the user's bank account
    const bankAccount = await prisma.bankAccount.findUnique({
      where: { user_id: userId },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
        bank: {
          select: {
            id: true,
            name: true,
            account_type: true,
            address: true,
            ach_routing_no: true,
            wire_routing_no: true,
            sort_code: true,
            swift_code: true,
            currency: {
              select: {
                id: true,
                name: true,
                code: true,
              },
            },
          },
        },
      },
    });

    if (!bankAccount) {
      return {};
    }

    // Format the bank account data for response
    return {
      ...bankAccount,
    };
  } catch (error) {
    throw new Error(`Failed to fetch bank account details: ${error.message}`);
  }
}

module.exports = {
  getAuthUserProfile,
  updateAuthUserProfile,
  getUserBankAccount,
};
