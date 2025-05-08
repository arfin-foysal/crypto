const Joi = require("joi");
const { STATUS } = require("../constants/constant");

const createNetworkSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().messages({
    "string.empty": "Network name is required",
    "string.min": "Network name must be at least 2 characters",
    "string.max": "Network name cannot exceed 255 characters",
  }),
  // code is auto-generated, so it's not included in the validation
  // image field is not needed
  currency_id: Joi.number().required().messages({
    "number.base": "Currency ID must be a number",
    "any.required": "Currency ID is required",
  }),
  order: Joi.number().integer().allow(null),
  enable_extra_field: Joi.boolean().default(false),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .default("ACTIVE")
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

const updateNetworkSchema = Joi.object({
  name: Joi.string().min(2).max(255).messages({
    "string.min": "Network name must be at least 2 characters",
    "string.max": "Network name cannot exceed 255 characters",
  }),
  // code is auto-generated and cannot be updated
  // image field is not needed
  currency_id: Joi.number(),
  order: Joi.number().integer().allow(null),
  enable_extra_field: Joi.boolean(),
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
}).min(1); // At least one field must be provided

const networkStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(STATUS))
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

module.exports = {
  createNetworkSchema,
  updateNetworkSchema,
  networkStatusSchema,
};
