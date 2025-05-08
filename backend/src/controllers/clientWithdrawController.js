const { sendEmail } = require("../emails/emailService");
const clientWithdrawService = require("../services/clientWithdrawService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  clientWithdrawSchema,
} = require("../validations/clientWithdrawValidation");

/**
 * Create a new withdraw transaction for the authenticated user
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created withdraw
 */
async function createClientWithdraw(req, res) {
  try {
    // Validate request body against schema
    const { error } = clientWithdrawSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422
      );
    }

    const withdraw = await clientWithdrawService.createClientWithdraw(
      req.body,
      req
    );

    //<---------------send email --------------------------->

    sendEmail(withdraw.user, {
      subject: "Your withdraw request was successful!",
      message:
        "Your withdraw request was successful! Your balance has been updated. Processing time: 1-12 hours.",
    });
    //<---------------send email --------------------------->

    return successResponse(
      res,
      withdraw,
      "Withdraw request submitted successfully",
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to create withdraw request",
      400
    );
  }
}

module.exports = {
  createClientWithdraw,
};
