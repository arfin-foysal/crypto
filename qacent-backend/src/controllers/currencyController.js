const currencyService = require("../services/currencyService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createCurrencySchema,
  updateCurrencySchema,
  currencyStatusSchema,
} = require("../validations/currencyValidation");

/**
 * Get all currencies
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with currencies
 */
async function getCurrencies(req, res) {
  try {
    const currencies = await currencyService.getAllCurrencies(req);
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
 * Get active currencies for dropdown
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with active currencies
 */
async function getActiveCurrenciesDropdown(req, res) {
  try {
    const currencies = await currencyService.getActiveCurrenciesDropdown();
    return successResponse(
      res,
      currencies,
      "Active currencies retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve active currencies",
      500,
    );
  }
}

/**
 * Get a currency by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with currency
 */
async function getCurrencyById(req, res) {
  try {
    const currency = await currencyService.getCurrencyById(req.params.id);
    return successResponse(
      res,
      currency,
      "Currency retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve currency",
      404,
    );
  }
}

/**
 * Create a new currency
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created currency
 */
async function createCurrency(req, res) {
  try {
    // Validate request body against schema
    const { error } = createCurrencySchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const currency = await currencyService.createCurrency(req.body);
    return successResponse(res, currency, "Currency created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, "Currency creation failed", 400);
  }
}

/**
 * Update a currency
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated currency
 */
async function updateCurrency(req, res) {
  try {
    // Validate request body against schema
    const { error } = updateCurrencySchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const currency = await currencyService.updateCurrency(
      req.params.id,
      req.body,
    );
    return successResponse(res, currency, "Currency updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Currency update failed", 400);
  }
}

/**
 * Update a currency's status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated currency
 */
async function updateCurrencyStatus(req, res) {
  try {
    // Validate request body against schema
    const { error } = currencyStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const currency = await currencyService.updateCurrencyStatus(
      req.params.id,
      req.body.status,
    );
    return successResponse(res, currency, "Status updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Status update failed", 400);
  }
}

/**
 * Delete a currency
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with deleted currency
 */
async function deleteCurrency(req, res) {
  try {
    const currency = await currencyService.deleteCurrency(req.params.id);
    return successResponse(res, currency, "Currency deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Currency deletion failed", 400);
  }
}

module.exports = {
  getCurrencies,
  getActiveCurrenciesDropdown,
  getCurrencyById,
  createCurrency,
  updateCurrency,
  updateCurrencyStatus,
  deleteCurrency,
};
