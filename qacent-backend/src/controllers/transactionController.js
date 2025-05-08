const transactionService = require("../services/transactionService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  transactionStatusSchema,
} = require("../validations/transactionValidation");
const { TRANSACTION_STATUS } = require("../constants/constant");
const {
  getAllowedNextStatuses,
  getStatusDescription,
} = require("../utils/statusTransition");

/**
 * Get all transactions with pagination, filtering, and search
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transactions
 */
async function getTransactions(req, res) {
  try {
    const transactions = await transactionService.getAllTransactions(req);
    return successResponse(
      res,
      transactions,
      "Transactions retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve transactions",
      500,
    );
  }
}
/**
 * Get all transactions with pagination, filtering, and search
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transactions
 */
async function getTransactionsByUser(req, res) {
  try {
    const transactions = await transactionService.getAllTransactionsByUser(req);
    return successResponse(
      res,
      transactions,
      "Transactions retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve transactions",
      500,
    );
  }
}

/**
 * Get transaction by ID with all relationship data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transaction details
 */
async function getTransactionById(req, res) {
  try {
    const transaction = await transactionService.getTransactionById(
      req.params.id,
    );

    // Get all possible status options for dropdown
    const statusOptions = Object.values(TRANSACTION_STATUS);

    // Get allowed next statuses based on current status and transaction type
    const allowedNextStatuses = getAllowedNextStatuses(
      transaction.transaction_type,
      transaction.status,
    );

    // Get status descriptions for better UI display
    const statusDescriptions = {};
    statusOptions.forEach((status) => {
      statusDescriptions[status] = getStatusDescription(status);
    });

    return successResponse(
      res,
      {
        ...transaction,
        statusOptions,
        allowedNextStatuses,
        statusDescriptions,
        currentStatusDescription: getStatusDescription(transaction.status),
      },
      "Transaction retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve transaction",
      error.message.includes("not found") ? 404 : 500,
    );
  }
}

/**
 * Update transaction status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated transaction
 */
async function updateTransactionStatus(req, res) {
  try {
    // Validate request body against schema
    const { error } = transactionStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const transaction = await transactionService.updateTransactionStatus(
      req.params.id,
      req.body.status,
    );
    return successResponse(
      res,
      transaction,
      "Transaction status updated successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to update transaction status",
      error.message.includes("not found") ? 404 : 400,
    );
  }
}

/**
 * Get transactions by user ID with pagination, filtering, and search
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transactions
 */
async function getTransactionsByUserId(req, res) {
  try {
    const userId = req.params.user_id;

    if (!userId) {
      return errorResponse(res, "User ID is required", "Missing user ID", 400);
    }

    const transactions = await transactionService.getTransactionsByUserId(
      userId,
      req,
    );
    return successResponse(
      res,
      transactions,
      "User transactions retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve user transactions",
      error.message.includes("invalid input syntax") ? 400 : 500,
    );
  }
}

module.exports = {
  getTransactions,
  getTransactionById,
  updateTransactionStatus,
  getTransactionsByUser,
  getTransactionsByUserId,
};
