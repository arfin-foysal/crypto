const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  buildSearchCondition,
  buildFilterCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const {
  createBankAccountSchema,
  updateBankAccountSchema,
  bulkBankAccountSchema,
  assignBankAccountSchema,
} = require("../validations/bankAccountValidation");

async function getAllBankAccounts(req) {
  const {
    bank_id,
    isOpen,
    search,
    page = 1,
    perPage = 10,
    assignment, // New parameter for sorting by assignment status
  } = normalizeQuery(req.query);

  // Define searchable fields for bank accounts
  const searchableFields = ["account_number", "routing_no"];

  // Build base conditions
  const conditions = [
    buildSearchCondition(search, searchableFields),
    buildFilterCondition({
      is_open:
        isOpen === "true" ? true : isOpen === "false" ? false : undefined,
    }),
  ];

  // Filter by assignment status if provided
  if (assignment === "assigned") {
    conditions.push({ user_id: { not: null } }); // Accounts with user_id not null
  } else if (assignment === "available") {
    conditions.push({ user_id: null }); // Accounts with user_id null
  }

  // Add bank_id filter if provided
  if (bank_id) {
    conditions.push({ bank_id: BigInt(bank_id) });
  }

  // Filter out empty conditions
  const whereCondition = {
    AND: conditions.filter((condition) => Object.keys(condition).length > 0),
  };

  const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

  // Determine the sort order
  let orderBy = { id: "desc" }; // Default sorting

  // If sorting by assignment status is requested but no specific status filter is applied,
  // we'll sort by user_id (null values last or first depending on the requested order)
  if (req.query.sort === "assignment_status") {
    const order = req.query.order?.toLowerCase() === "asc" ? "asc" : "desc";
    // In Prisma, sorting nulls is handled by using two separate queries and combining results
    // But we'll use a simpler approach by just sorting by user_id
    orderBy = { user_id: order };
  }

  const [bankAccounts, totalCount] = await Promise.all([
    prisma.bankAccount.findMany({
      where: whereCondition,
      orderBy: orderBy,
      skip,
      take,
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
          },
        },
      },
    }),
    prisma.bankAccount.count({ where: whereCondition }),
  ]);

  // Format the bank accounts data
  const formattedBankAccounts = bankAccounts.map((account) => ({
    // Add assignment status field for clarity in the response
    assignment_status: account.user_id ? "assigned" : "available",
    ...account,
    id: account.id.toString(),
    user_id: account.user_id ? account.user_id.toString() : null,
    bank_id: account.bank_id.toString(),
    user: account.user
      ? {
          ...account.user,
          id: account.user.id.toString(),
        }
      : null,
    bank: {
      ...account.bank,
      id: account.bank.id.toString(),
    },
  }));

  const pagination = generatePaginationMetadata(
    req,
    pageInt,
    totalCount,
    perPageInt
  );

  return {
    ...pagination,
    data: formattedBankAccounts,
  };
}

async function getBankAccountById(id) {
  try {
    const bankAccount = await prisma.bankAccount.findUnique({
      where: { id: BigInt(id) },
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
          },
        },
      },
    });

    if (!bankAccount) {
      throw new Error("Bank account not found");
    }

    // Format the bank account data
    return {
      ...bankAccount,
      id: bankAccount.id.toString(),
      user_id: bankAccount.user_id ? bankAccount.user_id.toString() : null,
      bank_id: bankAccount.bank_id.toString(),
      user: bankAccount.user
        ? {
            ...bankAccount.user,
            id: bankAccount.user.id.toString(),
          }
        : null,
      bank: {
        ...bankAccount.bank,
        id: bankAccount.bank.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to fetch bank account: ${error.message}`);
  }
}

async function createBankAccount(data) {
  try {
    // Validate bank account data
    const { error } = createBankAccountSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if bank exists
    const bank = await prisma.bank.findUnique({
      where: { id: BigInt(data.bank_id) },
    });

    if (!bank) {
      throw new Error("Bank not found");
    }

    // Check if user exists if user_id is provided
    if (data.user_id) {
      const user = await prisma.user.findUnique({
        where: { id: BigInt(data.user_id) },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Check if user already has a bank account
      const existingAccount = await prisma.bankAccount.findUnique({
        where: { user_id: BigInt(data.user_id) },
      });

      if (existingAccount) {
        throw new Error("User already has a bank account");
      }
    }

    // Check if account number already exists
    const existingAccountNumber = await prisma.bankAccount.findFirst({
      where: { account_number: data.account_number },
    });

    if (existingAccountNumber) {
      throw new Error("Account number already exists");
    }

    // Create the bank account with the user-provided account number
    const bankAccount = await prisma.bankAccount.create({
      data: {
        user_id: data.user_id ? BigInt(data.user_id) : null,
        bank_id: BigInt(data.bank_id),
        routing_no: data.routing_no || null,
        account_number: data.account_number,
        is_open: data.is_open !== undefined ? data.is_open : true,
      },
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
          },
        },
      },
    });

    // Format the bank account data for response
    return {
      ...bankAccount,
      id: bankAccount.id.toString(),
      user_id: bankAccount.user_id ? bankAccount.user_id.toString() : null,
      bank_id: bankAccount.bank_id.toString(),
      user: bankAccount.user
        ? {
            ...bankAccount.user,
            id: bankAccount.user.id.toString(),
          }
        : null,
      bank: {
        ...bankAccount.bank,
        id: bankAccount.bank.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to create bank account: ${error.message}`);
  }
}

