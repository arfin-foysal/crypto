const {
  ValidationError,
  DatabaseError,
  AuthenticationError,
} = require("./types");

const errorHandlers = {
  prismaError: (err) => {
    const prismaErrors = {
      P2002: () =>
        new ValidationError("Duplicate entry found", {
          field: err.meta?.target?.[0],
          code: "UNIQUE_CONSTRAINT",
        }),
      P2014: () =>
        new DatabaseError("Invalid ID provided", {
          details: err.message,
          code: "INVALID_ID",
        }),
      P2025: () =>
        new DatabaseError("Record not found", {
          details: err.meta?.cause,
          code: "RECORD_NOT_FOUND",
        }),
      default: () =>
        new DatabaseError("Database operation failed", {
          details: err.message,
          code: err.code,
        }),
    };

    const handler = prismaErrors[err.code] || prismaErrors.default;
    return handler();
  },

  jwtError: (err) => {
    const jwtErrors = {
      JsonWebTokenError: () =>
        new AuthenticationError("Invalid token provided"),
      TokenExpiredError: () => new AuthenticationError("Token has expired"),
      NotBeforeError: () => new AuthenticationError("Token not yet valid"),
      default: () => new AuthenticationError("Token validation failed"),
    };

    const handler = jwtErrors[err.name] || jwtErrors.default;
    return handler();
  },

  validationError: (err) => {
    return new ValidationError("Validation failed", {
      details: err.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        type: detail.type,
      })),
    });
  },
};

module.exports = errorHandlers;
