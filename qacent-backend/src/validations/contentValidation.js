const Joi = require("joi");

const createContentSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  description: Joi.string().allow(null, ""),
  status: Joi.string().valid("ACTIVE", "FROZEN").default("ACTIVE").messages({
    "any.only": "Status must be either ACTIVE or FROZEN",
  }),
});

const updateContentSchema = Joi.object({
  name: Joi.string().messages({
    "string.empty": "Name cannot be empty",
  }),
  description: Joi.string().allow(null, ""),
  status: Joi.string().valid("ACTIVE", "FROZEN").messages({
    "any.only": "Status must be either ACTIVE or FROZEN",
  }),
}).min(1); // At least one field must be provided

module.exports = {
  createContentSchema,
  updateContentSchema,
};
