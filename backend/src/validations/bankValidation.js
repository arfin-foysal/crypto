const Joi = require("joi");
const { STATUS } = require("../constants/constant");

const createBankSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Bank name is required",
    "string.min": "Bank name must be at least 2 characters",
    "string.max": "Bank name cannot exceed 255 characters",
  }),
  currency_id: Joi.number().allow(null),
  ach_routing_no: Joi.string().max(255).allow(null, ""),
  wire_routing_no: Joi.string().max(255).allow(null, ""),
  sort_code: Joi.string().max(255).allow(null, ""),
  swift_code: Joi.string().max(255).allow(null, ""),
  address: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  account_type: Joi.string().max(255).allow(null, ""),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .default("PENDING")
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

const updateBankSchema = Joi.object({
  name: Joi.string().min(2).max(255).messages({
    "string.min": "Bank name must be at least 2 characters",
    "string.max": "Bank name cannot exceed 255 characters",
  }),
  currency_id: Joi.number().allow(null),
  ach_routing_no: Joi.string().max(255).allow(null, ""),
  wire_routing_no: Joi.string().max(255).allow(null, ""),
  sort_code: Joi.string().max(255).allow(null, ""),
  swift_code: Joi.string().max(255).allow(null, ""),
  address: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  account_type: Joi.string().max(255).allow(null, ""),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
}).min(1); // At least one field must be provided

const bankStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

module.exports = { createBankSchema, updateBankSchema, bankStatusSchema };
