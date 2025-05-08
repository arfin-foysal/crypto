const bankAccountService = require("../services/bankAccountService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createBankAccountSchema,
  updateBankAccountSchema,
  bankAccountStatusSchema,
  assignBankAccountSchema,
} = require("../validations/bankAccountValidation");

async function getBankAccounts(req, res) {
  try {
    const bankAccounts = await bankAccountService.getAllBankAccounts(req);
    return successResponse(
      res,
      bankAccounts,
      "Bank accounts retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve bank accounts",
      500
    );
  }
}

async function getBankAccountById(req, res) {
  try {
    const bankAccount = await bankAccountService.getBankAccountById(
      req.params.id
    );
    return successResponse(
      res,
      bankAccount,
      "Bank account retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve bank account",
      404
    );
  }
}

async function createBankAccount(req, res) {
  try {
    // Validate request body against createBankAccountSchema
    const { error } = createBankAccountSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400
      );
    }

    // Create bank account with user-provided account number
    const bankAccount = await bankAccountService.createBankAccount(req.body);
    return successResponse(
      res,
      bankAccount,
      "Bank account created successfully",
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Bank account creation failed",
      400
    );
  }
}

async function updateBankAccount(req, res) {
  try {
    // Account number can now be updated

    // Validate request body against updateBankAccountSchema
    const { error } = updateBankAccountSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400
      );
    }

    // Update bank account
    const bankAccount = await bankAccountService.updateBankAccount(
      req.params.id,
      req.body
    );
    return successResponse(
      res,
      bankAccount,
      "Bank account updated successfully",
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, "Bank account update failed", 400);
  }
}

async function updateBankAccountStatus(req, res) {
  try {
    // Validate request body against bankAccountStatusSchema
    const { error } = bankAccountStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400
      );
    }

    // Update bank account status
    const bankAccount = await bankAccountService.updateBankAccountStatus(
      req.params.id,
      req.body.is_open
    );
    return successResponse(
      res,
      bankAccount,
      "Bank account status updated successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Bank account status update failed",
      400
    );
  }
}

async function deleteBankAccount(req, res) {
  try {
    await bankAccountService.deleteBankAccount(req.params.id);
    return successResponse(res, null, "Bank account deleted successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Bank account deletion failed",
      400
    );
  }
}
async function bulkCreateBankAccounts(req, res) {
  try {
    const bankAccounts = await bankAccountService.bulkCreateBankAccounts(
      req.body
    );
    return successResponse(
      res,
      bankAccounts,
      "Bank accounts created successfully",
      201
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Bank account creation failed",
      400
    );
  }
}

/**
 * Get unassigned bank accounts for dropdown
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with unassigned bank accounts
 */
async function getUnassignedBankAccountsDropdown(req, res) {
  try {
    const bankAccounts =
      await bankAccountService.getUnassignedBankAccountsForDropdown();
    return successResponse(
      res,
      bankAccounts,
      "Unassigned bank accounts retrieved successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve unassigned bank accounts",
      500
    );
  }
}

/**
 * Assign a user to a bank account
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} Response with updated bank account
 */
async function assignUserToBankAccount(req, res) {
  try {
    // Validate request body against assignBankAccountSchema
    const { error } = assignBankAccountSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400
      );
    }

    // Assign user to bank account
    const bankAccount = await bankAccountService.assignUserToBankAccount(
      req.body
    );

    // Create appropriate success message based on whether a previous account was unassigned
    let message = "User assigned to bank account successfully";
    if (bankAccount.previous_account) {
      message =
        "User's previous bank account was unassigned and new bank account was assigned successfully";
    }

    return successResponse(res, bankAccount, message, 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to assign user to bank account",
      400
    );
  }
}

module.exports = {
  getBankAccounts,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  updateBankAccountStatus,
  deleteBankAccount,
  bulkCreateBankAccounts,
  getUnassignedBankAccountsDropdown,
  assignUserToBankAccount,
};
