const express = require("express");
const Route = express.Router();
const jwt = require("../src/middlewares/authMiddleware");
const rateLimiter = require("../src/middlewares/rateLimiterMiddleware");
const index = require("../src/routes/api");
const auth = require("../src/routes/auth");
const web = require("../src/routes/web");
const open = require("../src/routes/open");

const client = require("../src/routes/client");

/**
 * Apply rate limiter to specific routes
 * @param {string} path - Route path to apply rate limiter to (default "/")
 * @param {number} max - Maximum number of requests (default 100)
 * @param {number} windowMs - Time window in milliseconds (default 15 minutes)
 * @param {string} message - Custom error message (default "Too many requests. Please try again later.")
 * @return {Function} Middleware function to apply rate limiter
 * @example
 * Route.use(rateLimiter({ path: "/api/", max: 100, windowMs: 15 * 60 * 1000, message: "Too many requests. Please try again later." }));
 * Route.use("/api/clients/", [jwt, rateLimiter({ max: 5, windowMs: 5 * 60 * 1000 })], [client]);
 *
 */

Route.use("/api/auth/", auth);
Route.use("/api/open/", open);
Route.use("/api/clients/", [jwt], [client]);
Route.use("/api/", [jwt], [index]);
Route.use("/", web);

module.exports = Route;
