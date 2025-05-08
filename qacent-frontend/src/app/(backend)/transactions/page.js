"use client";

import Breadcrumb from "@/components/backend/Breadcrumb";
import CustomPagination from "@/components/backend/CustomPagination";
import StatusBadge from "@/components/backend/StatusBadge";
import {
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
  formatDate,
  formatAmount,
  formatFeeType,
} from "@/constants/transaction";

import apiService from "@/services/api";
import Image from "next/image";
import React, { useState, useEffect, Suspense } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

// Create a client component that uses useSearchParams
const SearchParamsHandler = ({ onParamsLoaded }) => {
  const searchParams = useSearchParams();
  const transactionTypeParam = searchParams.get("transaction_type");

  // Call the callback with the transaction type parameter
  React.useEffect(() => {
    onParamsLoaded(transactionTypeParam);
  }, [transactionTypeParam, onParamsLoaded]);

  return null;
};

const Transactions = () => {
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
    total: 0,
    per_page: 10,
    data: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  // This state is used to store the transaction_type from URL params
  // It's set by the SearchParamsHandler component
  const [transactionTypeParam, setTransactionTypeParam] = useState("");

  // Function to handle when search params are loaded
  const handleParamsLoaded = React.useCallback((typeParam) => {
    setTransactionTypeParam(typeParam);
    setFilters((prev) => ({
      ...prev,
      transaction_type: typeParam || "",
    }));
  }, []);

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    endDate: "",
    status: "",
    transaction_type: "",
    page: 1,
    per_page: 10,
  });

  // Fetch transactions when filters change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getTransactions(filters);

        if (response.status) {
          setTransactions(response.data.data);
          // Remove the nested data property for pagination
          const { data, ...paginationData } = response.data;
          setPagination(paginationData);
        } else {
          toast.error(response.message || "Failed to fetch transactions");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("An error occurred while fetching transactions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filters]); // Refetch when any filter changes

  // Function to apply filters and fetch transactions
  const fetchTransactions = () => {
    // Update filters and let the useEffect handle the API call
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }));
    fetchTransactions();
  };

  // Handle date filter change
  const handleDateChange = (value) => {
    setFilters((prev) => ({ ...prev, endDate: value, page: 1 }));
    fetchTransactions();
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value, page: 1 }));
    fetchTransactions();
  };

  // Transaction type filter change is handled by the SearchParamsHandler component

  // Handle page change and per_page change
  const handlePageChange = (page, perPage) => {
    if (perPage) {
      setFilters((prev) => ({ ...prev, page, per_page: perPage }));
    } else {
      setFilters((prev) => ({ ...prev, page }));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: "",
      endDate: "",
      status: "",
      transaction_type: "",
      page: 1,
      per_page: 10,
    });
    fetchTransactions();
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    if (type === TRANSACTION_TYPE.WITHDRAW) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4 mr-1 "
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
          className="size-4 mr-1 "
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 4.5-15 15m0 0h11.25m-11.25 0V8.25"
          />
        </svg>
      );
    }
  };

  return (
    <>
      {/* Wrap useSearchParams in Suspense */}
      <Suspense fallback={null}>
        <SearchParamsHandler onParamsLoaded={handleParamsLoaded} />
      </Suspense>

      <div className="w-full px-4 mt-4 md:mt-0 bg-[#212121] rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="col-span-12">
            <Breadcrumb />

            <h2 className="text-base font-semibold inter text-white mb-5">
              Transactions List
            </h2>

            <div className="bg-[#232323] rounded-[20px] p-6 mb-4">
              {/* Active filters display */}
              {filters.transaction_type && (
                <div className="mb-4 flex items-center">
                  <span className="text-xs text-[#BCBCBC] mr-2">
                    Active Filter:
                  </span>
                  <div className="bg-[#648A3A20] text-[#648A3A] text-xs font-medium px-3 py-1 rounded-full flex items-center">
                    Transaction Type: {filters.transaction_type}
                    <button
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          transaction_type: "",
                        }));
                        fetchTransactions();
                      }}
                      className="ml-2 text-[#648A3A] hover:text-[#95DA66] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <div className="flex flex-col md:flex-row items-end gap-4">
                  {/* Search field */}
                  <div className="w-full md:w-auto md:flex-grow">
                    <label
                      htmlFor="transaction-search"
                      className="block text-xs text-[#BCBCBC] mb-1"
                    >
                      {/* Search */}
                    </label>
                    <div className="relative bg-[#FFFFFF1A] border-2 border-[#FFFFFF0D] text-[#FFFFFFB2] rounded-lg">
                      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        id="transaction-search"
                        className="block w-full h-[42px] p-3 ps-10 text-sm text-white placeholder:text-white rounded-lg outline-0"
                        placeholder="Search"
                        value={filters.search}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>

                  {/* Filters row - contains status, date, apply and reset */}
                  <div className="flex flex-wrap md:flex-nowrap items-end gap-4 w-full md:w-auto">
                    {/* Transaction Type filter */}
                    {/* <div className="w-full md:w-[180px]">
                      <label
                        htmlFor="transaction-type-filter"
                        className="block text-xs text-[#BCBCBC] mb-1"
                      >
                        Transaction Type
                      </label>
                      <select
                        id="transaction-type-filter"
                        className="bg-[#FFFFFF1A] border-2 border-[#FFFFFF0D] text-[#FFFFFFB2] text-sm rounded-lg block w-full p-3 outline-0"
                        value={filters.transaction_type}
                        onChange={handleTransactionTypeChange}
                      >
                        <option value="" className="text-black">
                          All Types
                        </option>
                        <option
                          value={TRANSACTION_TYPE.DEPOSIT}
                          className="text-black"
                        >
                          Deposit
                        </option>
                        <option
                          value={TRANSACTION_TYPE.WITHDRAW}
                          className="text-black"
                        >
                          Withdraw
                        </option>
                      </select>
                    </div> */}
                    {/* Date filter */}
                    <div className="w-full md:w-[180px]">
                      <label
                        htmlFor="date-filter"
                        className="block text-xs text-[#BCBCBC] mb-1"
                      >
                        {/* Date (Up to) */}
                      </label>
                      <div className="relative bg-[#FFFFFF1A] border-2 border-[#FFFFFF0D] text-[#FFFFFFB2] rounded-lg">
                        <input
                          id="date-filter"
                          type="date"
                          className="block w-full h-[42px] p-3 text-sm text-white placeholder:text-white rounded-lg outline-0"
                          value={filters.endDate}
                          onChange={(e) => handleDateChange(e.target.value)}
                          placeholder="End Date"
                        />
                      </div>
                    </div>
                    {/* Status filter */}
                    <div className="w-full md:w-[180px]">
                      <label
                        htmlFor="status-filter"
                        className="block text-xs text-[#BCBCBC] mb-1"
                      >
                        {/* Status */}
                      </label>
                      <select
                        id="status-filter"
                        className="bg-[#FFFFFF1A] border-2 border-[#FFFFFF0D] text-[#FFFFFFB2] text-sm rounded-lg block w-full p-3 outline-0"
                        value={filters.status}
                        onChange={handleStatusChange}
                      >
                        <option value="" className="text-black">
                          Select status
                        </option>
                        <option
                          value={TRANSACTION_STATUS.PENDING}
                          className="text-black"
                        >
                          Pending
                        </option>
                        <option
                          value={TRANSACTION_STATUS.COMPLETED}
                          className="text-black"
                        >
                          Completed
                        </option>
                        <option
                          value={TRANSACTION_STATUS.FAILED}
                          className="text-black"
                        >
                          Failed
                        </option>
                        <option
                          value={TRANSACTION_STATUS.REFUND}
                          className="text-black"
                        >
                          Refund
                        </option>
                        <option
                          value={TRANSACTION_STATUS.IN_REVIEW}
                          className="text-black"
                        >
                          In Review
                        </option>
                      </select>
                    </div>

                    {/* Reset icon */}
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="h-[42px] w-[42px] flex items-center justify-center text-[#777576] hover:text-white transition-colors duration-200"
                        title="Reset filters"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-x-auto">
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#648A3A]"></div>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-20 text-[#FFFBFD]">
                    <p className="text-lg font-medium">No transactions found</p>
                    <p className="text-sm text-[#777576] mt-2">
                      Try adjusting your filters or search criteria
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
                          Date
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
                          key={transaction.id}
                          className="border-b border-[#3D3D3D] inter text-[#FFFBFD]"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center text-white">
                              {getTransactionIcon(transaction.transaction_type)}
                              {/* <span>{transaction.transaction_type}</span> */}
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
                            {formatDate(transaction.created_at)}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={transaction.status} />
                          </td>
                          <td className="px-6 py-4">
                            {transaction.fee_type ? (
                              <span className="text-[#FFFBFD]">
                                {formatFeeType(transaction.fee_type)}
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

              <div className="mt-10">
                <CustomPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transactions;
