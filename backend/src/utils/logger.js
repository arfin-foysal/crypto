/**
 * Simple logger utility for the application
 */
const logger = {
  /**
   * Log an error message
   * @param {Object|string} message - The error message or object to log
   */
  error: (message) => {
    console.error(
      "[ERROR]",
      typeof message === "object" ? JSON.stringify(message, null, 2) : message,
    );
  },

  /**
   * Log an info message
   * @param {Object|string} message - The info message or object to log
   */
  info: (message) => {
    console.info(
      "[INFO]",
      typeof message === "object" ? JSON.stringify(message, null, 2) : message,
    );
  },

  /**
   * Log a warning message
   * @param {Object|string} message - The warning message or object to log
   */
  warn: (message) => {
    console.warn(
      "[WARN]",
      typeof message === "object" ? JSON.stringify(message, null, 2) : message,
    );
  },

  /**
   * Log a debug message
   * @param {Object|string} message - The debug message or object to log
   */
  debug: (message) => {
    if (process.env.NODE_ENV === "development") {
      console.debug(
        "[DEBUG]",
        typeof message === "object"
          ? JSON.stringify(message, null, 2)
          : message,
      );
    }
  },
};

module.exports = logger;
