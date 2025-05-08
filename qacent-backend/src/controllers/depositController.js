const { TRANSACTION_STATUS } = require("../constants/constant");
const { sendEmail } = require("../emails/emailService");
const depositService = require("../services/depositService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createDepositSchema,
  depositStatusSchema,
} = require("../validations/depositValidation");

/**
 * Create a new deposit transaction
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with created deposit
 */
async function createDeposit(req, res) {
  try {
    // Validate request body against schema
    const { error } = createDepositSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422
      );
    }

    const deposit = await depositService.createDeposit(req.body);

    //<---------------send email --------------------------->
    const emailTemplates = {
      [TRANSACTION_STATUS.COMPLETED]: {
        subject: "Your deposit was successful!",
        message: "Your deposit was successful! Your balance has been updated.",
      },
      [TRANSACTION_STATUS.FAILED]: {
        subject: "Your deposit failed!",
        message:
          "Your deposit failed! Please contact support for more information.",
      },
      [TRANSACTION_STATUS.REFUND]: {
        subject: "Your deposit was refunded!",
        message: "Your deposit was refunded! Your balance has been updated.",
      },
      [TRANSACTION_STATUS.IN_REVIEW]: {
        subject: "Your deposit is under review!",
        message:
          "Your deposit is under review! Please wait for further instructions.",
      },
    };

    const emailContent = emailTemplates[deposit.status];
    if (emailContent) {
      sendEmail(deposit.user, emailContent);
    }

    //<---------------send email --------------------------->

    return successResponse(res, deposit, "Deposit created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, "Failed to create deposit", 400);
  }
}

/**
 * Update deposit status
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated deposit
 */
async function updateDepositStatus(req, res) {
  try {
    // Validate request body against schema
    const { error } = depositStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        422
      );
    }

    const deposit = await depositService.updateDepositStatus(
      req.params.id,
      req.body.status
    );

    //<---------------send email --------------------------->

    const emailTemplates = {
      [TRANSACTION_STATUS.COMPLETED]: {
        subject: "Your deposit was successful!",
        message: "Your deposit was successful! Your balance has been updated.",
      },
      [TRANSACTION_STATUS.FAILED]: {
        subject: "Your deposit failed!",
        message:
          "Your deposit failed! Please contact support for more information.",
      },
      [TRANSACTION_STATUS.REFUND]: {
        subject: "Your deposit was refunded!",
        message: "Your deposit was refunded! Your balance has been updated.",
      },
      [TRANSACTION_STATUS.IN_REVIEW]: {
        subject: "Your deposit is under review!",
        message:
          "Your deposit is under review! Please wait for further instructions.",
      },
    };

    const emailContent = emailTemplates[deposit.status];
    if (emailContent) {
      sendEmail(deposit.user, emailContent);
    }
    //<---------------send email --------------------------->

    return successResponse(
      res,
      deposit,
      "Deposit status updated successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to update deposit status",
      400
    );
  }
}

module.exports = {
  createDeposit,
  updateDepositStatus,
};
