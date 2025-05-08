var express = require("express");
const { sendMail } = require("../utils/emailService");
var Route = express.Router();

/* GET home page. */
Route.get("/", (req, res, next) => {
  res.render("index", { title: "Express" });
});

// Route.get("/emails", async (req, res, next) => {
//   const to = 'af.arfinfoysal@gmail.com';
//   const subject = "Test Email";
//   const text = "This is a test email.";
//   await sendMail(to, subject, text);
//   res.send("Email sent successfully to " + to);
// });

// up
Route.get("/up", (req, res, next) => {
  res.send("Up and running");
});

module.exports = Route;
