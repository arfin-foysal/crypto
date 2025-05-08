const clientDashboardService = require("../services/clientDashboardService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

/**
 * Get balance changes data for chart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with balance changes data
 */
async function getBalanceChangesData(req, res) {
  try {
    const chartData = await clientDashboardService.getBalanceChangesData(req);
    return successResponse(
      res,
      chartData,
      "Balance changes data retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve balance changes data",
      500
    );
  }
}

module.exports = {
  getBalanceChangesData,
};
