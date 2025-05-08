const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

/**
 * Send a simple notification email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.userName - User's name
 * @param {string} options.message - Main message content
 * @param {string} options.actionUrl - URL for action link
 * @param {string} options.actionText - Text for action link
 * @param {string} options.subject - Email subject
 * @returns {Promise} Email sending result
 */
const email = async (options) => {
  try {
    // Read email template
    const templatePath = path.join(__dirname, '../views/templates/simple-notification.html');
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Prepare data for template
    const data = {
      userName: options.userName || 'there',
      message: options.message || '',
      actionUrl: options.actionUrl || '#',
      actionText: options.actionText || 'Click here',
    };
    
    // Replace placeholders in template
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, data[key]);
    });
    
    // Prepare email options
    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_USERNAME}>`,
      to: options.to,
      subject: options.subject || 'Qacent Notification',
      html: template,
      attachments: [
        {
          filename: 'logo.svg',
          path: path.join(__dirname, '../assets/logo.svg'),
          cid: 'logo'
        }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = {
  email,
};
