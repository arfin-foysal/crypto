// services/clientWithdrawService.js
const { PrismaClient, Decimal } = require("@prisma/client");
const prisma = new PrismaClient();
const { v4: uuidv4 } = require("uuid");
const Auth = require("../utils/auth");
const {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
} = require("../constants/constant");
const {
  clientWithdrawSchema,
} = require("../validations/clientWithdrawValidation");

/**
 * Create a new withdraw transaction for the authenticated user
 * @param {Object} data - Withdraw data
 * @param {Object} req - Request object
 * @returns {Object} Created withdraw transaction
 */
async function createClientWithdraw(data, req) {
  try {
    // Validate withdraw data
    const { error } = clientWithdrawSchema.validate(data);
    if (error) {
      throw new Error(error.details[0].message);
    }

    // Get authenticated user ID
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.status !== "ACTIVE") {
      throw new Error("User is not active");
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
      Math.random() * 1000,
    )}`;

    // Use a transaction to ensure both operations succeed or fail together
    const withdraw = await prisma.$transaction(async (tx) => {
      // Create the withdraw transaction
      const createdWithdraw = await tx.balance.create({
        data: {
          uid,
          transaction_id,
          // charge_amount:
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
          user_id: userId,
          status: TRANSACTION_STATUS.PENDING,
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
        where: { id: userId },
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

module.exports = {
  createClientWithdraw,
};
