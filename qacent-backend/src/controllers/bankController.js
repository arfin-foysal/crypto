const bankService = require("../services/bankService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const {
  createBankSchema,
  updateBankSchema,
  bankStatusSchema,
} = require("../validations/bankValidation");

async function getBanks(req, res) {
  try {
    const banks = await bankService.getAllBanks(req);
    return successResponse(res, banks, "Banks retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Failed to retrieve banks", 500);
  }
}

async function getBankById(req, res) {
  try {
    const bank = await bankService.getBankById(req.params.id);
    return successResponse(res, bank, "Bank retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Failed to retrieve bank", 404);
  }
}

async function createBank(req, res) {
  try {
    // Validate request body against createBankSchema
    const { error } = createBankSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400,
      );
    }

    // Create bank
    const bank = await bankService.createBank(req.body);
    return successResponse(res, bank, "Bank created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, "Bank creation failed", 400);
  }
}

async function updateBank(req, res) {
  try {
    // Validate request body against updateBankSchema
    const { error } = updateBankSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400,
      );
    }

    // Update bank
    const bank = await bankService.updateBank(req.params.id, req.body);
    return successResponse(res, bank, "Bank updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Bank update failed", 400);
  }
}

async function updateBankStatus(req, res) {
  try {
    // Validate request body against bankStatusSchema
    const { error } = bankStatusSchema.validate(req.body);
    if (error) {
      return errorResponse(
        res,
        error.details[0].message,
        "Validation failed",
        400,
      );
    }

    // Update bank status
    const bank = await bankService.updateBankStatus(
      req.params.id,
      req.body.status,
    );
    return successResponse(res, bank, "Bank status updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Bank status update failed", 400);
  }
}

async function deleteBank(req, res) {
  try {
    await bankService.deleteBank(req.params.id);
    return successResponse(res, null, "Bank deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Bank deletion failed", 400);
  }
}

async function getActiveBanksDropdown(req, res) {
  try {
    const banks = await bankService.getActiveBanksForDropdown();
    return successResponse(
      res,
      banks,
      "Active banks retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve active banks",
      500,
    );
  }
}

module.exports = {
  getBanks,
  getBankById,
  createBank,
  updateBank,
  updateBankStatus,
  deleteBank,
  getActiveBanksDropdown,
};