async function updateBankAccount(id, data) {
  try {
    // Validate bank account data
    const { error } = updateBankAccountSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if bank account exists
    const existingBankAccount = await prisma.bankAccount.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingBankAccount) {
      throw new Error("Bank account not found");
    }

    // Check if bank exists if bank_id is provided
    if (data.bank_id) {
      const bank = await prisma.bank.findUnique({
        where: { id: BigInt(data.bank_id) },
      });

      if (!bank) {
        throw new Error("Bank not found");
      }
    }

    // Check if user exists if user_id is provided
    if (data.user_id !== undefined) {
      if (data.user_id === null) {
        // Allow setting user_id to null
      } else {
        const user = await prisma.user.findUnique({
          where: { id: BigInt(data.user_id) },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Check if another bank account already has this user
        if (
          existingBankAccount.user_id?.toString() !== data.user_id.toString()
        ) {
          const existingAccount = await prisma.bankAccount.findUnique({
            where: { user_id: BigInt(data.user_id) },
          });

          if (existingAccount) {
            throw new Error("User already has a bank account");
          }
        }
      }
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.user_id !== undefined)
      updateData.user_id = data.user_id !== null ? BigInt(data.user_id) : null;
    if (data.bank_id !== undefined) updateData.bank_id = BigInt(data.bank_id);
    if (data.routing_no !== undefined) updateData.routing_no = data.routing_no;

    // Check if account number is being updated
    if (data.account_number !== undefined) {
      // Check if the new account number already exists (excluding the current account)
      if (data.account_number !== existingBankAccount.account_number) {
        const existingAccountNumber = await prisma.bankAccount.findFirst({
          where: {
            account_number: data.account_number,
            id: { not: BigInt(id) },
          },
        });

        if (existingAccountNumber) {
          throw new Error("Account number already exists");
        }
      }

      updateData.account_number = data.account_number;
    }

    if (data.is_open !== undefined) updateData.is_open = data.is_open;

    // Update the bank account
    const bankAccount = await prisma.bankAccount.update({
      where: { id: BigInt(id) },
      data: updateData,
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
          },
        },
      },
    });

    // Format the bank account data for response
    return {
      ...bankAccount,
      id: bankAccount.id.toString(),
      user_id: bankAccount.user_id ? bankAccount.user_id.toString() : null,
      bank_id: bankAccount.bank_id.toString(),
      user: bankAccount.user
        ? {
            ...bankAccount.user,
            id: bankAccount.user.id.toString(),
          }
        : null,
      bank: {
        ...bankAccount.bank,
        id: bankAccount.bank.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to update bank account: ${error.message}`);
  }
}

async function updateBankAccountStatus(id, isOpen) {
  try {
    // Check if bank account exists
    const existingBankAccount = await prisma.bankAccount.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingBankAccount) {
      throw new Error("Bank account not found");
    }

    // Update the bank account status
    const bankAccount = await prisma.bankAccount.update({
      where: { id: BigInt(id) },
      data: { is_open: isOpen },
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
          },
        },
      },
    });

    // Format the bank account data for response
    return {
      ...bankAccount,
      id: bankAccount.id.toString(),
      user_id: bankAccount.user_id ? bankAccount.user_id.toString() : null,
      bank_id: bankAccount.bank_id.toString(),
      user: bankAccount.user
        ? {
            ...bankAccount.user,
            id: bankAccount.user.id.toString(),
          }
        : null,
      bank: {
        ...bankAccount.bank,
        id: bankAccount.bank.id.toString(),
      },
    };
  } catch (error) {
    throw new Error(`Failed to update bank account status: ${error.message}`);
  }
}

async function deleteBankAccount(id) {
  try {
    // Check if bank account exists
    const existingBankAccount = await prisma.bankAccount.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingBankAccount) {
      throw new Error("Bank account not found");
    }

    // Delete the bank account
    await prisma.bankAccount.delete({
      where: { id: BigInt(id) },
    });

    return { success: true, message: "Bank account deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete bank account: ${error.message}`);
  }
}

