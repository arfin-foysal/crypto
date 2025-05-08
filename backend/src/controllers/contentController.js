const contentService = require("../services/contentService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createContentSchema,
  updateContentSchema,
} = require("../validations/contentValidation");

/**
 * Get all contents
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with all contents
 */
async function getContents(req, res) {
  try {
    const contents = await contentService.getAllContents();
    return successResponse(
      res,
      contents,
      "Contents retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve contents",
      500
    );
  }
}

/**
 * Get content by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with content
 */
async function getContentById(req, res) {
  try {
    const content = await contentService.getContentById(req.params.id);
    return successResponse(
      res,
      content,
      "Content retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve content",
      error.message.includes("not found") ? 404 : 500
    );
  }
}

/**
 * Create content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created content
 */
async function createContent(req, res) {
  try {
    // Validate request body against createContentSchema
    const { error } = createContentSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400
      );
    }

    const content = await contentService.createContent(req.body);
    return successResponse(
      res,
      content,
      "Content created successfully",
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Content creation failed",
      400
    );
  }
}

/**
 * Update content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated content
 */
async function updateContent(req, res) {
  try {
    // Validate request body against updateContentSchema
    const { error } = updateContentSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400
      );
    }

    const content = await contentService.updateContent(
      req.params.id,
      req.body
    );
    return successResponse(
      res,
      content,
      "Content updated successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Content update failed",
      error.message.includes("not found") ? 404 : 400
    );
  }
}

/**
 * Delete content
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with success message
 */
async function deleteContent(req, res) {
  try {
    await contentService.deleteContent(req.params.id);
    return successResponse(
      res,
      null,
      "Content deleted successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Content deletion failed",
      error.message.includes("not found") ? 404 : 500
    );
  }
}

async function getContentByIds(req, res) {
  try {
    const ids = req.query.ids;
    const contents = await contentService.getContentByIds(ids);
    return successResponse(
      res,
      contents,
      "Contents retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve contents",
      500
    );
  }
}



module.exports = {
  getContents,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  getContentByIds
};
