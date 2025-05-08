const transactionFeeService = require("../services/transactionFeeService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const { TFEE_TYPES } = require("../constants/constant");

/**
 * Get transaction fee by fee type for client users
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with transaction fee
 */
async function getTransactionFeeByType(req, res) {
  try {
    const transactionFee = await transactionFeeService.getTransactionFeeByType(
      req.params.fee_type
    );
    return successResponse(
      res,
      transactionFee,
      "Transaction fee retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve transaction fee",
      404
    );
  }
}

/**
 * Get withdraw fee for client users
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with withdraw fee
 */
async function getWithdrawFee(req, res) {
  try {
    const transactionFee = await transactionFeeService.getTransactionFeeByType(
      TFEE_TYPES.WITHDRAW
    );
    return successResponse(
      res,
      transactionFee,
      "Withdraw fee retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve withdraw fee",
      404
    );
  }
}

module.exports = {
  getTransactionFeeByType,
  getWithdrawFee,
};