async function bulkCreateBankAccounts(data) {
  try {
    // Validate input
    const { error } = bulkBankAccountSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if bank exists
    const bank = await prisma.bank.findUnique({
      where: { id: BigInt(data.bank_id) },
    });

    if (!bank) {
      throw new Error("Bank not found");
    }

    // Prepare bank account records
    const bankAccounts = data.bank_accounts.map((account_number) => ({
      bank_id: BigInt(data.bank_id),
      account_number,
      is_open: true,
    }));

    // Insert into DB
    const created = await prisma.bankAccount.createMany({
      data: bankAccounts,
    });

    return created;
  } catch (error) {
    throw new Error(`Failed to create bank accounts: ${error.message}`);
  }
}

/**
 * Get unassigned bank accounts for dropdown
 * @returns {Array} Unassigned bank accounts
 */
async function getUnassignedBankAccountsForDropdown() {
  try {
    // Get bank accounts where user_id is null and is_open is true
    const bankAccounts = await prisma.bankAccount.findMany({
      where: {
        user_id: null,
        is_open: true,
      },
      orderBy: {
        created_at: "desc",
      },
      include: {
        bank: {
          select: {
            id: true,
            name: true,
            account_type: true,
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

    // Format the bank accounts data for dropdown
    return bankAccounts.map((account) => ({
      id: account.id.toString(),
      account_number: account.account_number,
      routing_no: account.routing_no,
      bank_id: account.bank_id.toString(),
      bank: {
        id: account.bank.id.toString(),
        name: account.bank.name,
        account_type: account.bank.account_type,
        currency: account.bank.currency
          ? {
              id: account.bank.currency.id.toString(),
              name: account.bank.currency.name,
              code: account.bank.currency.code,
            }
          : null,
      },
    }));
  } catch (error) {
    throw new Error(
      `Failed to fetch unassigned bank accounts: ${error.message}`
    );
  }
}

/**
 * Assign a user to a bank account
 * @param {Object} data - Data for assigning a user to a bank account
 * @returns {Object} Updated bank account
 */
async function assignUserToBankAccount(data) {
  try {
    // Validate input
    const { error } = assignBankAccountSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if bank account exists
    const bankAccount = await prisma.bankAccount.findUnique({
      where: { id: BigInt(data.bank_account_id) },
    });

    if (!bankAccount) {
      throw new Error("Bank account not found");
    }

    // Check if bank account is already assigned to a user
    if (bankAccount.user_id !== null) {
      throw new Error("Bank account is already assigned to a user");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: BigInt(data.user_id) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user already has a bank account
    const existingAccount = await prisma.bankAccount.findUnique({
      where: { user_id: BigInt(data.user_id) },
    });

    // If user already has a bank account, unassign it first
    if (existingAccount) {
      await prisma.bankAccount.update({
        where: { id: existingAccount.id },
        data: { user_id: null },
      });
    }

    // Update the bank account with the user ID
    const updatedBankAccount = await prisma.bankAccount.update({
      where: { id: BigInt(data.bank_account_id) },
      data: { user_id: BigInt(data.user_id) },
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
          },
        },
      },
    });

    // Format the bank account data for response
    return {
      ...updatedBankAccount,
      id: updatedBankAccount.id.toString(),
      user_id: updatedBankAccount.user_id
        ? updatedBankAccount.user_id.toString()
        : null,
      bank_id: updatedBankAccount.bank_id.toString(),
      user: updatedBankAccount.user
        ? {
            ...updatedBankAccount.user,
            id: updatedBankAccount.user.id.toString(),
          }
        : null,
      bank: {
        ...updatedBankAccount.bank,
        id: updatedBankAccount.bank.id.toString(),
      },
      previous_account: existingAccount
        ? {
            id: existingAccount.id.toString(),
            account_number: existingAccount.account_number,
            bank_id: existingAccount.bank_id.toString(),
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to assign user to bank account: ${error.message}`);
  }
}

module.exports = {
  getAllBankAccounts,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  updateBankAccountStatus,
  deleteBankAccount,
  bulkCreateBankAccounts,
  getUnassignedBankAccountsForDropdown,
  assignUserToBankAccount,
};
