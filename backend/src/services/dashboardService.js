const { PrismaClient, Decimal } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  STATUS,
  TRANSACTION_STATUS,
  TRANSACTION_TYPES,
  ROLES,
} = require("../constants/constant");

/**
 * Get dashboard statistics
 * @returns {Object} Dashboard statistics
 */
async function getDashboardData() {
  try {
    // Get total registered users (users with bank accounts)
    const totalRegisteredUsers = await prisma.user.count({
      where: {
        role: ROLES.USER,
      },
    });

    // Get total active users
    const totalActiveUsers = await prisma.user.count({
      where: {
        status: STATUS.ACTIVE,
        role: ROLES.USER,
      },
    });

    // Get total pending users (users without bank accounts)
    const totalPendingUsers = await prisma.user.count({
      where: {
        status: STATUS.PENDING,
      },
    });

    // Get total funds (sum of all user balances)
    const totalFundsResult = await prisma.user.aggregate({
      _sum: {
        balance: true,
      },
    });
    const totalFunds = totalFundsResult._sum.balance || new Decimal(0);

    // Get total funds received (sum of all completed deposit transactions)
    const totalFundsReceivedResult = await prisma.balance.aggregate({
      where: {
        transaction_type: TRANSACTION_TYPES.DEPOSIT,
        status: TRANSACTION_STATUS.COMPLETED,
      },
      _sum: {
        amount: true,
      },
    });
    const totalFundsReceived =
      totalFundsReceivedResult._sum.amount || new Decimal(0);

    // Get total transactions under review
    const totalTransactionsUnderReview = await prisma.balance.count({
      where: {
        status: TRANSACTION_STATUS.IN_REVIEW,
      },
    });

    // Get latest withdraw requests (7 entries)
    const latestWithdrawRequests = await prisma.balance.findMany({
      where: {
        transaction_type: TRANSACTION_TYPES.WITHDRAW,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 7,
      include: {
        user: {
          select: {
            id: true,
            full_name: true,
            email: true,
          },
        },
      },
    });

    // Format withdraw requests
    const formattedWithdrawRequests = latestWithdrawRequests.map(
      (withdraw) => ({
        id: withdraw.id.toString(),
        uid: withdraw.uid,
        transaction_id: withdraw.transaction_id,
        amount: Number(withdraw.amount).toFixed(2),
        status: withdraw.status,
        created_at: withdraw.created_at,
        user: withdraw.user
          ? {
              id: withdraw.user.id.toString(),
              full_name: withdraw.user.full_name,
              email: withdraw.user.email,
            }
          : null,
      }),
    );

    // Get last 7 days registration data
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const count = await prisma.user.count({
        where: {
          created_at: {
            gte: date,
            lt: nextDate,
          },
        },
      });

      last7Days.push({
        date: date.toISOString().split("T")[0],
        count,
      });
    }

    // Get last 7 days total funds data
    const last7DaysFunds = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);

      // For each day, we need to get the total balance of all users as of that day
      // This is a simplification - in a real system, you might need a more complex query
      // that takes into account the historical balances
      const totalBalanceResult = await prisma.user.aggregate({
        _sum: {
          balance: true,
        },
      });

      const totalBalance = totalBalanceResult._sum.balance || new Decimal(0);

      last7DaysFunds.push({
        date: date.toISOString().split("T")[0],
        amount: Number(totalBalance).toFixed(2),
      });
    }

    return {
      total_registered_users: totalRegisteredUsers,
      total_active_users: totalActiveUsers,
      total_pending_users: totalPendingUsers,
      total_funds: Number(totalFunds).toFixed(2),
      total_funds_received: Number(totalFundsReceived).toFixed(2),
      total_transactions_under_review: totalTransactionsUnderReview,
      latest_withdraw_requests: formattedWithdrawRequests,
      registration_chart_data: last7Days,
      funds_chart_data: last7DaysFunds,
    };
  } catch (error) {
    throw new Error(`Failed to fetch dashboard data: ${error.message}`);
  }
}

module.exports = {
  getDashboardData,
};
