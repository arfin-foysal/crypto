const authService = require("../services/authService");
const {
  ValidationError,
  AuthenticationError,
} = require("../utils/errors/types");
const { registerSchema } = require("../validations/authValidator");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const upload = require("../utils/fileUpload");

// Configure upload middleware for verification images
const uploadVerificationImages = upload.fields([
  { name: "verification_image1", maxCount: 1 },
  { name: "verification_image2", maxCount: 1 },
]);

const register = async (req, res, next) => {
  // Handle file uploads first
  uploadVerificationImages(req, res, async (err) => {
    if (err) {
      return errorResponse(res, err.message, "File upload failed", 400);
    }

    try {
      // Add file paths to request body if files were uploaded
      if (req.files) {
        if (req.files.verification_image1) {
          req.body.verification_image1 = `/uploads/${req.files.verification_image1[0].filename}`;
        }
        if (req.files.verification_image2) {
          req.body.verification_image2 = `/uploads/${req.files.verification_image2[0].filename}`;
        }
      }

      const { error } = registerSchema.validate(req.body, {
        abortEarly: false,
      });
      if (error) {
        throw new ValidationError(
          "Invalid registration data",
          422,
          error.details
        );
      }

      const {
        full_name,
        email,
        password,
        country_id,
        verification_type,
        id_number,
        verification_image1,
        verification_image2,
      } = req.body;

      const result = await authService.register(
        full_name,
        email,
        password,
        country_id,
        verification_type,
        id_number,
        verification_image1,
        verification_image2
      );

      return successResponse(res, result, "Registration successful", 201);
    } catch (error) {
      next(error);
    }
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password are required", 422);
    }

    const result = await authService.login(email, password);
    if (!result) {
      throw new AuthenticationError("Invalid credentials", 401);
    }

    return successResponse(res, result, "Login successful", 200);
  } catch (error) {
    next(error);
  }
};

const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ValidationError("Email and password are required", 422);
    }

    const result = await authService.adminLogin(email, password);
    if (!result) {
      throw new AuthenticationError("Invalid credentials", 401);
    }

    return successResponse(res, result, "Admin login successful", 200);
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, adminLogin };
