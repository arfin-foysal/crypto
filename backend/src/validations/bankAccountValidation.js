const Joi = require("joi");

const createBankAccountSchema = Joi.object({
  user_id: Joi.number().allow(null),
  bank_id: Joi.number().required().messages({
    "number.base": "Bank ID must be a number",
    "any.required": "Bank ID is required",
  }),
  routing_no: Joi.string().max(255).allow(null, ""),
  account_number: Joi.string().max(255).required().messages({
    "string.empty": "Account number is required",
    "any.required": "Account number is required",
  }),
  is_open: Joi.boolean().default(true),
});

const updateBankAccountSchema = Joi.object({
  user_id: Joi.number().allow(null),
  bank_id: Joi.number(),
  routing_no: Joi.string().max(255).allow(null, ""),
  account_number: Joi.string().max(255),
  is_open: Joi.boolean(),
}).min(1); // At least one field must be provided

const bankAccountStatusSchema = Joi.object({
  is_open: Joi.boolean().required().messages({
    "boolean.base": "Status must be a boolean",
    "any.required": "Status is required",
  }),
});

const bulkBankAccountSchema = Joi.object({
  bank_id: Joi.number().required().messages({
    "number.base": "Bank ID must be a number",
    "any.required": "Bank ID is required",
  }),
  bank_accounts: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Bank accounts must be an array",
    "any.required": "Bank accounts are required",
  }),
});

const assignBankAccountSchema = Joi.object({
  user_id: Joi.number().required().messages({
    "number.base": "User ID must be a number",
    "any.required": "User ID is required",
  }),
  bank_account_id: Joi.number().required().messages({
    "number.base": "Bank account ID must be a number",
    "any.required": "Bank account ID is required",
  }),
});

module.exports = {
  createBankAccountSchema,
  updateBankAccountSchema,
  bankAccountStatusSchema,
  bulkBankAccountSchema,
  assignBankAccountSchema,
};
