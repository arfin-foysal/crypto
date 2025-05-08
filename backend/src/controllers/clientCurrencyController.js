const currencyService = require("../services/currencyService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

/**
 * Get currency details by ID for client users
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with currency details
 */
async function getCurrencyById(req, res) {
  try {
    const currency = await currencyService.getCurrencyById(req.params.id);
    return successResponse(
      res,
      currency,
      "Currency details retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve currency details",
      404
    );
  }
}

module.exports = {
  getCurrencyById,
};
