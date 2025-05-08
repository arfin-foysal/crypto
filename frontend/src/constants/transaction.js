/**
 * Transaction status constants
 */
export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUND: "REFUND",
  IN_REVIEW: "IN_REVIEW",
};

/**
 * Transaction type constants
 */
export const TRANSACTION_TYPE = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
};

/**
 * Get status badge class based on status
 * @param {string} status - Transaction status
 * @returns {string} - CSS class for the badge
 */
export const getStatusBadgeClass = (status) => {
  switch (status) {
    case TRANSACTION_STATUS.COMPLETED:
      return " text-[#648A3A]";
    case TRANSACTION_STATUS.PENDING:
      return " text-[#F59E0B]";
    case TRANSACTION_STATUS.FAILED:
      return " text-[#EF4444]";
    case TRANSACTION_STATUS.REFUND:
      return " text-[#0EA5E9]";
    case TRANSACTION_STATUS.IN_REVIEW:
      return " text-[#9333EA]";
    default:
      return "text-[#6B7280]";
  }
};

/**
 * Format date to readable format
 * @param {string} dateString - Date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Format date: DD MMM YYYY HH:MM
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  return date.toLocaleDateString("en-US", options);
};

/**
 * Format amount with currency symbol
 * @param {number|string} amount - Amount to format
 * @returns {string} - Formatted amount
 */
export const formatAmount = (amount) => {
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
};

/**
 * Format fee type for display
 * @param {string} feeType - Fee type from API
 * @returns {string} - Formatted fee type for display
 */
export const formatFeeType = (feeType) => {
  if (!feeType) return "-";

  // Convert to title case
  return feeType
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
