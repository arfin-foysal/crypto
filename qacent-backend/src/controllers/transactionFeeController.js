const transactionFeeService = require("../services/transactionFeeService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createTransactionFeeSchema,
  updateTransactionFeeSchema,
} = require("../validations/transactionFeeValidation");

/**
 * Get all transaction fees
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transaction fees
 */
async function getTransactionFees(req, res) {
  try {
    const transactionFees = await transactionFeeService.getAllTransactionFees();
    return successResponse(
      res,
      transactionFees,
      "Transaction fees retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve transaction fees",
      500,
    );
  }
}

/**
 * Get transaction fee by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transaction fee
 */
async function getTransactionFeeById(req, res) {
  try {
    const transactionFee = await transactionFeeService.getTransactionFeeById(
      req.params.id,
    );
    return successResponse(
      res,
      transactionFee,
      "Transaction fee retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve transaction fee",
      404,
    );
  }
}

/**
 * Get transaction fee by fee type
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transaction fee
 */
async function getTransactionFeeByType(req, res) {
  try {
    const transactionFee = await transactionFeeService.getTransactionFeeByType(
      req.params.fee_type,
    );
    return successResponse(
      res,
      transactionFee,
      "Transaction fee retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve transaction fee",
      404,
    );
  }
}

/**
 * Create a new transaction fee
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created transaction fee
 */
async function createTransactionFee(req, res) {
  try {
    // Validate request body against createTransactionFeeSchema
    const { error } = createTransactionFeeSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400,
      );
    }

    // Create transaction fee
    const transactionFee = await transactionFeeService.createTransactionFee(
      req.body,
    );
    return successResponse(
      res,
      transactionFee,
      "Transaction fee created successfully",
      201,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Transaction fee creation failed",
      400,
    );
  }
}

/**
 * Update a transaction fee
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated transaction fee
 */
async function updateTransactionFee(req, res) {
  try {
    // Validate request body against updateTransactionFeeSchema
    const { error } = updateTransactionFeeSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400,
      );
    }

    // Update transaction fee
    const transactionFee = await transactionFeeService.updateTransactionFee(
      req.params.id,
      req.body,
    );
    return successResponse(
      res,
      transactionFee,
      "Transaction fee updated successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Transaction fee update failed",
      400,
    );
  }
}

/**
 * Delete a transaction fee
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with success message
 */
async function deleteTransactionFee(req, res) {
  try {
    await transactionFeeService.deleteTransactionFee(req.params.id);
    return successResponse(
      res,
      null,
      "Transaction fee deleted successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Transaction fee deletion failed",
      400,
    );
  }
}

module.exports = {
  getTransactionFees,
  getTransactionFeeById,
  getTransactionFeeByType,
  createTransactionFee,
  updateTransactionFee,
  deleteTransactionFee,
};
