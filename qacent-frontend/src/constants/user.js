/**
 * User status constants
 */
export const USER_STATUS = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  FROZEN: "FROZEN",
  SUSPENDED: "SUSPENDED",
};

/**
 * Check if user can withdraw based on status
 * @param {string} status - User status
 * @returns {boolean} - Whether user can withdraw
 */
export const canUserWithdraw = (status) => {
  return status === USER_STATUS.ACTIVE;
};

/**
 * Get status message based on user status
 * @param {string} status - User status
 * @returns {string} - Message explaining why user cannot withdraw
 */
export const getWithdrawStatusMessage = (status) => {
  switch (status) {
    case USER_STATUS.PENDING:
      return "Your account is pending verification. You cannot withdraw funds until your account is active.";
    case USER_STATUS.FROZEN:
      return "Your account is frozen. Please contact support to resolve this issue.";
    case USER_STATUS.SUSPENDED:
      return "Your account is suspended. Please contact support for assistance.";
    default:
      return "You cannot withdraw funds at this time. Please contact support.";
  }
};
