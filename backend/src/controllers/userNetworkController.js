const userNetworkService = require("../services/userNetworkService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createUserNetworkSchema,
  updateUserNetworkSchema,
  userNetworkStatusSchema,
} = require("../validations/userNetworkValidation");
const currencyService = require("../services/currencyService");

/**
 * Get all user networks for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with user networks
 */
async function getUserNetworks(req, res) {
  try {
    const userNetworks = await userNetworkService.getUserNetworks(req);
    return successResponse(
      res,
      userNetworks,
      "User networks retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve user networks",
      500,
    );
  }
}

/**
 * Get a user network by ID for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with user network
 */
async function getUserNetworkById(req, res) {
  try {
    const userNetwork = await userNetworkService.getUserNetworkById(
      req.params.id,
      req,
    );
    return successResponse(
      res,
      userNetwork,
      "User network retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve user network",
      error.message.includes("not found") ? 404 : 500,
    );
  }
}

/**
 * Create a new user network for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created user network
 */
async function createUserNetwork(req, res) {
  try {
    // Validate request body against schema
    const { error } = createUserNetworkSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const userNetwork = await userNetworkService.createUserNetwork(
      req.body,
      req,
    );
    return successResponse(
      res,
      userNetwork,
      "User network created successfully",
      201,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to create user network",
      400,
    );
  }
}

/**
 * Update a user network for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated user network
 */
async function updateUserNetwork(req, res) {
  try {
    // Validate request body against schema
    const { error } = updateUserNetworkSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const userNetwork = await userNetworkService.updateUserNetwork(
      req.params.id,
      req.body,
      req,
    );
    return successResponse(
      res,
      userNetwork,
      "User network updated successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to update user network",
      error.message.includes("not found") ? 404 : 400,
    );
  }
}

/**
 * Update a user network's status for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated user network
 */
async function updateUserNetworkStatus(req, res) {
  try {
    // Validate request body against schema
    const { error } = userNetworkStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const userNetwork = await userNetworkService.updateUserNetworkStatus(
      req.params.id,
      req.body.status_user,
      req,
    );
    return successResponse(
      res,
      userNetwork,
      "User network status updated successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to update user network status",
      error.message.includes("not found") ? 404 : 400,
    );
  }
}

/**
 * Delete a user network for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with deleted user network
 */
async function deleteUserNetwork(req, res) {
  try {
    const userNetwork = await userNetworkService.deleteUserNetwork(
      req.params.id,
      req,
    );
    return successResponse(
      res,
      userNetwork,
      "User network deleted successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to delete user network",
      error.message.includes("not found") ? 404 : 400,
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
      await userNetworkService.getActiveNetworksForDropdown(currency_id);
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
 * Get all user networks for the authenticated user without pagination
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with user networks
 */
async function getUserNetworksAddress(req, res) {
  try {
    const userNetworks =
      await userNetworkService.getAllUserNetworksWithoutPagination(req);
    return successResponse(
      res,
      userNetworks,
      "User networks retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve user networks",
      500,
    );
  }
}

/**
 * Get currencies for dropdown
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with currencies
 */
async function getCurrenciesDropdown(req, res) {
  try {
    // Import the currency service
    const currencies = await currencyService.getActiveCurrenciesDropdown();
    return successResponse(
      res,
      currencies,
      "Currencies retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve currencies",
      500,
    );
  }
}

/**
 * Get networks by currency ID for dropdown
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with networks
 */
async function getNetworksByCurrencyDropdown(req, res) {
  try {
    const currency_id = req.params.currency_id;
    if (!currency_id) {
      return errorResponse(
        res,
        "Currency ID is required",
        "Validation failed",
        422,
      );
    }

    const networks =
      await userNetworkService.getActiveNetworksForDropdown(currency_id);
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
 * Get user network addresses by network ID for dropdown
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with user network addresses
 */
async function getUserNetworkAddressesByNetworkDropdown(req, res) {
  try {
    const network_id = req.params.network_id;
    if (!network_id) {
      return errorResponse(
        res,
        "Network ID is required",
        "Validation failed",
        422,
      );
    }

    const addresses =
      await userNetworkService.getUserNetworkAddressesByNetworkId(
        network_id,
        req,
      );
    return successResponse(
      res,
      addresses,
      "Network addresses retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve network addresses",
      500,
    );
  }
}

/**
 * Get user network addresses by currency ID for dropdown
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with user network addresses
 */
async function getUserNetworkAddressesByCurrencyDropdown(req, res) {
  try {
    const currency_id = req.params.currency_id;
    if (!currency_id) {
      return errorResponse(
        res,
        "Currency ID is required",
        "Validation failed",
        422,
      );
    }

    const addresses =
      await userNetworkService.getUserNetworkAddressesByCurrencyId(
        currency_id,
        req,
      );
    return successResponse(
      res,
      addresses,
      "Network addresses retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve network addresses",
      500,
    );
  }
}

module.exports = {
  getUserNetworks,
  getUserNetworkById,
  createUserNetwork,
  updateUserNetwork,
  updateUserNetworkStatus,
  deleteUserNetwork,
  getActiveNetworksDropdown,
  getUserNetworksAddress,
  getCurrenciesDropdown,
  getNetworksByCurrencyDropdown,
  getUserNetworkAddressesByNetworkDropdown,
  getUserNetworkAddressesByCurrencyDropdown,
};
