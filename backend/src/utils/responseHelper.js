const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    data: data,
    message: message,
    status: true,
  });
};

const errorResponse = (res, error, message, statusCode = 400) => {
  // Create the response object in the desired format
  const response = {
    errors: error instanceof Error ? error.message : error,
    message: message,
    status: false,
  };

  // Add stack trace in development mode
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };
