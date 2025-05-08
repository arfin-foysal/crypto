const countryService = require("../services/countryService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createCountrySchema,
  updateCountrySchema,
  countryStatusSchema,
} = require("../validations/countryValidation");

/**
 * Get all countries with pagination, search, and filter
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with countries and pagination metadata
 */
async function getCountries(req, res) {
  try {
    const countries = await countryService.getAllCountries(req);
    return successResponse(
      res,
      countries,
      "Countries retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve countries",
      500,
    );
  }
}

/**
 * Get active countries for dropdown with search functionality
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with active countries
 */
async function getActiveCountriesDropdown(req, res) {
  try {
    const countries = await countryService.getActiveCountriesForDropdown(req);
    return successResponse(
      res,
      countries,
      "Active countries retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve active countries",
      500,
    );
  }
}

/**
 * Get a country by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with country
 */
async function getCountryById(req, res) {
  try {
    const country = await countryService.getCountryById(req.params.id);
    return successResponse(res, country, "Country retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Failed to retrieve country", 404);
  }
}

/**
 * Create a new country
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created country
 */
async function createCountry(req, res) {
  try {
    // Validate request body against schema
    const { error } = createCountrySchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const country = await countryService.createCountry(req.body);
    return successResponse(res, country, "Country created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, "Country creation failed", 400);
  }
}

/**
 * Update a country
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated country
 */
async function updateCountry(req, res) {
  try {
    // Validate request body against schema
    const { error } = updateCountrySchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const country = await countryService.updateCountry(req.params.id, req.body);
    return successResponse(res, country, "Country updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Country update failed", 400);
  }
}

/**
 * Update a country's status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated country
 */
async function updateCountryStatus(req, res) {
  try {
    // Validate request body against schema
    const { error } = countryStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422,
      );
    }

    const country = await countryService.updateCountryStatus(
      req.params.id,
      req.body,
    );
    return successResponse(
      res,
      country,
      "Country status updated successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Country status update failed",
      400,
    );
  }
}

/**
 * Delete a country
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with deleted country
 */
async function deleteCountry(req, res) {
  try {
    const country = await countryService.deleteCountry(req.params.id);
    return successResponse(res, country, "Country deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Country deletion failed", 400);
  }
}

module.exports = {
  getCountries,
  getActiveCountriesDropdown,
  getCountryById,
  createCountry,
  updateCountry,
  updateCountryStatus,
  deleteCountry,
};
