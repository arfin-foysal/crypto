const errorHandlers = require("../utils/errors/handlers");
const formatError = require("../utils/errors/formatter");
const logger = require("../utils/logger"); // You'll need to implement this

const errorMiddleware = (err, req, res, next) => {
  logger.error({
    error: err,
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user?.id,
    },
  });

  let processedError = err;

  // Handle specific error types
  if (err.name === "PrismaClientKnownRequestError") {
    processedError = errorHandlers.prismaError(err);
  } else if (
    ["JsonWebTokenError", "TokenExpiredError", "NotBeforeError"].includes(
      err.name,
    )
  ) {
    processedError = errorHandlers.jwtError(err);
  } else if (err.name === "ValidationError") {
    processedError = errorHandlers.validationError(err);
  }

  // Format the error response
  const errorResponse = formatError(
    processedError,
    process.env.NODE_ENV === "development",
  );

  // Send response
  res.status(processedError.statusCode || 500).json(errorResponse);
};

module.exports = errorMiddleware;
