const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  createTransactionFeeSchema,
  updateTransactionFeeSchema,
} = require("../validations/transactionFeeValidation");

/**
 * Get all transaction fees
 * @returns {Array} All transaction fees
 */
async function getAllTransactionFees() {
  try {
    const transactionFees = await prisma.transactionFee.findMany({
      orderBy: { id: "desc" },
    });

    // Format the transaction fees data
    return transactionFees.map((fee) => ({
      ...fee,
      id: fee.id.toString(),
    }));
  } catch (error) {
    throw new Error(`Failed to retrieve transaction fees: ${error.message}`);
  }
}

/**
 * Get transaction fee by ID
 * @param {string} id - Transaction fee ID
 * @returns {Object} Transaction fee
 */
async function getTransactionFeeById(id) {
  try {
    const transactionFee = await prisma.transactionFee.findUnique({
      where: { id: BigInt(id) },
    });

    if (!transactionFee) {
      throw new Error("Transaction fee not found");
    }

    // Format the transaction fee data
    return {
      ...transactionFee,
      id: transactionFee.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve transaction fee: ${error.message}`);
  }
}

/**
 * Get transaction fee by fee type
 * @param {string} feeType - Transaction fee type (DEPOSIT, WITHDRAW)
 * @returns {Object} Transaction fee
 */
async function getTransactionFeeByType(feeType) {
  try {
    // Validate fee type
    if (!feeType || !["DEPOSIT", "WITHDRAW"].includes(feeType.toUpperCase())) {
      throw new Error("Invalid fee type. Must be 'DEPOSIT' or 'WITHDRAW'");
    }

    const transactionFee = await prisma.transactionFee.findFirst({
      where: { fee_type: feeType },
    });

    if (!transactionFee) {
      throw new Error(`Transaction fee with type ${feeType} not found`);
    }

    // Format the transaction fee data
    return {
      ...transactionFee,
      id: transactionFee.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to retrieve transaction fee: ${error.message}`);
  }
}

/**
 * Create a new transaction fee
 * @param {Object} data - Transaction fee data
 * @returns {Object} Created transaction fee
 */
async function createTransactionFee(data) {
  try {
    // Validate transaction fee data
    const { error } = createTransactionFeeSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if a fee with the same fee_type already exists
    const existingFee = await prisma.transactionFee.findFirst({
      where: { fee_type: data.fee_type },
    });

    if (existingFee) {
      throw new Error(`A fee with type ${data.fee_type} already exists`);
    }

    // Create the transaction fee
    const transactionFee = await prisma.transactionFee.create({
      data: {
        fee_type: data.fee_type,
        fee: data.fee,
      },
    });

    // Format the transaction fee data for response
    return {
      ...transactionFee,
      id: transactionFee.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to create transaction fee: ${error.message}`);
  }
}

/**
 * Update a transaction fee
 * @param {string} id - Transaction fee ID
 * @param {Object} data - Transaction fee data to update
 * @returns {Object} Updated transaction fee
 */
async function updateTransactionFee(id, data) {
  try {
    // Validate transaction fee data
    const { error } = updateTransactionFeeSchema.validate(data);

    if (error) {
      throw new Error(error.details[0].message);
    }

    // Check if transaction fee exists
    const existingFee = await prisma.transactionFee.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingFee) {
      throw new Error("Transaction fee not found");
    }

    // If fee_type is being updated, check if it already exists
    if (data.fee_type && data.fee_type !== existingFee.fee_type) {
      const duplicateFee = await prisma.transactionFee.findFirst({
        where: {
          fee_type: data.fee_type,
          id: { not: BigInt(id) },
        },
      });

      if (duplicateFee) {
        throw new Error(`A fee with type ${data.fee_type} already exists`);
      }
    }

    // Prepare update data
    const updateData = {};

    // Only update fields that are provided
    if (data.fee_type !== undefined) updateData.fee_type = data.fee_type;
    if (data.fee !== undefined) updateData.fee = data.fee;

    // Update the transaction fee
    const transactionFee = await prisma.transactionFee.update({
      where: { id: BigInt(id) },
      data: updateData,
    });

    // Format the transaction fee data for response
    return {
      ...transactionFee,
      id: transactionFee.id.toString(),
    };
  } catch (error) {
    throw new Error(`Failed to update transaction fee: ${error.message}`);
  }
}

/**
 * Delete a transaction fee
 * @param {string} id - Transaction fee ID
 * @returns {Object} Success message
 */
async function deleteTransactionFee(id) {
  try {
    // Check if transaction fee exists
    const existingFee = await prisma.transactionFee.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existingFee) {
      throw new Error("Transaction fee not found");
    }

    // Delete the transaction fee
    await prisma.transactionFee.delete({
      where: { id: BigInt(id) },
    });

    return { success: true, message: "Transaction fee deleted successfully" };
  } catch (error) {
    throw new Error(`Failed to delete transaction fee: ${error.message}`);
  }
}

module.exports = {
  getAllTransactionFees,
  getTransactionFeeById,
  getTransactionFeeByType,
  createTransactionFee,
  updateTransactionFee,
  deleteTransactionFee,
};
