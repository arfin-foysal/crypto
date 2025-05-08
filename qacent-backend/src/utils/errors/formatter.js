const formatError = (err, includeStack = false) => {
  const response = {
    errors: err.message,
    message: err.errorCode
      ? `${err.errorCode} error occurred`
      : "An error occurred",
    status: false,
  };

  if (err.errors) {
    // If errors is an object with details, convert to string for consistency
    if (typeof err.errors === "object" && !Array.isArray(err.errors)) {
      response.errors = JSON.stringify(err.errors);
    } else if (Array.isArray(err.errors)) {
      response.errors = err.errors.join(", ");
    }
  }

  if (includeStack && err.stack) {
    response.stack = err.stack;
  }

  return response;
};

module.exports = formatError;
