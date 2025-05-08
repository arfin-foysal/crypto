const Joi = require("joi");
const { STATUS } = require("../constants/constant");

const createCountrySchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Country name is required",
    "string.min": "Country name must be at least 2 characters",
    "string.max": "Country name cannot exceed 255 characters",
  }),
  code: Joi.string().max(10).allow(null, "").messages({
    "string.max": "Country code cannot exceed 10 characters",
  }),
  order_index: Joi.number().integer().allow(null),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .default("ACTIVE")
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

const updateCountrySchema = Joi.object({
  name: Joi.string().min(2).max(255).messages({
    "string.min": "Country name must be at least 2 characters",
    "string.max": "Country name cannot exceed 255 characters",
  }),
  code: Joi.string().max(10).allow(null, "").messages({
    "string.max": "Country code cannot exceed 10 characters",
  }),
  order_index: Joi.number().integer().allow(null),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
}).min(1); // At least one field must be provided

const countryStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

module.exports = {
  createCountrySchema,
  updateCountrySchema,
  countryStatusSchema,
};
