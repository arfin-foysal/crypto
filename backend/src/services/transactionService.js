const { PrismaClient, Decimal } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  buildSearchCondition,
  buildFilterCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} = require("../constants/constant");
const Auth = require("../utils/auth");
const {
  isTransitionAllowed,
  getAllowedNextStatuses,
} = require("../utils/statusTransition");

/**
 * Get all transactions with pagination, filtering, and search
 * @param {Object} req - Request object
 * @returns {Object} Transactions with pagination metadata
 */
async function getAllTransactions(req) {
  const {
    search,
    status,
    fee_type,
    transaction_type,
    page = 1,
    perPage = 10,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  } = normalizeQuery(req.query);

  const searchableFields = ["transaction_id", "uid", "amount"];

  const conditions = [
    buildSearchCondition(search, searchableFields),
    buildFilterCondition({ status, fee_type, transaction_type }),
  ];

  if (minAmount !== undefined || maxAmount !== undefined) {
    conditions.push({
      amount: {
        ...(minAmount !== undefined && { gte: new Decimal(minAmount) }),
        ...(maxAmount !== undefined && { lte: new Decimal(maxAmount) }),
      },
    });
  }

  if (startDate || endDate) {
    conditions.push({
      created_at: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    });
  }

  const whereCondition = conditions.length
    ? { AND: conditions.filter((c) => Object.keys(c).length > 0) }
    : {};

  const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

  const [transactions, totalCount] = await Promise.all([
    prisma.balance.findMany({
      where: whereCondition,
      orderBy: { created_at: "desc" },
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
      },
    }),
    prisma.balance.count({ where: whereCondition }),
  ]);

  const formattedTransactions = transactions.map((transaction) => ({
    id: transaction.id.toString(),
    uid: transaction.uid,
    transaction_id: transaction.transaction_id,
    charge_amount: transaction.charge_amount.toString(),
    fee_type: transaction.fee_type,
    fee_amount: transaction.fee_amount,
    amount: transaction.amount.toString(),
    after_fee_amount: transaction.after_fee_amount.toString(),
    after_balance: transaction.after_balance.toString(),
    transaction_type: transaction.transaction_type,
    status: transaction.status,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
    user: transaction.user
      ? {
          id: transaction.user.id.toString(),
          full_name: transaction.user.full_name,
          email: transaction.user.email,
        }
      : null,
  }));

  const pagination = generatePaginationMetadata(
    req,
    pageInt,
    totalCount,
    perPageInt
  );

  return {
    ...pagination,
    data: formattedTransactions,
  };
}
/**
 * Get all transactions with pagination, filtering, and search
 * @param {Object} req - Request object
 * @returns {Object} Transactions with pagination metadata
 */
async function getAllTransactionsByUser(req) {
  const {
    search,
    status,
    fee_type,
    transaction_type,
    page = 1,
    perPage = 10,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  } = normalizeQuery(req.query);

  const userId = await Auth.id(req);

  const searchableFields = ["transaction_id", "uid","transaction_type"];

  const conditions = [
    { user_id: userId }, // ✅ filter by authenticated user
    buildSearchCondition(search, searchableFields),
    buildFilterCondition({ status, fee_type, transaction_type }),
    
  ];

  if (minAmount !== undefined || maxAmount !== undefined) {
    conditions.push({
      amount: {
        ...(minAmount !== undefined && { gte: new Decimal(minAmount) }),
        ...(maxAmount !== undefined && { lte: new Decimal(maxAmount) }),
      },
    });
  }

  if (startDate || endDate) {
    conditions.push({
      created_at: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    });
  }

  const whereCondition = {
    AND: conditions.filter((c) => Object.keys(c).length > 0),
  };

  const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

  const [transactions, totalCount] = await Promise.all([
    prisma.balance.findMany({
      where: whereCondition,
      orderBy: { created_at: "desc" },
      skip,
      take,
    }),
    prisma.balance.count({ where: whereCondition }),
  ]);

  const formattedTransactions = transactions.map((transaction) => ({
    id: transaction.id.toString(),
    uid: transaction.uid,
    transaction_id: transaction.transaction_id,
    charge_amount: transaction.charge_amount.toString(),
    fee_type: transaction.fee_type,
    fee_amount: transaction.fee_amount,
    amount: transaction.amount.toString(),
    after_fee_amount: transaction.after_fee_amount.toString(),
    after_balance: transaction.after_balance.toString(),
    transaction_type: transaction.transaction_type,
    status: transaction.status,
    created_at: transaction.created_at,
    updated_at: transaction.updated_at,
  }));

  const pagination = generatePaginationMetadata(
    req,
    pageInt,
    totalCount,
    perPageInt
  );

  return {
    ...pagination,
    data: formattedTransactions,
  };
}

/**
 * Get transaction by ID with all relationship data
 * @param {string} id - Transaction ID
 * @returns {Object} Transaction with all relationship data
 */
