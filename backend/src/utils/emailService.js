// emailService.js
require("dotenv").config();
const nodemailer = require("nodemailer");
const path = require("path");
const ejs = require("ejs");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async (to, subject, text, html = "") => {
  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USERNAME}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

const sendMailWithTemplate = async (
  to,
  subject,
  templateName,
  templateData,
) => {
  const templatePath = path.join(__dirname, "templates", `${templateName}.ejs`);

  const html = await ejs.renderFile(templatePath, templateData);

  const mailOptions = {
    from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USERNAME}>`,
    to,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Usage examples:
// await sendMail(to, subject, text);
// await sendMailWithTemplate(to, subject, 'welcome', { name, extraNote });

module.exports = { sendMail, sendMailWithTemplate };
