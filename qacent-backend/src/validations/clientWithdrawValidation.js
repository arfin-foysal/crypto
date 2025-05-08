const Joi = require("joi");
const { TRANSACTION_STATUS } = require("../constants/constant");

/**
 * Schema for creating a client withdraw
 * Note: This is similar to the admin withdraw schema but without user_id
 */
const clientWithdrawSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be a positive number",
    "any.required": "Amount is required",
  }),

  to_currency_id: Joi.number().positive().allow(null).messages({
    "number.base": "Currency ID must be a number",
    "number.positive": "Currency ID must be a positive number",
  }),

  to_network_id: Joi.number().positive().allow(null).messages({
    "number.base": "Network ID must be a number",
    "number.positive": "Network ID must be a positive number",
  }),

  user_network_id: Joi.number().positive().required().messages({
    "number.base": "User Network ID must be a number",
    "number.positive": "User Network ID must be a positive number",
    "any.required": "User Network ID is required",
  }),

  form_currency_id: Joi.number().positive().allow(null).messages({
    "number.base": "Currency ID must be a number",
    "number.positive": "Currency ID must be a positive number",
  }),

  form_network_id: Joi.number().positive().allow(null).messages({
    "number.base": "Network ID must be a number",
    "number.positive": "Network ID must be a positive number",
  }),

  fee_type: Joi.string().default("WITHDRAW"),

  note: Joi.string().allow(null, ""),
});

module.exports = { clientWithdrawSchema };
