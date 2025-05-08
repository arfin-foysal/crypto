const { PrismaClient, Decimal } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const { createDepositSchema } = require("../validations/depositValidation");
const {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} = require("../constants/constant");
const {
  isTransitionAllowed,
  getAllowedNextStatuses,
} = require("../utils/statusTransition");

/**
 * Create a new deposit transaction
 * @param {Object} data - Deposit data
 * @returns {Object} Created deposit transaction
 */
async function createDeposit(data) {
  try {
    // Validate deposit data
    const { error } = createDepositSchema.validate(data);
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
      where: { fee_type: "DEPOSIT" },
    });

    const feePercentage = transactionFee ? transactionFee.fee / 100 : 0;
    const amount = new Decimal(data.amount);
    const chargeAmount = new Decimal(data.charge_amount);
    const feeAmount = amount.mul(feePercentage).toFixed(2);
    const afterFeeAmount = amount.sub(feeAmount).sub(chargeAmount).toFixed(2);

    // Get current user balance
    const currentBalance = user.balance || new Decimal(0);

    // Calculate what the balance would be after adding the deposit amount
    // This will be used in the transaction record regardless of whether we update the actual balance
    const afterBalance = currentBalance.add(afterFeeAmount).toFixed(2);

    // Generate unique transaction ID and UID
    const uid = uuidv4();
    const transaction_id = `DEP${Date.now().toString().slice(-8)}${Math.floor(
      Math.random() * 1000,
    )}`;

    // Use a transaction to ensure both operations succeed or fail together
    const deposit = await prisma.$transaction(async (tx) => {
      // Create the deposit transaction
      const createdDeposit = await tx.balance.create({
        data: {
          uid,
          transaction_id,
          charge_amount: chargeAmount,
          fee_amount: feeAmount.toString(),
          amount,
          after_fee_amount: afterFeeAmount,
          after_balance: afterBalance,
          transaction_type: TRANSACTION_TYPES.DEPOSIT,
          note: data.note || null,
          fee_type: data.fee_type,
          to_currency_id: data.to_currency_id ? BigInt(data.to_currency_id) : 1,
          to_network_id: data.to_network_id ? BigInt(data.to_network_id) : null,
          form_currency_id: data.form_currency_id
            ? BigInt(data.form_currency_id)
            : 1,
          form_network_id: data.form_network_id
            ? BigInt(data.form_network_id)
            : 1,
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
          to_currency: true,
          to_network: true,
        },
      });

      // Only update user balance if status is COMPLETED
      if (data.status === TRANSACTION_STATUS.COMPLETED) {
        await tx.user.update({
          where: { id: BigInt(data.user_id) },
          data: { balance: afterBalance },
        });
      }

      return createdDeposit;
    });

    // Format the deposit data for response
    return {
      ...deposit,
      id: deposit.id.toString(),
      user_id: deposit.user_id.toString(),
      to_currency_id: deposit.to_currency_id
        ? deposit.to_currency_id.toString()
        : null,
      to_network_id: deposit.to_network_id
        ? deposit.to_network_id.toString()
        : null,
      amount: deposit.amount.toString(),
      after_fee_amount: deposit.after_fee_amount.toString(),
      after_balance: deposit.after_balance.toString(),
      user: deposit.user
        ? {
            ...deposit.user,
            id: deposit.user.id.toString(),
          }
        : null,
      to_currency: deposit.to_currency
        ? {
            ...deposit.to_currency,
            id: deposit.to_currency.id.toString(),
          }
        : null,
      to_network: deposit.to_network
        ? {
            ...deposit.to_network,
            id: deposit.to_network.id.toString(),
          }
        : null,
    };
  } catch (error) {
    throw new Error(`Failed to create deposit: ${error.message}`);
  }
}

/**
 * Update deposit status
 * @param {string} id - Deposit ID
 * @param {string} status - New status
 * @returns {Object} Updated deposit
 */
async function updateDepositStatus(id, status) {
  try {
    // Check if status is valid
    if (!Object.values(TRANSACTION_STATUS).includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${Object.values(
          TRANSACTION_STATUS,
        ).join(", ")}`,
      );
    }

    // Check if deposit transaction exists
    const existingDeposit = await prisma.balance.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: true,
      },
    });

    if (!existingDeposit) {
      throw new Error("Deposit transaction not found");
    }

    // Verify this is a deposit transaction
    if (existingDeposit.transaction_type !== TRANSACTION_TYPES.DEPOSIT) {
      throw new Error("This is not a deposit transaction");
    }

    // Check if the status transition is allowed
    if (
      !isTransitionAllowed(
        existingDeposit.transaction_type,
        existingDeposit.status,
        status,
      )
    ) {
      const allowedStatuses = getAllowedNextStatuses(
        existingDeposit.transaction_type,
        existingDeposit.status,
      );

      throw new Error(
        `Invalid status transition from ${existingDeposit.status} to ${status}. ` +
          `Allowed transitions: ${allowedStatuses.join(", ") || "none"}`,
      );
    }

    // Special handling for deposit transactions changing to COMPLETED
    if (
      status === TRANSACTION_STATUS.COMPLETED &&
      existingDeposit.status !== TRANSACTION_STATUS.COMPLETED
    ) {
      // Get current user balance
      const user = existingDeposit.user;
      const currentBalance = user.balance || new Decimal(0);
      const depositAmount = existingDeposit.after_fee_amount;
      const newBalance = currentBalance.add(depositAmount);

      // Use a transaction to ensure both operations succeed or fail together
      return await prisma.$transaction(async (tx) => {
        // Update user balance
        await tx.user.update({
          where: { id: user.id },
          data: { balance: newBalance },
        });

        // Update transaction with new status
        const updatedDeposit = await tx.balance.update({
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
          id: updatedDeposit.id.toString(),
          status: updatedDeposit.status,
          updated_at: updatedDeposit.updated_at,
          user_id: updatedDeposit.user_id.toString(),
          transaction_type: updatedDeposit.transaction_type,
          amount: updatedDeposit.amount.toString(),
          after_fee_amount: updatedDeposit.after_fee_amount.toString(),
          after_balance: updatedDeposit.after_balance.toString(),
          user: updatedDeposit.user
            ? {
                id: updatedDeposit.user.id.toString(),
                full_name: updatedDeposit.user.full_name,
                email: updatedDeposit.user.email,
              }
            : null,
        };
      });
    }
    // Special handling for deposit transactions changing to REFUND
    else if (
      status === TRANSACTION_STATUS.REFUND &&
      existingDeposit.status === TRANSACTION_STATUS.COMPLETED
    ) {
      // For REFUND status, only update the status without changing the user's balance
      const deposit = await prisma.balance.update({
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
        id: deposit.id.toString(),
        status: deposit.status,
        updated_at: deposit.updated_at,
        user: deposit.user
          ? {
              id: deposit.user.id.toString(),
              full_name: deposit.user.full_name,
              email: deposit.user.email,
            }
          : null,
      };
    } else {
      // Regular status update for other cases
      const deposit = await prisma.balance.update({
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
        id: deposit.id.toString(),
        status: deposit.status,
        updated_at: deposit.updated_at,
        user: deposit.user
          ? {
              id: deposit.user.id.toString(),
              full_name: deposit.user.full_name,
              email: deposit.user.email,
            }
          : null,
      };
    }
  } catch (error) {
    throw new Error(`Failed to update deposit status: ${error.message}`);
  }
}

module.exports = {
  createDeposit,
  updateDepositStatus,
};
