const Auth = require("../utils/auth");
const userService = require("../services/userService");
const { successResponse, errorResponse } = require("../utils/responseHelper");
const upload = require("../utils/fileUpload");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validations/userValidation");

// Single file upload middleware
const uploadPhoto = upload.single("photo");

async function getUsers(req, res) {
  try {
    // Get current authenticated user
    const currentUser = await Auth.user(req);

    // res.status(200).json(currentUser);

    // Check if user is authenticated
    if (await Auth.check(req)) {
      // Do something
    }

    // Get user ID
    const userId = await Auth.id(req);

    const users = await userService.getAllUsers(req);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function addUser(req, res) {
  try {
    // Handle file upload
    uploadPhoto(req, res, async (err) => {
      if (err) {
        return errorResponse(res, err.message, "File upload failed", 400);
      }

      try {
        // Add file path to request body if file was uploaded
        if (req.file) {
          req.body.photo = `/uploads/${req.file.filename}`;
        }

        // Validate request body against createUserSchema
        const { error } = createUserSchema.validate(req.body);
        if (error) {
          return errorResponse(
            res,
            error.details[0].message,
            "Validation failed",
            400,
          );
        }

        // Create user
        const user = await userService.createUser(req.body);
        return successResponse(res, user, "User created successfully", 201);
      } catch (innerError) {
        return errorResponse(
          res,
          innerError.message,
          "User creation failed",
          400,
        );
      }
    });
  } catch (error) {
    return errorResponse(res, error.message, "User creation failed", 400);
  }
}

async function updateUserStatus(req, res) {
  try {
    if (!req.body.status) {
      return errorResponse(res, "Status is required", "Validation failed", 400);
    }

    const user = await userService.updateUserStatus(
      req.params.id,
      req.body.status,
    );
    return successResponse(res, user, "User status updated successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "User status update failed", 400);
  }
}

async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    return successResponse(res, user, "User retrieved successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "Failed to retrieve user", 500);
  }
}

async function updateUser(req, res) {
  try {
    uploadPhoto(req, res, async (err) => {
      if (err) {
        return errorResponse(res, err.message, "File upload failed", 400);
      }

      try {
        // Add file path to request body if file was uploaded
        if (req.file) {
          req.body.photo = `/uploads/${req.file.filename}`;
        }

        // Validate request body against updateUserSchema
        const { error } = updateUserSchema.validate(req.body);
        if (error) {
          return errorResponse(
            res,
            error.details[0].message,
            "Validation failed",
            400,
          );
        }

        // Update user
        const user = await userService.updateUser(req.params.id, req.body);
        return successResponse(res, user, "User updated successfully", 200);
      } catch (innerError) {
        return errorResponse(
          res,
          innerError.message,
          "User update failed",
          400,
        );
      }
    });
  } catch (error) {
    return errorResponse(res, error.message, "User update failed", 400);
  }
}

async function deleteUser(req, res) {
  try {
    await userService.deleteUser(req.params.id);
    return successResponse(res, null, "User deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, "User deletion failed", 400);
  }
}

async function getActiveUsersDropdown(req, res) {
  try {
    const users = await userService.getActiveUsersForDropdown();
    return successResponse(
      res,
      users,
      "Active users retrieved successfully",
      200,
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Failed to retrieve active users",
      500,
    );
  }
}

module.exports = {
  getUsers,
  addUser,
  updateUserStatus,
  getUserById,
  updateUser,
  deleteUser,
  getActiveUsersDropdown,
};
