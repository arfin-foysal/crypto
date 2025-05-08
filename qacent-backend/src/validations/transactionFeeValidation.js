const Joi = require("joi");
const { TFEE_TYPES } = require("../constants/constant");

const createTransactionFeeSchema = Joi.object({
  fee_type: Joi.string()
    .valid(...Object.values(TFEE_TYPES))
    .required()
    .messages({
      "string.empty": "Fee type is required",
      "any.only": `Fee type must be one of: ${Object.values(TFEE_TYPES).join(", ")}`,
    }),
  fee: Joi.number().integer().min(0).required().messages({
    "number.base": "Fee must be a number",
    "number.integer": "Fee must be an integer",
    "number.min": "Fee must be at least 0",
  }),
});

const updateTransactionFeeSchema = Joi.object({
  fee_type: Joi.string()
    .valid(...Object.values(TFEE_TYPES))
    .messages({
      "any.only": `Fee type must be one of: ${Object.values(TFEE_TYPES).join(", ")}`,
    }),
  fee: Joi.number().integer().min(0).messages({
    "number.base": "Fee must be a number",
    "number.integer": "Fee must be an integer",
    "number.min": "Fee must be at least 0",
  }),
}).min(1); // At least one field must be provided

module.exports = {
  createTransactionFeeSchema,
  updateTransactionFeeSchema,
};
