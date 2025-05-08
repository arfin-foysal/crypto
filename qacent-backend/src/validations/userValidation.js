const Joi = require("joi");

const createUserSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  photo: Joi.any(),
  phone: Joi.string().allow(null, ""),
  dob: Joi.string().allow(null, ""),
  address: Joi.string().allow(null, ""),
  country_id: Joi.number().allow(null),
  status: Joi.string()
    .valid("PENDING", "ACTIVE", "FROZEN", "SUSPENDED")
    .default("PENDING"),
  role: Joi.string().valid("ADMIN", "USER").default("USER"),
  balance: Joi.number().default(0),
});

const updateUserSchema = Joi.object({
  full_name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  photo: Joi.any(),
  phone: Joi.string().allow(null, ""),
  dob: Joi.string().allow(null, ""),
  address: Joi.string().allow(null, ""),
  country_id: Joi.number().allow(null),
  status: Joi.string().valid("PENDING", "ACTIVE", "FROZEN", "SUSPENDED"),
  role: Joi.string().valid("ADMIN", "USER"),
  balance: Joi.number(),
}).min(1); // At least one field must be provided

module.exports = { createUserSchema, updateUserSchema };
