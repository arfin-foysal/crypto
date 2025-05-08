const {
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
} = require("../constants/constant");

/**
 * Defines allowed status transitions for different transaction types
 *
 * The structure is:
 * {
 *   [transactionType]: {
 *     [fromStatus]: [allowedToStatus1, allowedToStatus2, ...]
 *   }
 * }
 */
const ALLOWED_TRANSITIONS = {
  // Deposit transaction status transitions
  [TRANSACTION_TYPES.DEPOSIT]: {
    [TRANSACTION_STATUS.PENDING]: [
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.FAILED,
      TRANSACTION_STATUS.IN_REVIEW,
    ],
    [TRANSACTION_STATUS.IN_REVIEW]: [
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.FAILED,
      TRANSACTION_STATUS.REFUND,
    ],

    [TRANSACTION_STATUS.COMPLETED]: [TRANSACTION_STATUS.REFUND],
    [TRANSACTION_STATUS.FAILED]: [TRANSACTION_STATUS.PENDING],
    // Terminal states with no further transitions
    [TRANSACTION_STATUS.REFUND]: [],
  },

  // Withdraw transaction status transitions
  [TRANSACTION_TYPES.WITHDRAW]: {
    [TRANSACTION_STATUS.PENDING]: [
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.FAILED,
      TRANSACTION_STATUS.IN_REVIEW,
      TRANSACTION_STATUS.REFUND,
    ],
    [TRANSACTION_STATUS.IN_REVIEW]: [
      TRANSACTION_STATUS.COMPLETED,
      TRANSACTION_STATUS.FAILED,
      TRANSACTION_STATUS.REFUND,
    ],

    [TRANSACTION_STATUS.COMPLETED]: [TRANSACTION_STATUS.REFUND],
    [TRANSACTION_STATUS.FAILED]: [
      TRANSACTION_STATUS.PENDING,
      TRANSACTION_STATUS.REFUND,
    ],
    // Terminal states with no further transitions
    [TRANSACTION_STATUS.REFUND]: [],
  },
};

/**
 * Checks if a status transition is allowed
 * @param {string} transactionType - Type of transaction (DEPOSIT, WITHDRAW)
 * @param {string} fromStatus - Current status
 * @param {string} toStatus - Target status
 * @returns {boolean} Whether the transition is allowed
 */
function isTransitionAllowed(transactionType, fromStatus, toStatus) {
  // If status is not changing, it's always allowed
  if (fromStatus === toStatus) {
    return true;
  }

  // Check if transaction type exists in allowed transitions
  if (!ALLOWED_TRANSITIONS[transactionType]) {
    return false;
  }

  // Check if current status exists in allowed transitions for this transaction type
  if (!ALLOWED_TRANSITIONS[transactionType][fromStatus]) {
    return false;
  }

  // Check if target status is in the list of allowed transitions
  return ALLOWED_TRANSITIONS[transactionType][fromStatus].includes(toStatus);
}

/**
 * Gets all allowed next statuses for a transaction
 * @param {string} transactionType - Type of transaction (DEPOSIT, WITHDRAW)
 * @param {string} currentStatus - Current status
 * @returns {Array} List of allowed next statuses
 */
function getAllowedNextStatuses(transactionType, currentStatus) {
  // Check if transaction type exists in allowed transitions
  if (!ALLOWED_TRANSITIONS[transactionType]) {
    return [];
  }

  // Check if current status exists in allowed transitions for this transaction type
  if (!ALLOWED_TRANSITIONS[transactionType][currentStatus]) {
    return [];
  }

  // Return the list of allowed transitions
  return ALLOWED_TRANSITIONS[transactionType][currentStatus];
}

/**
 * Gets a human-readable description of a status
 * @param {string} status - Transaction status
 * @returns {string} Human-readable description
 */
function getStatusDescription(status) {
  const descriptions = {
    [TRANSACTION_STATUS.PENDING]: "Transaction is being processed",
    [TRANSACTION_STATUS.COMPLETED]:
      "Transaction has been completed successfully",
    [TRANSACTION_STATUS.FAILED]: "Transaction has failed",
    [TRANSACTION_STATUS.REFUND]: "Transaction has been refunded",
    [TRANSACTION_STATUS.IN_REVIEW]: "Transaction is under review",
  };

  return descriptions[status] || "Unknown status";
}

module.exports = {
  isTransitionAllowed,
  getAllowedNextStatuses,
  getStatusDescription,
  ALLOWED_TRANSITIONS,
};
