const { email } = require("../notifications/email");

/**
 * Example of sending an account approval email
 * @param {Object} user - User object with email and full_name
 * @param {boolean} waitForResponse - Whether to wait for email sending response
 * @returns {Promise<boolean>} Success status
 */
const sendEmail = async (user, details = {}) => {
  try {
    // Synchronous version (waits for response)
    await email({
      to: user?.email,
      userName: user?.full_name,
      subject: details?.subject || "Your account was approved!",
      message: details?.message || "Your account was approved! You can now receive ACH transfers directly in Qacent.",
      actionUrl: `${process.env.FRONTEND_URL}/dashboard`,
      actionText: "Click here to head to Qacent.",
    });

    console.log(`Account approval email sent to ${user?.email}`);
    return true;
  } catch (error) {
    console.error(
      `Failed to send account approval email to ${user?.email}:`,
      error
    );
    return false;
  }
};

module.exports = {
  sendEmail,
};
