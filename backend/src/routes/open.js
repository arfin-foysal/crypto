const express = require("express");
const Route = express.Router();
const countryController = require("../controllers/countryController");


Route.get("/dropdown/countries",countryController.getActiveCountriesDropdown);

module.exports = Route;
