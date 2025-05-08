// services/withdrawService.js
const { PrismaClient, Decimal } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const { createWithdrawSchema } = require("../validations/withdrawValidation");
const {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} = require("../constants/constant");
const {
  buildSearchCondition,
  buildFilterCondition,
  buildPagination,
  generatePaginationMetadata,
  normalizeQuery,
} = require("../utils/helpers");
const {
  isTransitionAllowed,
  getAllowedNextStatuses,
} = require("../utils/statusTransition");

async function getWithdraws(req) {
  const {
    search,
    status,
    fee_type,
    transaction_type = "WITHDRAW",
    page = 1,
    perPage = 10,
    minAmount,
    maxAmount,
    startDate,
    endDate,
  } = normalizeQuery(req.query);

  const searchableFields = ["transaction_id", "uid"];

  // Build base conditions
  const conditions = [
    buildSearchCondition(search, searchableFields),
    buildFilterCondition({ status, fee_type }),
    { transaction_type }, // Always filter for WITHDRAW transactions
  ];

  // Add amount range filter if provided
  if (minAmount !== undefined || maxAmount !== undefined) {
    const amountFilter = {
      amount: {
        ...(minAmount !== undefined && { gte: new Decimal(minAmount) }),
        ...(maxAmount !== undefined && { lte: new Decimal(maxAmount) }),
      },
    };
    conditions.push(amountFilter);
  }

  // Add date range filter if provided
  if (startDate || endDate) {
    const dateFilter = {
      created_at: {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      },
    };
    conditions.push(dateFilter);
  }

  const whereCondition = {
    AND: conditions.filter((condition) => Object.keys(condition).length > 0),
  };

  const { skip, take, perPageInt, pageInt } = buildPagination(page, perPage);

  const [withdraws, totalCount] = await Promise.all([
    prisma.balance.findMany({
      where: whereCondition,
      orderBy: { created_at: "desc" },
      skip,
      take,
      select: {
        id: true,
        uid: true,
        transaction_id: true,
        charge_amount: true,
        fee_type: true,
        fee_amount: true,
        amount: true,
        after_fee_amount: true,
        after_balance: true,
        transaction_type: true,
        note: true,
        status: true,
        created_at: true,
        updated_at: true,
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            bankAccounts: {
              select: {
                id: true,

                account_number: true,
                is_open: true,
                bank: {
                  select: {
                    id: true,
                    name: true,
                    status: true,
                  },
                },
              },
              // Since bankAccounts is now a one-to-one relation, we don't need where clause
              // Just check is_open status
              where: {
                is_open: true,
              },
            },
          },
        },
      },
    }),
    prisma.balance.count({ where: whereCondition }),
  ]);

  // Format the withdraws data
  const formattedWithdraws = withdraws.map((withdraw) => ({
    ...withdraw,
    id: withdraw.id.toString(),
    charge_amount: Number(withdraw.charge_amount).toFixed(2),
    amount: Number(withdraw.amount).toFixed(2),
    after_fee_amount: Number(withdraw.after_fee_amount).toFixed(2),
    after_balance: Number(withdraw.after_balance).toFixed(2),
    user: withdraw.user
      ? {
          ...withdraw.user,
          id: withdraw.user.id.toString(),
          // Since bankAccounts is now nullable and one-to-one, handle it accordingly
          bankAccounts: withdraw.user.bankAccounts
            ? {
                ...withdraw.user.bankAccounts,
                id: withdraw.user.bankAccounts.id.toString(),
                bank: {
                  ...withdraw.user.bankAccounts.bank,
                  id: withdraw.user.bankAccounts.bank.id.toString(),
                },
              }
            : null,
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
    status: true,
    message: "Withdraws retrieved successfully",
    ...pagination,
    data: formattedWithdraws,
  };
}

async function updateWithdrawStatus(id, status) {
  try {
    // Check if status is valid
    if (!Object.values(TRANSACTION_STATUS).includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${Object.values(
          TRANSACTION_STATUS
        ).join(", ")}`
      );
    }

    // Check if withdraw transaction exists
    const existingWithdraw = await prisma.balance.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: true,
      },
    });

    if (!existingWithdraw) {
      throw new Error("Withdraw transaction not found");
    }

    // Verify this is a withdraw transaction
    if (existingWithdraw.transaction_type !== TRANSACTION_TYPES.WITHDRAW) {
      throw new Error("This is not a withdraw transaction");
    }

    // Check if the status transition is allowed
    if (
      !isTransitionAllowed(
        existingWithdraw.transaction_type,
        existingWithdraw.status,
        status
      )
    ) {
      const allowedStatuses = getAllowedNextStatuses(
        existingWithdraw.transaction_type,
        existingWithdraw.status
      );

      throw new Error(
        `Invalid status transition from ${existingWithdraw.status} to ${status}. ` +
          `Allowed transitions: ${allowedStatuses.join(", ") || "none"}`
      );
    }

    if (status === TRANSACTION_STATUS.REFUND) {
      // Get current user balance
      const user = existingWithdraw.user;
      const currentBalance = user.balance || new Decimal(0);

      // For refunds, we need to add back the total amount that was deducted (amount + fee)
      // This is stored in the charge_amount field
      const totalRefundAmount = existingWithdraw.amount;

      // When refunding a withdraw, add the total amount back to the user's balance
      const newBalance = currentBalance.add(totalRefundAmount);

      // Use a transaction to ensure both operations succeed or fail together
      return await prisma.$transaction(async (tx) => {
        // Update user balance - add the amount back
        await tx.user.update({
          where: { id: user.id },
          data: { balance: newBalance },
        });

        // Update transaction with new status
        const updatedWithdraw = await tx.balance.update({
          where: { id: BigInt(id) },
          include: {
            user: {
              select: {
                id: true,
                full_name: true,
                email: true,
              },
            },
          },
          data: {
            status,
            after_balance: newBalance,
          },
        });

        return {
          id: updatedWithdraw.id.toString(),
          status: updatedWithdraw.status,
          updated_at: updatedWithdraw.updated_at,
          user_id: updatedWithdraw.user_id.toString(),
          transaction_type: updatedWithdraw.transaction_type,
          amount: updatedWithdraw.amount.toString(),
          after_fee_amount: updatedWithdraw.after_fee_amount.toString(),
          after_balance: updatedWithdraw.after_balance.toString(),
          user: updatedWithdraw.user
            ? {
                id: updatedWithdraw.user.id.toString(),
                full_name: updatedWithdraw.user.full_name,
                email: updatedWithdraw.user.email,
              }
            : null,
        };
      });
    } else {
      // Regular status update for other cases
      const withdraw = await prisma.balance.update({
        where: { id: BigInt(id) },
        data: { status },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
        },
      });

      return {
        id: withdraw.id.toString(),
        status: withdraw.status,
        updated_at: withdraw.updated_at,
        user: withdraw.user
          ? {
              id: withdraw.user.id.toString(),
              full_name: withdraw.user.full_name,
              email: withdraw.user.email,
            }
          : null,
      };
    }
  } catch (error) {
    throw new Error(`Failed to update withdraw status: ${error.message}`);
  }
}

/**
 * Create a new withdraw transaction
 * @param {Object} data - Withdraw data
 * @returns {Object} Created withdraw transaction
 */
async function createWithdraw(data) {
  try {
    // Validate withdraw data
    const { error } = createWithdrawSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: BigInt(data.user_id) },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get transaction fee based on fee_type
    const transactionFee = await prisma.transactionFee.findFirst({
      where: { fee_type: "WITHDRAW" },
    });

    const feePercentage = transactionFee ? transactionFee.fee / 100 : 0;
    const amount = new Decimal(data.amount);
    const feeAmount = amount.mul(feePercentage).toFixed(2);
    // The total amount including fee
    const afterFeeAmount = amount.add(new Decimal(feeAmount)).toFixed(2);

    // Get current user balance
    const currentBalance = user.balance || new Decimal(0);

    // Use the total amount (amount + fee) for deduction
    const totalDeduction = new Decimal(afterFeeAmount);

    // Check if user has enough balance for amount + fee
    if (currentBalance.lessThan(totalDeduction)) {
      throw new Error("Insufficient balance");
    }

    // Calculate what the balance would be after subtracting the withdraw amount + fee
    const afterBalance = currentBalance.sub(totalDeduction).toFixed(2);

    // Generate unique transaction ID and UID
    const uid = uuidv4();
    const transaction_id = `WDR${Date.now().toString().slice(-8)}${Math.floor(
      Math.random() * 1000
    )}`;

    // Use a transaction to ensure both operations succeed or fail together
    const withdraw = await prisma.$transaction(async (tx) => {
      // Create the withdraw transaction
      const createdWithdraw = await tx.balance.create({
        data: {
          uid,
          transaction_id,
          // charge_amount: totalDeduction, // Total amount charged to user
          fee_type: data.fee_type,
          fee_amount: feeAmount.toString(),
          amount,
          after_fee_amount: afterFeeAmount, // Total amount including fee
          after_balance: afterBalance,
          transaction_type: TRANSACTION_TYPES.WITHDRAW,
          note: data.note || null,

          form_currency_id: data.form_currency_id
            ? BigInt(data.form_currency_id)
            : null,
          form_network_id: data.form_network_id
            ? BigInt(data.form_network_id)
            : null,
          // user_network_id is required
          user_network_id: data.user_network_id
            ? BigInt(data.user_network_id)
            : null,
          to_currency_id: data.to_currency_id
            ? BigInt(data.to_currency_id)
            : null,
          to_network_id: data.to_network_id ? BigInt(data.to_network_id) : null,
          user_id: BigInt(data.user_id),
          status: data.status || TRANSACTION_STATUS.PENDING,
        },
        include: {
          user: {
            select: {
              id: true,
              full_name: true,
              email: true,
            },
          },
          form_currency: true,
          form_network: true,
          to_currency: true,
          to_network: true,
          user_network: true,
        },
      });

      await tx.user.update({
        where: { id: BigInt(data.user_id) },
        data: { balance: afterBalance },
      });

      return createdWithdraw;
    });

    // Format the withdraw data for response
    return {
      ...withdraw,
      id: withdraw.id.toString(),
      user_id: withdraw.user_id.toString(),
      form_currency_id: withdraw.form_currency_id
        ? withdraw.form_currency_id.toString()
        : null,
      form_network_id: withdraw.form_network_id
        ? withdraw.form_network_id.toString()
        : null,
      amount: withdraw.amount.toString(),
      after_fee_amount: withdraw.after_fee_amount.toString(),
      after_balance: withdraw.after_balance.toString(),
      user: withdraw.user
        ? {
            ...withdraw.user,
            id: withdraw.user.id.toString(),
          }
        : null,
      form_currency: withdraw.form_currency
        ? {
            ...withdraw.form_currency,
            id: withdraw.form_currency.id.toString(),
          }
        : null,
      form_network: withdraw.form_network
        ? {
            ...withdraw.form_network,
            id: withdraw.form_network.id.toString(),
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to create withdraw: ${error.message}`);
  }
}

/**
 * Get withdraw transaction by ID with all relationship data
 * @param {string} id - Withdraw transaction ID
 * @returns {Object} Withdraw transaction with relationships
 */
async function getWithdrawById(id) {
  try {
    const withdraw = await prisma.balance.findUnique({
      where: {
        id: BigInt(id),
        transaction_type: TRANSACTION_TYPES.WITHDRAW,
      },
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
            balance: true,
            status: true,
          },
        },
        form_currency: true,
        form_network: true,
        to_currency: true,
        to_network: true,
        user_network: true,
      },
    });

    if (!withdraw) {
      throw new Error("Withdraw transaction not found");
    }

    // Format the withdraw data for response
    const formattedWithdraw = {
      id: withdraw.id.toString(),
      uid: withdraw.uid,
      transaction_id: withdraw.transaction_id,
      charge_amount: withdraw.charge_amount.toString(),
      fee_type: withdraw.fee_type,
      fee_amount: withdraw.fee_amount,
      amount: withdraw.amount.toString(),
      after_fee_amount: withdraw.after_fee_amount.toString(),
      after_balance: withdraw.after_balance.toString(),
      transaction_type: withdraw.transaction_type,
      note: withdraw.note,
      status: withdraw.status,
      created_at: withdraw.created_at,
      updated_at: withdraw.updated_at,
      user_id: withdraw.user_id.toString(),
      user: withdraw.user
        ? {
            id: withdraw.user.id.toString(),
            full_name: withdraw.user.full_name,
            email: withdraw.user.email,
            balance: withdraw.user.balance.toString(),
            status: withdraw.user.status,
          }
        : null,
      form_currency: withdraw.form_currency
        ? {
            id: withdraw.form_currency.id.toString(),
            name: withdraw.form_currency.name,
            code: withdraw.form_currency.code,
            image: withdraw.form_currency.image,
          }
        : null,
      form_network: withdraw.form_network
        ? {
            id: withdraw.form_network.id.toString(),
            name: withdraw.form_network.name,
            code: withdraw.form_network.code,
            image: withdraw.form_network.image,
          }
        : null,
      to_currency: withdraw.to_currency
        ? {
            id: withdraw.to_currency.id.toString(),
            name: withdraw.to_currency.name,
            code: withdraw.to_currency.code,
            image: withdraw.to_currency.image,
          }
        : null,
      to_network: withdraw.to_network
        ? {
            id: withdraw.to_network.id.toString(),
            name: withdraw.to_network.name,
            code: withdraw.to_network.code,
            image: withdraw.to_network.image,
          }
        : null,
      user_network: withdraw.user_network
        ? {
            id: withdraw.user_network.id.toString(),
            network_address: withdraw.user_network.network_address,
            link: withdraw.user_network.link,
          }
        : null,
    };

    return formattedWithdraw;
  } catch (error) {
    throw new Error(`Failed to fetch withdraw: ${error.message}`);
  }
}

module.exports = {
  getWithdraws,
  updateWithdrawStatus,
  createWithdraw,
  getWithdrawById,
};
