const rateLimit = require("express-rate-limit");

/**
 * Dynamic Rate Limiter Middleware with Default Settings
 * @param {Object} options
 * @param {number} [options.max=100] - Maximum number of requests (default 100)
 * @param {number} [options.windowMs=15 * 60 * 1000] - Time window in milliseconds (default 15 minutes)
 * @param {string} [options.message='Too many requests. Please try again later.'] - Custom error message (default message)
 */
const rateLimiter = ({
  max = 100,
  windowMs = 15 * 60 * 1000,
  message = "Too many requests. Please try again later.",
} = {}) => {
  return rateLimit({
    max,
    windowMs,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

module.exports = rateLimiter;