async function getTransactionById(id) {
  try {
    const transaction = await prisma.balance.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: true,
        to_currency: true,
        to_network: true,
        form_currency: true,
        form_network: true,
      },
    });

    if (!transaction) {
      throw new Error("Transaction not found");
    }

    const formattedTransaction = {
      id: transaction.id.toString(),
      uid: transaction.uid,
      transaction_id: transaction.transaction_id,
      charge_amount: transaction.charge_amount.toString(),
      fee_type: transaction.fee_type,
      fee_amount: transaction.fee_amount,
      amount: transaction.amount.toString(),
      after_fee_amount: transaction.after_fee_amount.toString(),
      after_balance: transaction.after_balance.toString(),
      transaction_type: transaction.transaction_type,
      note: transaction.note,
      status: transaction.status,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      user: transaction.user
        ? {
            id: transaction.user.id.toString(),
            full_name: transaction.user.full_name,
            email: transaction.user.email,
            phone: transaction.user.phone,
            address: transaction.user.address,
            status: transaction.user.status,
          }
        : null,
      to_currency: transaction.to_currency
        ? {
            id: transaction.to_currency.id.toString(),
            name: transaction.to_currency.name,
            code: transaction.to_currency.code,
            image: transaction.to_currency.image,
            usd_rate: transaction.to_currency.usd_rate.toString(),
            status: transaction.to_currency.status,
          }
        : null,
      to_network: transaction.to_network
        ? {
            id: transaction.to_network.id.toString(),
            name: transaction.to_network.name,
            code: transaction.to_network.code,
            image: transaction.to_network.image,
            status: transaction.to_network.status,
          }
        : null,
      form_currency: transaction.form_currency
        ? {
            id: transaction.form_currency.id.toString(),
            name: transaction.form_currency.name,
            code: transaction.form_currency.code,
            image: transaction.form_currency.image,
            usd_rate: transaction.form_currency.usd_rate.toString(),
            status: transaction.form_currency.status,
          }
        : null,
      form_network: transaction.form_network
        ? {
            id: transaction.form_network.id.toString(),
            name: transaction.form_network.name,
            code: transaction.form_network.code,
            image: transaction.form_network.image,
            status: transaction.form_network.status,
          }
        : null,
    };

    return formattedTransaction;
  } catch (error) {
    throw new Error(`Failed to fetch transaction: ${error.message}`);
  }
}

/**
 * Update transaction status
 * @param {string} id - Transaction ID
 * @param {string} status - New status
 * @returns {Object} Updated transaction
 */
