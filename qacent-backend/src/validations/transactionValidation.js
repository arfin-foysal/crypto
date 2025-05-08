const Joi = require("joi");
const { TRANSACTION_STATUS } = require("../constants/constant");

const transactionStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(TRANSACTION_STATUS))
    .required()
    .messages({
      "string.empty": "Status is required",
      "any.only": `Status must be one of: ${Object.values(TRANSACTION_STATUS).join(", ")}`,
    }),
});

module.exports = { transactionStatusSchema };
