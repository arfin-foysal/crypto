"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import apiService from "@/services/api";
import StatusBadge from "@/components/backend/StatusBadge";
import toast from "react-hot-toast";
import { useNavigation } from "@/context/NavigationContext";
import {
  TRANSACTION_TYPE,
  formatDate,
  formatAmount,
  formatFeeType,
} from "@/constants/transaction";
import {
  USER_STATUS,
  canUserWithdraw,
  getWithdrawStatusMessage,
} from "@/constants/user";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

const Dashboard = () => {
  const router = useRouter();
  const { setSidebarNavigation } = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(true);
  const [transactionsError, setTransactionsError] = useState(null);
  const [bankAccount, setBankAccount] = useState(null);
  const [isBankLoading, setIsBankLoading] = useState(true);
  const [bankError, setBankError] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [userStatus, setUserStatus] = useState(null);
  const [isUserStatusLoading, setIsUserStatusLoading] = useState(true);
  const [currencyDetails, setCurrencyDetails] = useState(null);
  const [currencyRate, setCurrencyRate] = useState(1);
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [chartInfo, setChartInfo] = useState({
    title: "Balance Changes Comparison Chart",
    description:
      "The Qacent Protocol is an In-Depth Analysis of Balance Changes: A Thorough Comparison of Adjustments Across Different Patches and Versions.",
    subtitle: "Transactions of last 7 days",
  });
  const [chartYAxis, setChartYAxis] = useState({
    min: 0,
    max: 300,
    stepSize: 50,
  });
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);
  const chartRef = useRef(null);

  // Handle navigation with shimmer loader
  const handleNavigation = (path) => {
    setSidebarNavigation(true); // Trigger shimmer loader
    router.push(path);
  };

  // Memoized function to format currency with proper decimal places and thousands separators
  const formatCurrency = useCallback(
    (amount, currencyCode = "USDC", decimals = 2) => {
      if (!amount) return `0,00 ${currencyCode}`;

      // Parse the amount if it's a string with currency symbol
      let numericAmount = amount;
      if (typeof amount === "string") {
        // Remove currency symbol and commas
        numericAmount = parseFloat(amount.replace(/[$,]/g, ""));
      }

      // Check if parsing was successful
      if (isNaN(numericAmount)) return `0,00 ${currencyCode}`;

      // Format with proper decimal places
      const formattedAmount = numericAmount.toFixed(decimals);

      // Add thousands separators and replace decimal point with comma
      const parts = formattedAmount.split(".");

      // Format integer part with dot as thousands separator
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

      // Ensure we always have a decimal part with exactly 2 digits
      if (!parts[1]) parts[1] = "00";
      else if (parts[1].length === 1) parts[1] += "0";

      // Join with comma as decimal separator
      return `${parts[0]},${parts[1]} ${currencyCode}`;
    },
    []
  );

  // Memoized function to format a number with comma as decimal separator and dot as thousands separator
  const formatNumber = useCallback((number, decimals = 2) => {
    if (number === null || number === undefined) return "0,00";

    // Format with proper decimal places
    const formattedAmount = parseFloat(number).toFixed(decimals);

    // Add thousands separators and replace decimal point with comma
    const parts = formattedAmount.split(".");

    // Format integer part with dot as thousands separator
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    // Ensure we always have a decimal part with exactly 2 digits
    if (!parts[1]) parts[1] = "00";
    else if (parts[1].length === 1) parts[1] += "0";

    // Join with comma as decimal separator
    return `${parts[0]},${parts[1]}`;
  }, []);

  // Memoized function to calculate equivalent amount in another currency
  const calculateEquivalent = useCallback(
    (amount, rate, _fromCurrency, toCurrency) => {
      if (!amount || !rate) return formatCurrency(0, toCurrency);

      // Parse the amount if it's a string with currency symbol
      let numericAmount = amount;
      if (typeof amount === "string") {
        // Remove currency symbol and commas
        numericAmount = parseFloat(amount.replace(/[$,]/g, ""));
      }

      // Check if parsing was successful
      if (isNaN(numericAmount)) return formatCurrency(0, toCurrency);

      // Calculate equivalent amount
      const equivalentAmount = numericAmount * rate;

      return formatCurrency(equivalentAmount, toCurrency);
    },
    [formatCurrency]
  );

  // Function to copy text to clipboard
  const copyToClipboard = useCallback((text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy to clipboard");
      });
  }, []);

  // Copy all bank details to clipboard
  const copyAllDetails = useCallback(() => {
    if (!bankAccount) return;

    const details = [
      `Account Holder: ${bankAccount?.user?.full_name || "N/A"}`,
      `Bank Name: ${bankAccount?.bank?.name || "N/A"}`,
      `Routing No: ${bankAccount?.bank?.ach_routing_no || "N/A"}, ${
        bankAccount?.bank?.wire_routing_no || "N/A"
      }`,
      `Account No: ${bankAccount?.account_number || "N/A"}`,
      `Account Type: ${bankAccount?.bank?.account_type || "N/A"}`,
      `Bank Address: ${bankAccount?.bank?.address || "N/A"}`,
      `Currency: ${bankAccount?.bank?.currency?.code || "N/A"}`,
    ].join("\n");

    copyToClipboard(details);
  }, [bankAccount, copyToClipboard]);

  // Fetch all dashboard data in parallel
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Define all fetch functions
      const fetchCurrencyDetails = async () => {
        setIsCurrencyLoading(true);
        try {
          const response = await apiService.getCurrencyById("2"); // Static ID for USDC
          if (response.status && response.data) {
            setCurrencyDetails(response.data);
            setCurrencyRate(response.data.usd_rate || 1);
          }
          // Silently fail and use default rate of 1
        } catch (error) {
          // Silently fail and use default rate of 1
        } finally {
          setIsCurrencyLoading(false);
        }
      };

      const fetchUserProfile = async () => {
        setIsBalanceLoading(true);
        setIsUserStatusLoading(true);
        try {
          const response = await apiService.getProfile();
          if (response.status && response.data) {
            setAccountBalance(response.data.balance || "0");
            setUserStatus(response.data.status || null);
          }
          // Handle error silently
        } catch (err) {
          // Handle error silently
        } finally {
          setIsBalanceLoading(false);
          setIsUserStatusLoading(false);
        }
      };

      const fetchBankAccount = async () => {
        setIsBankLoading(true);
        try {
          const response = await apiService.getBankAccount();
          if (response.status && response.data) {
            setBankAccount(response.data);
          } else {
            setBankError("Failed to fetch bank account details");
          }
        } catch (err) {
          setBankError("An error occurred while fetching bank account details");
        } finally {
          setIsBankLoading(false);
        }
      };

      const fetchChartData = async () => {
        setIsChartLoading(true);
        try {
          const response = await apiService.getBalanceChanges();
          if (response.status && response.data) {
            // Extract labels (dates) and data (balances) from the API response
            // Handle both response formats: data at root level or nested in data.data
            const chartData = Array.isArray(response.data)
              ? response.data
              : response.data.data || [];

            const labels = chartData.map((item) => item.date);
            const amounts = chartData.map((item) => parseFloat(item.balance));

            // Calculate min and max values for Y axis with some padding
            const minValue = Math.floor(Math.min(...amounts) / 10) * 10; // Round down to nearest 10
            const maxValue = Math.ceil(Math.max(...amounts) / 10) * 10; // Round up to nearest 10

            // Store min/max for chart options
            setChartYAxis({
              min: minValue > 50 ? minValue - 50 : 0, // Ensure min is at least 0
              max: maxValue + 50, // Add some padding at the top
              stepSize: Math.max(
                10,
                Math.ceil((maxValue - minValue) / 5 / 10) * 10
              ), // Create about 5 steps, rounded to nearest 10
            });

            setChartData({
              labels,
              datasets: [
                {
                  fill: true,
                  label: "Balance",
                  data: amounts,
                  borderColor: "#95DA66",
                  backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, "rgba(149, 218, 102, 0.7)");
                    gradient.addColorStop(0.5, "rgba(149, 218, 102, 0.3)");
                    gradient.addColorStop(1, "rgba(149, 218, 102, 0.0)");
                    return gradient;
                  },
                  tension: 0.4,
                  pointRadius: 0,
                  borderWidth: 2,
                },
              ],
            });
          } else {
            setChartError("Failed to fetch chart data");
          }
        } catch (error) {
          setChartError("An error occurred while fetching chart data");
        } finally {
          setIsChartLoading(false);
        }
      };

      const fetchRecentTransactions = async () => {
        setIsTransactionsLoading(true);
        try {
          // Use the same API call as the transactions page but limit to 5 rows
          const response = await apiService.getTransactions({
            per_page: 5,
            page: 1,
          });

          if (response.status) {
            setTransactions(response.data.data || []);
          } else {
            setTransactionsError("Failed to fetch transactions");
          }
        } catch (error) {
          setTransactionsError("An error occurred while fetching transactions");
        } finally {
          setIsTransactionsLoading(false);
        }
      };

      // Execute all fetch functions in parallel
      try {
        await Promise.all([
          fetchCurrencyDetails(),
          fetchUserProfile(),
          fetchBankAccount(),
          fetchChartData(),
          fetchRecentTransactions(),
        ]);
      } catch (error) {
        // Individual error handling is already implemented in each fetch function
      }
    };

    fetchDashboardData();
  }, []);

  // Get transaction icon based on type - memoized to prevent unnecessary re-renders
  const getTransactionIcon = useCallback((type) => {
    if (type === TRANSACTION_TYPE.WITHDRAW) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 mr-1"
          // text-[#EF4444]
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      );
    } else {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 mr-1  "
          // text-[#648A3A]
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
          />
        </svg>
      );
    }
  }, []);
  return (
    <>
      <div className="w-full px-2 mt-4 md:mt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Balance Card */}
          <div className="col-span-5">
            <div className="bg-[#232323] rounded-[20px] p-6 mb-4">
              <div className="flex justify-between items-center mb-2">
                <div className="text-[11px] text-[#777576] inter">
                  Account Balance
                </div>
                {!isUserStatusLoading && userStatus && (
                  <div
                    className={`text-[11px] px-2 py-1 rounded-full ${
                      canUserWithdraw(userStatus)
                        ? "bg-green-900/30 text-green-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    Status: {userStatus}
                  </div>
                )}
              </div>
              <div className="mb-4">
                {isBalanceLoading ? (
                  <div className="flex items-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#648A3A] mr-2"></div>
                    <span className="text-[#BAB8B9]">Loading balance...</span>
                  </div>
                ) : (
                  <>
                    <div className="text-3xl gradient_text inter font-semibold text-[32px] mb-1">
                      ${parseFloat(accountBalance || "0,00").toFixed(2)}
                    </div>
                    <div className="text-sm inter text-[#BAB8B9] mb-1">
                      {isCurrencyLoading ? (
                        <span className="text-[#BAB8B9] text-sm">
                          Loading equivalent...
                        </span>
                      ) : (
                        calculateEquivalent(
                          accountBalance,
                          currencyRate,
                          "USD",
                          currencyDetails?.code || "USDC"
                        )
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    handleNavigation("/transactions?transaction_type=DEPOSIT")
                  }
                  className="bg-gradient-to-r from-[#69E1A4] to-[#648A3A] text-white py-2 px-6 w-full rounded-full cursor-pointer text-base inter tracking-wide font-semibold flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                >
                  Receive
                </button>

                {isUserStatusLoading ? (
                  <button
                    disabled
                    className="bg-gray-500 text-white py-2 px-6 w-full rounded-full text-base inter tracking-wide font-semibold flex items-center justify-center"
                  >
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Loading...
                  </button>
                ) : canUserWithdraw(userStatus) ? (
                  <button
                    onClick={() => handleNavigation("/withdraw")}
                    className="bg-gradient-to-r from-[#69E1A4] to-[#648A3A] text-white py-2 px-6 w-full rounded-full cursor-pointer text-base inter tracking-wide font-semibold flex items-center justify-center transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
                  >
                    Withdraw
                  </button>
                ) : (
                  <div className="relative group">
                    <button
                      disabled
                      className="bg-gray-500 text-white py-2 px-6 w-full rounded-full cursor-not-allowed text-base inter tracking-wide font-semibold flex items-center justify-center opacity-70"
                    >
                          Withdraw
                          
                    </button>
                    <div className="absolute bottom-full left-0 mb-2 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-red-900/90 text-white text-xs rounded p-2 shadow-lg">
                        {getWithdrawStatusMessage(userStatus)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bank Account Details */}
            <div className="bg-[#232323] rounded-[20px] p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base inter font-semibold text-[#FFFBFD]">
                  Bank Account Details
                </h2>
                {bankAccount && (
                  <button
                    onClick={copyAllDetails}
                    className="flex items-center inter font-semibold text-[11px] text-[#FFFFFF] bg-[#333333] px-5 py-2 rounded-full cursor-pointer hover:bg-[#444444] transition-colors"
                  >
                    Copy details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {isBankLoading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#648A3A]"></div>
                </div>
              ) : bankError ? (
                <div className="text-yellow-500 text-center py-4">
                  {bankError}
                </div>
              ) : !bankAccount || !bankAccount?.bank || !bankAccount?.user ? (
                <div className="text-yellow-500 text-center py-4">
                  No bank account found
                </div>
              ) : (
                <div className="grid grid-cols-12 gap-x-6 gap-y-4">
                  <div className="col-span-5">
                    <div className="mb-2">
                      <p className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-1">
                        Account Holder
                      </p>
                      <div className="text-[13px] font-medium workSans text-white">
                        {bankAccount?.user?.full_name || "N/A"}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-1">
                        Routing No.
                      </div>
                      <div className="text-[13px] font-medium workSans text-white">
                        {bankAccount?.bank?.ach_routing_no || "N/A"}
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-1">
                        Account Type
                      </div>
                      <div className="text-[13px] font-medium workSans text-white">
                        {bankAccount?.bank?.account_type || "N/A"}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-7">
                    <div className="mb-2">
                      <p className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-1">
                        Bank Name
                      </p>
                      <div className="text-[13px] font-medium workSans text-white">
                        {bankAccount?.bank?.name || "N/A"}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-1">
                        Account No.
                      </div>
                      <div className="text-[13px] font-medium workSans text-white">
                        {bankAccount?.account_number || "N/A"}
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className="workSans text-[11px] text-[#FFFFFF80] font-normal mb-1">
                        Bank Address
                      </div>
                      <div className="text-[13px] font-medium workSans text-white">
                        {bankAccount?.bank?.address || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="col-span-7">
            <div className="bg-[#232323] rounded-[20px] p-6 mb-4">
              <h2 className="text-base font-semibold inter text-white mb-2">
                Balance Changes Comparison Chart
              </h2>
              <p className="text-[13px] text-[#BAB8B9] font-normal inter mb-4">
                The Qacent Protocol is an In-Depth Analysis of Balance Changes:
                A Thorough Comparison of Adjustments Across Different Patches
                and Versions.
              </p>

              {isChartLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#648A3A]"></div>
                </div>
              ) : chartError ? (
                <div className="text-red-500 text-center py-4 h-64 flex items-center justify-center">
                  <p>{chartError}</p>
                </div>
              ) : chartData ? (
                <div className="bg-[#2B2B2B] rounded-[20px]  p-3 ">
                  <h3 className="text-sm font-medium text-white mb-4">
                    Transactions of last 7 days
                  </h3>
                  <div className="h-64">
                    <Line
                      ref={chartRef}
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: false,
                          },
                          tooltip: {
                            backgroundColor: "#333",
                            titleColor: "#fff",
                            bodyColor: "#fff",
                            borderColor: "#555",
                            borderWidth: 1,
                            padding: 10,
                            displayColors: false,
                            callbacks: {
                              label: function (context) {
                                return `$${context.raw}`;
                              },
                            },
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: false,
                            min: chartYAxis.min,
                            max: chartYAxis.max,
                            grid: {
                              color: "rgba(255, 255, 255, 0.05)",
                              drawBorder: false,
                            },
                            ticks: {
                              color: "#777576",
                              font: {
                                size: 10,
                              },
                              stepSize: chartYAxis.stepSize,
                              callback: function (value) {
                                return "$" + value;
                              },
                            },
                          },
                          x: {
                            grid: {
                              display: false,
                            },
                            ticks: {
                              color: "#777576",
                              font: {
                                size: 10,
                              },
                            },
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-yellow-500 text-center py-4 h-64 flex items-center justify-center">
                  <p>No chart data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12">
            <div className="bg-[#232323] rounded-[20px] p-6 mb-4">
              <h2 className="text-base font-semibold inter text-white mb-5">
                Recent Transactions
              </h2>

              <div className="relative overflow-x-auto">
                {isTransactionsLoading ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#648A3A]"></div>
                  </div>
                ) : transactionsError ? (
                  <div className="text-red-500 text-center py-10">
                    <p>{transactionsError}</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-10 text-[#FFFBFD]">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm text-[#777576] mt-2">
                      Your recent transactions will appear here
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs inter font-bold text-[#777576]">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Activity
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Amount
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Datetime
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr
                          key={transaction?.id}
                          className="border-b border-[#3D3D3D] inter text-[#FFFBFD]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center text-white">
                              {getTransactionIcon(
                                transaction?.transaction_type
                              )}
                              <span>
                                {/* {transaction?.transaction_type || "Unknown"} */}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Image
                              height={20}
                              width={20}
                              className="inline mr-2 w-5 h-5"
                              src="/assets/backend_assets/images/amount-svg.svg"
                              alt="icon"
                            />
                            {transaction?.transaction_type ===
                            TRANSACTION_TYPE?.WITHDRAW
                              ? "-"
                              : "+"}{" "}
                            {formatAmount(transaction.amount)}
                          </td>
                          <td className="px-6 py-4">
                            {formatDate(transaction?.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={transaction?.status} />
                          </td>
                          <td className="px-6 py-4">
                            {transaction?.fee_type ? (
                              <span className="text-[#FFFBFD]">
                                {formatFeeType(transaction?.fee_type)}
                              </span>
                            ) : (
                              <span className="text-[#777576]">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <Link href="/transactions" className="cursor-pointer">
                <p className="text-[#95DA66] inter text-xs font-semibold flex items-center mt-5">
                  View all transactions{" "}
                  <svg
                    width={10}
                    height={10}
                    viewBox="0 0 10 10"
                    fill="none"
                    className="ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.13636 9.2045L4.25852 8.33518L6.88778 5.70592H0.5V4.43604H6.88778L4.25852 1.81104L5.13636 0.937455L9.26989 5.07098L5.13636 9.2045Z"
                      fill="#95DA66"
                    />
                  </svg>
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
