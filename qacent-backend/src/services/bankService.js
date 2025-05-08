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
  createBankSchema,
  updateBankSchema,
} = require("../validations/bankValidation");
const { STATUS } = require("../constants/constant");

// GET /api/banks?page=1&perPage=10&search=bank&status=ACTIVE
async function getAllBanks(req) {
  const { search, status, page = 1, perPage = 10 } = normalizeQuery(req.query);

  const searchableFields = ["name", "address", "account_type"];

  // Build base conditions
  const conditions = [
    buildSearchCondition(search, searchableFields),
    buildFilterCondition({ status }),
  ];

  // Filter out empty conditions
  const whereCondition = {
    AND: conditions.filter((condition) => Object.keys(condition).length > 0),
  };

  const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

  const [banks, totalCount] = await Promise.all([
    prisma.bank.findMany({
      where: whereCondition,
      orderBy: { id: "desc" },
      skip,
      take,
      include: {
        currency: true,
      },
    }),
    prisma.bank.count({ where: whereCondition }),
  ]);

  // Format the banks data
  const formattedBanks = banks.map((bank) => ({
    ...bank,
    id: bank.id.toString(),
    currency_id: bank.currency_id ? bank.currency_id.toString() : null,
    currency: bank.currency
      ? {
          ...bank.currency,
          id: bank.currency.id.toString(),
        }
      : null,
  }));

  const pagination = generatePaginationMetadata(
    req,
    pageInt,
    totalCount,
    perPageInt,
  );

  return {
    ...pagination,
    data: formattedBanks,
  };
}

async function getBankById(id) {
  try {
    const bank = await prisma.bank.findUnique({
      where: { id: BigInt(id) },
      include: {
        bankAccounts: true,
        currency: true,
      },
    });

    if (!bank) {
      throw new Error("Bank not found");
    }

    // Format the bank data
    return {
      ...bank,
      id: bank.id.toString(),
      currency_id: bank.currency_id ? bank.currency_id.toString() : null,
      currency: bank.currency
        ? {
            ...bank.currency,
            id: bank.currency.id.toString(),
          }
        : null,
      bankAccounts: bank.bankAccounts.map((account) => ({
        ...account,
        id: account.id.toString(),
        user_id: account.user_id ? account.user_id.toString() : null,
        bank_id: account.bank_id.toString(),
      })),
    };
  } catch (error) {
    throw new Error(`Failed to fetch bank: ${error.message}`);
  }
}

async function createBank(data) {
  try {
    // Validate bank data
    const { error } = createBankSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Create the bank
    const bank = await prisma.bank.create({
      data: {
        name: data.name,
        address: data.address || null,
        description: data.description || null,
        account_type: data.account_type || null,
        currency_id: data.currency_id ? BigInt(data.currency_id) : null,
        ach_routing_no: data.ach_routing_no || null,
        wire_routing_no: data.wire_routing_no || null,
        sort_code: data.sort_code || null,
        swift_code: data.swift_code || null,
        status: data.status || STATUS.PENDING,
      },
    });

    // Format the bank data for response
    return {
      ...bank,
      id: bank.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to create bank: ${error.message}`);
  }
}

async function updateBank(id, data) {
  try {
    // Validate bank data
    const { error } = updateBankSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if bank exists
    const existingBank = await prisma.bank.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingBank) {
      throw new Error("Bank not found");
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.name !== undefined) updateData.name = data.name;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.account_type !== undefined)
      updateData.account_type = data.account_type;
    if (data.currency_id !== undefined)
      updateData.currency_id = data.currency_id
        ? BigInt(data.currency_id)
        : null;
    if (data.ach_routing_no !== undefined)
      updateData.ach_routing_no = data.ach_routing_no;
    if (data.wire_routing_no !== undefined)
      updateData.wire_routing_no = data.wire_routing_no;
    if (data.sort_code !== undefined) updateData.sort_code = data.sort_code;
    if (data.swift_code !== undefined) updateData.swift_code = data.swift_code;
    if (data.status !== undefined) updateData.status = data.status;

    // Update the bank
    const bank = await prisma.bank.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Format the bank data for response
    return {
      ...bank,
      id: bank.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to update bank: ${error.message}`);
  }
}

async function updateBankStatus(id, status) {
  try {
    // Check if bank exists
    const existingBank = await prisma.bank.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingBank) {
      throw new Error("Bank not found");
    }

    // Update the bank status
    const bank = await prisma.bank.update({
      where: { id: BigInt(id) },
      data: { status },
    });

    // Format the bank data for response
    return {
      ...bank,
      id: bank.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to update bank status: ${error.message}`);
  }
}

async function deleteBank(id) {
  try {
    // Check if bank exists
    const existingBank = await prisma.bank.findUnique({
      where: { id: BigInt(id) },
      include: {
        bankAccounts: true,
      },
    });

    if (!existingBank) {
      throw new Error("Bank not found");
    }

    // Check if bank has associated bank accounts
    if (existingBank.bankAccounts.length > 0) {
      throw new Error("Cannot delete bank with associated bank accounts");
    }

    // Delete the bank
    await prisma.bank.delete({
      where: { id: BigInt(id) },
    });

    return { success: true, message: "Bank deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete bank: ${error.message}`);
  }
}

async function getActiveBanksForDropdown() {
  try {
    const banks = await prisma.bank.findMany({
      where: { status: STATUS.ACTIVE },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        account_type: true,
        currency_id: true,
        currency: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    // Format the banks data for dropdown
    return banks.map((bank) => ({
      id: bank.id.toString(),
      name: bank.name,
      account_type: bank.account_type || "",
      currency_id: bank.currency_id ? bank.currency_id.toString() : null,
      currency: bank.currency
        ? {
            ...bank.currency,
            id: bank.currency.id.toString(),
          }
        : null,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch active banks: ${error.message}`);
  }
}

module.exports = {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
  updateBankStatus,
  deleteBank,
  getActiveBanksForDropdown,
};