async function updateTransactionStatus(id, status) {
  try {
    // Check if status is valid
    if (!Object.values(TRANSACTION_STATUS).includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${Object.values(
          TRANSACTION_STATUS
        ).join(", ")}`
      );
    }

    // Check if transaction exists
    const existingTransaction = await prisma.balance.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: true,
      },
    });

    if (!existingTransaction) {
      throw new Error("Transaction not found");
    }

    // Check if the status transition is allowed
    if (
      !isTransitionAllowed(
        existingTransaction.transaction_type,
        existingTransaction.status,
        status
      )
    ) {
      const allowedStatuses = getAllowedNextStatuses(
        existingTransaction.transaction_type,
        existingTransaction.status
      );

      throw new Error(
        `Invalid status transition from ${existingTransaction.status} to ${status}. ` +
          `Allowed transitions: ${allowedStatuses.join(", ") || "none"}`
      );
    }

    // Special handling for deposit transactions changing from IN_REVIEW to COMPLETED
    if (
      existingTransaction.transaction_type === TRANSACTION_TYPES.DEPOSIT &&
      existingTransaction.status === TRANSACTION_STATUS.IN_REVIEW &&
      status === TRANSACTION_STATUS.COMPLETED
    ) {
      // Get current user balance
      const user = existingTransaction.user;
      const currentBalance = user.balance || new Decimal(0);
      const depositAmount = existingTransaction.after_fee_amount;
      const newBalance = currentBalance.add(depositAmount);

      // Use a transaction to ensure both operations succeed or fail together
      return await prisma.$transaction(async (tx) => {
        // Update user balance
        await tx.user.update({
          where: { id: user.id },
          data: { balance: newBalance },
        });

        // Update transaction with new status and after_balance
        const transaction = await tx.balance.update({
          where: { id: BigInt(id) },
          data: {
            status,
            after_balance: newBalance,
          },
        });

        return {
          id: transaction.id.toString(),
          status: transaction.status,
          updated_at: transaction.updated_at,
          user_id: transaction.user_id.toString(),
          transaction_type: transaction.transaction_type,
          amount: transaction.amount.toString(),
          after_fee_amount: transaction.after_fee_amount.toString(),
          after_balance: transaction.after_balance.toString(),
        };
      });
    }
    // Special handling for deposit transactions changing to REFUND
    else if (
      existingTransaction.transaction_type === TRANSACTION_TYPES.DEPOSIT &&
      existingTransaction.status === TRANSACTION_STATUS.COMPLETED &&
      status === TRANSACTION_STATUS.REFUND
    ) {
      // For REFUND status on deposit transactions, only update the status without changing the user's balance
      const transaction = await prisma.balance.update({
        where: { id: BigInt(id) },
        data: { status },
      });

      return {
        id: transaction.id.toString(),
        status: transaction.status,
        updated_at: transaction.updated_at,
      };
    }
    // Special handling for withdraw transactions changing to REFUND
    else if (
      existingTransaction.transaction_type === TRANSACTION_TYPES.WITHDRAW &&
      existingTransaction.status === TRANSACTION_STATUS.COMPLETED &&
      status === TRANSACTION_STATUS.REFUND
    ) {
      // Get current user balance
      const user = existingTransaction.user;
      const currentBalance = user.balance || new Decimal(0);
      const withdrawAmount = existingTransaction.amount;

      // When refunding a withdraw, add the amount back to the user's balance
      const newBalance = currentBalance.add(withdrawAmount);

      // Use a transaction to ensure both operations succeed or fail together
      return await prisma.$transaction(async (tx) => {
        // Update user balance - add the amount back
        await tx.user.update({
          where: { id: user.id },
          data: { balance: newBalance },
        });

        // Update transaction with new status
        const transaction = await tx.balance.update({
          where: { id: BigInt(id) },
          data: {
            status,
            after_balance: newBalance,
          },
        });

        return {
          id: transaction.id.toString(),
          status: transaction.status,
          updated_at: transaction.updated_at,
          user_id: transaction.user_id.toString(),
          transaction_type: transaction.transaction_type,
          amount: transaction.amount.toString(),
          after_fee_amount: transaction.after_fee_amount.toString(),
          after_balance: transaction.after_balance.toString(),
        };
      });
    } else {
      // Regular status update for other cases
      const transaction = await prisma.balance.update({
        where: { id: BigInt(id) },
        data: { status },
      });

      return {
        id: transaction.id.toString(),
        status: transaction.status,
        updated_at: transaction.updated_at,
      };
    }
  } catch (error) {
    throw new Error(`Failed to update transaction status: ${error.message}`);
  }
}

/**
 * Get transactions by user ID with pagination, filtering, and search
 * @param {string} userId - User ID
 * @param {Object} req - Request object
 * @returns {Object} Transactions with pagination metadata
 */
async function getTransactionsByUserId(userId, req) {
  try {
    const {
      search,
      status,
      fee_type,
      transaction_type,
      page = 1,
      perPage = 10,
      minAmount,
      maxAmount,
      startDate,
      endDate,
    } = normalizeQuery(req.query || {});

    const searchableFields = ["transaction_id", "uid"];

    const conditions = [
      { user_id: BigInt(userId) }, // Filter by the specified user ID
      buildSearchCondition(search, searchableFields),
      buildFilterCondition({ status, fee_type, transaction_type }),
    ];

    if (minAmount !== undefined || maxAmount !== undefined) {
      conditions.push({
        amount: {
          ...(minAmount !== undefined && { gte: new Decimal(minAmount) }),
          ...(maxAmount !== undefined && { lte: new Decimal(maxAmount) }),
        },
      });
    }

    if (startDate || endDate) {
      conditions.push({
        created_at: {
          ...(startDate && { gte: new Date(startDate) }),
          ...(endDate && { lte: new Date(endDate) }),
        },
      });
    }

    const whereCondition = {
      AND: conditions.filter((c) => Object.keys(c).length > 0),
    };

    const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

    const [transactions, totalCount] = await Promise.all([
      prisma.balance.findMany({
        where: whereCondition,
        orderBy: { created_at: "desc" },
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
        },
      }),
      prisma.balance.count({ where: whereCondition }),
    ]);

    // Format the transactions data
    const formattedTransactions = transactions.map((transaction) => ({
      id: transaction.id.toString(),
      uid: transaction.uid,
      transaction_id: transaction.transaction_id,
      charge_amount: transaction.charge_amount.toString(),
      fee_type: transaction.fee_type,
      fee_amount: transaction.fee_amount,
      amount: transaction.amount.toString(),
      after_fee_amount: transaction.after_fee_amount.toString(),
      after_balance: transaction.after_balance.toString(),
      transaction_type: transaction.transaction_type,
      status: transaction.status,
      note: transaction.note,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
      user: transaction.user
        ? {
            id: transaction.user.id.toString(),
            full_name: transaction.user.full_name,
            email: transaction.user.email,
          }
        : null,
    }));

    // Create a simplified pagination response without URL generation
    // since we don't have access to the full request object
    return {
      current_page: pageInt,
      per_page: perPageInt,
      total: totalCount,
      from: totalCount === 0 ? 0 : (pageInt - 1) * perPageInt + 1,
      to: Math.min(pageInt * perPageInt, totalCount),
      last_page: Math.ceil(totalCount / perPageInt),
      data: formattedTransactions,
    };
  } catch (error) {
    throw new Error(`Failed to retrieve transactions: ${error.message}`);
  }
}

module.exports = {
  getAllTransactions,
  getAllTransactionsByUser,
  getTransactionById,
  updateTransactionStatus,
  getTransactionsByUserId,
};
