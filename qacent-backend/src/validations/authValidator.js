const Joi = require("joi");

// **Register Validation**
const registerSchema = Joi.object({
  full_name: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name cannot exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().min(6).max(20).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
    "string.max": "Password cannot exceed 20 characters",
  }),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "string.empty": "Confirm password is required",
      "any.only": "Passwords must match",
    }),
  country_id: Joi.number().required().messages({
    "number.base": "Country ID must be a number",
    "any.required": "Country ID is required",
  }),
  verification_type: Joi.string().required().messages({
    "string.empty": "Verification type is required",
  }),
  id_number: Joi.string().required().messages({
    "string.empty": "ID number is required",
  }),
  verification_image1: Joi.any(),
  verification_image2: Joi.any(),
});

// **Login Validation**
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email format",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

module.exports = { registerSchema, loginSchema };
