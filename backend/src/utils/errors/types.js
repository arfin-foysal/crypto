const AppError = require("./AppError");

class ValidationError extends AppError {
  constructor(message, errors = null) {
    super(message, 422, errors, "VALIDATION_ERROR");
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401, null, "AUTHENTICATION_ERROR");
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403, null, "AUTHORIZATION_ERROR");
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404, null, "NOT_FOUND_ERROR");
  }
}

class DatabaseError extends AppError {
  constructor(message, errors = null) {
    super(message, 500, errors, "DATABASE_ERROR");
  }
}

class BusinessLogicError extends AppError {
  constructor(message, errors = null) {
    super(message, 400, errors, "BUSINESS_LOGIC_ERROR");
  }
}

module.exports = {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DatabaseError,
  BusinessLogicError,
};
