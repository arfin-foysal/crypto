const { PrismaClient, Decimal } = require("@prisma/client");
const prisma = new PrismaClient();
const Auth = require("../utils/auth");
const { TRANSACTION_STATUS } = require("../constants/constant");

/**
 * Get balance changes data for the last 7 days for the authenticated user
 * @param {Object} req - Request object
 * @returns {Object} Balance changes data for chart
 */
async function getBalanceChangesData(req) {
  try {
    // Get authenticated user ID
    const userId = await Auth.id(req);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get current date and date 7 days ago
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 7 days including today
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the day

    // Get user's current balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Get all transactions for the last 7 days
    const transactions = await prisma.balance.findMany({
      where: {
        user_id: userId,
        created_at: {
          gte: sevenDaysAgo,
        },
        status: TRANSACTION_STATUS.COMPLETED,
      },
      orderBy: {
        created_at: "asc",
      },
      select: {
        id: true,
        amount: true,
        after_balance: true,
        transaction_type: true,
        created_at: true,
      },
    });

    // Group transactions by day and calculate daily balance
    const dailyData = [];
    const dateMap = new Map();

    // Initialize array with dates for the last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();
      
      const formattedDate = `${month} ${day}, ${year}`;
      
      dateMap.set(dateStr, {
        date: formattedDate,
        balance: null,
        transactions: [],
      });
    }

    // Add transactions to their respective days
    transactions.forEach(transaction => {
      const dateStr = transaction.created_at.toISOString().split('T')[0];
      
      if (dateMap.has(dateStr)) {
        const dayData = dateMap.get(dateStr);
        dayData.transactions.push(transaction);
        // Use the latest transaction's after_balance for the day
        dayData.balance = Number(transaction.after_balance);
      }
    });

    // Fill in missing balances with the previous day's balance or user's current balance
    let lastKnownBalance = Number(user.balance);
    
    // Convert map to array and sort by date
    const sortedDates = Array.from(dateMap.entries())
      .sort((a, b) => new Date(a[0]) - new Date(b[0]));
    
    // Start from the most recent day and work backwards
    for (let i = sortedDates.length - 1; i >= 0; i--) {
      const [_, dayData] = sortedDates[i];
      
      if (dayData.balance === null) {
        dayData.balance = lastKnownBalance;
      } else {
        lastKnownBalance = dayData.balance;
      }
      
      // Add to the result array
      dailyData.push({
        date: dayData.date,
        balance: dayData.balance.toFixed(2),
      });
    }

    // Reverse to get chronological order
    dailyData.reverse();

    return dailyData;
  } catch (error) {
    throw new Error(`Failed to fetch balance changes data: ${error.message}`);
  }
}

module.exports = {
  getBalanceChangesData,
};
