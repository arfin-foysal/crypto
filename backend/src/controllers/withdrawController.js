const Auth = require("../utils/auth");
const withdrawService = require("../services/withdrawService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  withdrawStatusSchema,
  createWithdrawSchema,
} = require("../validations/withdrawValidation");
const { sendEmail } = require("../emails/emailService");

async function getWithdraws(req, res) {
  try {
    const users = await withdrawService.getWithdraws(req);
    return successResponse(res, users, "Withdraws retrieved successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve withdraws",
      500
    );
  }
}

/**
 * Get withdraw transaction by ID with all relationship data
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with withdraw details
 */
async function getWithdrawById(req, res) {
  try {
    const withdraw = await withdrawService.getWithdrawById(req.params.id);
    return successResponse(
      res,
      withdraw,
      "Withdraw transaction retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve withdraw transaction",
      error.message.includes("not found") ? 404 : 500
    );
  }
}

async function updateUserStatus(req, res) {
  try {
    // Validate request body against schema
    const { error } = withdrawStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422
      );
    }

    const withdraw = await withdrawService.updateWithdrawStatus(
      req.params.id,
      req.body.status
    );

    // <--------------- send email --------------------------->
    const emailTemplates = {
      COMPLETED: {
        subject: "Your withdraw was successful!",
        message: "Your withdraw was successful! Your balance has been updated.",
      },
      FAILED: {
        subject: "Your withdraw failed!",
        message:
          "Your withdraw failed! Please contact support for more information.",
      },
      REFUND: {
        subject: "Your withdraw was refunded!",
        message: "Your withdraw was refunded! Your balance has been updated.",
      },
      IN_REVIEW: {
        subject: "Your withdraw is under review!",
        message:
          "Your withdraw is under review! Please wait for further instructions.",
      },
    };

    const emailContent = emailTemplates[withdraw.status];
    if (emailContent) {
      sendEmail(withdraw.user, emailContent);
    }

    return successResponse(res, withdraw, "Status updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Status update failed", 400);
  }
}

/**
 * Create a new withdraw transaction
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created withdraw
 */
async function createWithdraw(req, res) {
  try {
    // Validate request body against schema
    const { error } = createWithdrawSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422
      );
    }

    const withdraw = await withdrawService.createWithdraw(req.body);
    return successResponse(res, withdraw, "Withdraw created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, "Failed to create withdraw", 400);
  }
}

module.exports = {
  getWithdraws,
  updateUserStatus,
  createWithdraw,
  getWithdrawById,
};
