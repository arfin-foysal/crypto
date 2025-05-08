const networkService = require("../services/networkService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createNetworkSchema,
  updateNetworkSchema,
  networkStatusSchema,
} = require("../validations/networkValidation");

/**
 * Get all networks
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with networks
 */
async function getNetworks(req, res) {
  try {
    const networks = await networkService.getAllNetworks(req);
    return successResponse(
      res,
      networks,
      "Networks retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve networks",
      500,
    );
  }
}

/**
 * Get active networks for dropdown
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with active networks
 */
async function getActiveNetworksDropdown(req, res) {
  try {
    const currency_id = req.query.currency_id;
    const networks =
      await networkService.getActiveNetworksDropdown(currency_id);
    return successResponse(
      res,
      networks,
      "Active networks retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve active networks",
      500,
    );
  }
}

/**
 * Get a network by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with network
 */
async function getNetworkById(req, res) {
  try {
    const network = await networkService.getNetworkById(req.params.id);
    return successResponse(res, network, "Network retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Failed to retrieve network", 404);
  }
}

/**
 * Create a new network
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created network
 */
async function createNetwork(req, res) {
  try {
    // Validate request body against schema
    const { error } = createNetworkSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const network = await networkService.createNetwork(req.body);
    return successResponse(res, network, "Network created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, "Network creation failed", 400);
  }
}

/**
 * Update a network
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated network
 */
async function updateNetwork(req, res) {
  try {
    // Validate request body against schema
    const { error } = updateNetworkSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const network = await networkService.updateNetwork(req.params.id, req.body);
    return successResponse(res, network, "Network updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Network update failed", 400);
  }
}

/**
 * Update a network's status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated network
 */
async function updateNetworkStatus(req, res) {
  try {
    // Validate request body against schema
    const { error } = networkStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const network = await networkService.updateNetworkStatus(
      req.params.id,
      req.body.status,
    );
    return successResponse(res, network, "Status updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Status update failed", 400);
  }
}

/**
 * Delete a network
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with deleted network
 */
async function deleteNetwork(req, res) {
  try {
    const network = await networkService.deleteNetwork(req.params.id);
    return successResponse(res, network, "Network deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Network deletion failed", 400);
  }
}

module.exports = {
  getNetworks,
  getActiveNetworksDropdown,
  getNetworkById,
  createNetwork,
  updateNetwork,
  updateNetworkStatus,
  deleteNetwork,
};
