const profileService = require("../services/profileService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const upload = require("../utils/fileUpload");

// Single file upload middleware
const uploadPhoto = upload.single("photo");

/**
 * Get authenticated user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with user profile
 */
async function getProfile(req, res) {
  try {
    const profile = await profileService.getAuthUserProfile(req);
    return successResponse(
      res,
      profile,
      "User profile retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve user profile",
      500
    );
  }
}

/**
 * Update authenticated user profile
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated user profile
 */
async function updateProfile(req, res) {
  try {
    uploadPhoto(req, res, async (err) => {
      if (err) {
        return errorResponse(res, err.message, "File upload failed", 400);
      }

      try {
        // Add file path to request body if file was uploaded
        if (req.file) {
          req.body.photo = `/uploads/${req.file.filename}`;
        }

        const profile = await profileService.updateAuthUserProfile(
          req,
          req.body
        );
        return successResponse(
          res,
          profile,
          "User profile updated successfully",
          200
        );
      } catch (innerError) {
        return errorResponse(
          res,
          innerError.message,
          "Profile update failed",
          400
        );
      }
    });
  } catch (error) {
    return errorResponse(res, error.message, "Profile update failed", 400);
  }
}

/**
 * Get authenticated user's bank account details
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with user's bank account details
 */
async function getBankAccount(req, res) {
  try {
    const bankAccount = await profileService.getUserBankAccount(req);
    return successResponse(
      res,
      bankAccount,
      "Bank account details retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve bank account details",
      error.message.includes("not found") ? 404 : 500
    );
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getBankAccount,
};
