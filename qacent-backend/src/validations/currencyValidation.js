const Joi = require("joi");
const { STATUS } = require("../constants/constant");

const createCurrencySchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Currency name is required",
    "string.min": "Currency name must be at least 2 characters",
    "string.max": "Currency name cannot exceed 255 characters",
  }),
  // code is auto-generated, so it's not included in the validation
  // image field is not needed
  usd_rate: Joi.number().precision(2).default(0.0),
  order: Joi.number().integer().allow(null),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .default("ACTIVE")
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

const updateCurrencySchema = Joi.object({
  name: Joi.string().min(2).max(255).messages({
    "string.min": "Currency name must be at least 2 characters",
    "string.max": "Currency name cannot exceed 255 characters",
  }),
  // code is auto-generated and cannot be updated
  // image field is not needed
  usd_rate: Joi.number().precision(2),
  order: Joi.number().integer().allow(null),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
}).min(1); // At least one field must be provided

const currencyStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

module.exports = {
  createCurrencySchema,
  updateCurrencySchema,
  currencyStatusSchema,
};
