const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const Routes = require("./config/routes");
const errorMiddleware = require("./src/middlewares/errorMiddleware");
const rateLimiter = require("./src/middlewares/rateLimiterMiddleware");
const { NotFoundError } = require("./src/utils/errors/types");

const app = express();

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Logging
app.use(logger("dev"));

// Static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// View engine setup
app.set("views", path.join(__dirname, "/src/views"));
app.set("view engine", "ejs");

// Apply global rate limiter (100 requests per 15 minutes)
// app.use(rateLimiter());

// Routes
app.use("/", Routes);

// 404 handler
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.url} not found`));
});

// BigInt serialization
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Error handling
app.use(errorMiddleware);

module.exports = app;
