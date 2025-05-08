const dashboardService = require("../services/dashboardService");
const { successResponse, errorResponse } = require("../utils/responseHelper");

/**
 * Get dashboard data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with dashboard data
 */
async function getDashboardData(req, res) {
  try {
    const dashboardData = await dashboardService.getDashboardData();
    return successResponse(
      res,
      dashboardData,
      "Dashboard data retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve dashboard data",
      500,
    );
  }
}

module.exports = {
  getDashboardData,
};
