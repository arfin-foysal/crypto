const Joi = require("joi");
const { STATUS } = require("../constants/constant");

/**
 * Schema for creating a user network
 */
const createUserNetworkSchema = Joi.object({
  currency_id: Joi.number().required().messages({
    "number.base": "Currency ID must be a number",
    "any.required": "Currency ID is required",
  }),
  network_id: Joi.number().required().messages({
    "number.base": "Network ID must be a number",
    "any.required": "Network ID is required",
  }),
  name: Joi.string().allow(null, ""),
  network_address: Joi.string().allow(null, ""),
  link: Joi.string().allow(null, ""),
  status_user: Joi.string()
    .valid(...Object.values(STATUS))
    .default("ACTIVE")
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

/**
 * Schema for updating a user network
 */
const updateUserNetworkSchema = Joi.object({
  currency_id: Joi.number(),
  network_id: Joi.number(),
  name: Joi.string().allow(null, ""),
  network_address: Joi.string().allow(null, ""),
  link: Joi.string().allow(null, ""),
  status_user: Joi.string()
    .valid(...Object.values(STATUS))
    .messages({
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
}).min(1); // At least one field must be provided

/**
 * Schema for updating a user network's status
 */
const userNetworkStatusSchema = Joi.object({
  status_user: Joi.string()
    .valid(...Object.values(STATUS))
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": `Status must be one of: ${Object.values(STATUS).join(", ")}`,
    }),
});

module.exports = {
  createUserNetworkSchema,
  updateUserNetworkSchema,
  userNetworkStatusSchema,
};
