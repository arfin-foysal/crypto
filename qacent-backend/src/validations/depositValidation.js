const Joi = require("joi");
const { TRANSACTION_STATUS, FEE_TYPES } = require("../constants/constant");

const createDepositSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),

  user_id: Joi.number().positive().required().messages({
    "number.base": "User ID must be a number",
    "number.positive": "User ID must be a positive number",
    "any.required": "User ID is required",
  }),

  to_currency_id: Joi.number().positive().allow(null).messages({
    "number.base": "Currency ID must be a number",
    "number.positive": "Currency ID must be a positive number",
  }),

  to_network_id: Joi.number().positive().allow(null).messages({
    "number.base": "Network ID must be a number",
    "number.positive": "Network ID must be a positive number",
  }),

  form_currency_id: Joi.number().positive().allow(null).messages({
    "number.base": "Currency ID must be a number",
    "number.positive": "Currency ID must be a positive number",
  }),
  form_network_id: Joi.number().positive().allow(null).messages({
    "number.base": "Network ID must be a number",
    "number.positive": "Network ID must be a positive number",
  }),

  charge_amount: Joi.number().required().messages({
    "number.base": "Charge amount must be a number",
    "any.required": "Charge amount is required",
  }),

  fee_type: Joi.string().allow(null, ""),
  status: Joi.string()
    .valid(...Object.values(TRANSACTION_STATUS))
    .default(TRANSACTION_STATUS.PENDING)
    .messages({
      "any.only": `Status must be one of: ${Object.values(
        TRANSACTION_STATUS,
      ).join(", ")}`,
    }),
});

const depositStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TRANSACTION_STATUS))
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": `Status must be one of: ${Object.values(
        TRANSACTION_STATUS,
      ).join(", ")}`,
    }),
});

module.exports = { createDepositSchema, depositStatusSchema };
