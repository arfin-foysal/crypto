var express = require("express");
const {
  register,
  login,
  adminLogin,
} = require("../controllers/authController");
var Route = express.Router();

Route.post("/register", register);
Route.post("/login", login);
Route.post("/admin-login", adminLogin);

module.exports = Route;
