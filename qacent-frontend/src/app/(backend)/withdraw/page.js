"use client";
import Breadcrumb from "@/components/backend/Breadcrumb";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect } from "react";
import React, { useState } from "react";
import apiService from "@/services/api";
import toast from "react-hot-toast";
import {
  USER_STATUS,
  canUserWithdraw,
  getWithdrawStatusMessage,
} from "@/constants/user";

const Withdraw = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [cryptoAddresses, setCryptoAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressDropdownOpen, setAddressDropdownOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [withdrawFee, setWithdrawFee] = useState(0);
  const [loadingFee, setLoadingFee] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [accountBalance, setAccountBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const [userStatus, setUserStatus] = useState(null);
  const [loadingUserStatus, setLoadingUserStatus] = useState(true);
  const [currencyRate, setCurrencyRate] = useState(1);
  const [currencyDetails, setCurrencyDetails] = useState(null);
  const [loadingCurrency, setLoadingCurrency] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function closeModal() {
    setIsOpen(false);
    // Refresh data again when closing the modal to ensure we have the latest data
    refreshAllData();
  }

  function closeConfirmModal() {
    setIsConfirmModalOpen(false);
  }

  // Success modal component
  function MyAddressModal() {
    return (
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Withdrawal Successful
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Your withdrawal request has been successfully submitted.
                        You can track the status of your withdrawal in the
                        Transactions section.
                      </p>

                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">
                            Updated Balance:
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {loadingBalance ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin h-4 w-4 mr-2 text-green-600"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Loading...
                              </span>
                            ) : (
                              `${accountBalance.toLocaleString()} USD`
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }

  // Confirmation modal component
  function ConfirmModal() {
    // Calculate the fee amount based on percentage
    const amountValue = parseFloat(amount);
    const feeAmount = amountValue * (withdrawFee / 100);
    const receivableAmount = Math.max(
      0,
      amountValue * currencyRate * (1 - withdrawFee / 100)
    );

    // Handle the actual submission after confirmation
    const handleConfirmSubmit = async () => {
      setSubmitting(true);
      try {
        // Prepare withdrawal data with only the required fields
        const withdrawData = {
          amount: parseFloat(amount),
          to_currency_id: 1, // Static value as specified
          user_network_id: selectedAddress.id,
          form_currency_id: 2, // Static value as specified
        };

        // Call the API to create withdrawal
        const response = await apiService.createWithdraw(withdrawData);

        if (response.status) {
          // Close the confirmation modal
          setIsConfirmModalOpen(false);
          // Reset form
          setAmount("");
          setTermsAccepted(false);

          // Refresh all data with a small delay to ensure the backend has processed the withdrawal
          // We'll skip the cache clear in refreshAllData since we're doing it here
          setTimeout(async () => {
            // Clear all relevant caches before refreshing data
            apiService.clearCacheByKeys([
              "/clients/profile",
              "/clients/networks-address",
              "/clients/transaction-fees/withdraw",
              "/clients/currencies/2",
            ]);

            // Refresh all data with skipCacheClear=true since we just cleared it
            await refreshAllData(true);
            // Show success modal after data is refreshed
            setIsOpen(true);
          }, 500);

          toast.success("Withdrawal request submitted successfully");
        } else {
          toast.error(
            response.message || "Failed to submit withdrawal request"
          );
        }
      } catch (error) {
        console.error("Withdrawal error:", error);
        toast.error(
          "An error occurred while submitting your withdrawal request"
        );
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <>
        <Transition appear show={isConfirmModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={closeConfirmModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Confirm Withdrawal
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Please confirm your withdrawal request with the
                        following details:
                      </p>

                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Amount:
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {amountValue.toFixed(2)} USD
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Fee ({withdrawFee}%):
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {feeAmount.toFixed(2)} USD
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Address Title:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {selectedAddress?.name}
                          </span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-500">
                            Crypto Address:
                          </span>
                          <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                            {selectedAddress?.network_address}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200">
                          <span className="text-sm font-medium text-gray-700">
                            You will receive:
                          </span>
                          <span className="text-sm font-bold text-green-600">
                            {receivableAmount.toFixed(2)}{" "}
                            {currencyDetails?.code || "USDC"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={closeConfirmModal}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 cursor-pointer "
                        onClick={handleConfirmSubmit}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Processing...
                          </>
                        ) : (
                          "Confirm Withdrawal"
                        )}
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }

  // Function to fetch all active crypto addresses
  const fetchCryptoAddresses = async () => {
    setLoadingAddresses(true);
    try {
      // Get all active network addresses
      const response = await apiService.getNetworkAddresses();
      if (response.status && response.data) {
        setCryptoAddresses(response.data);
        // Set the first address as selected by default if available
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]);
        }
      } else {
        toast.error("Failed to fetch crypto addresses");
      }
    } catch (error) {
      toast.error("An error occurred while fetching crypto addresses");
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Function to fetch withdraw fee
  const fetchWithdrawFee = async () => {
    setLoadingFee(true);
    try {
      const response = await apiService.getWithdrawFee();
      if (response.status && response.data) {
        setWithdrawFee(response.data.fee || 0);
      } else {
        // Silently fail and use default fee of 0
      }
    } catch (error) {
      // Silently fail and use default fee of 0
    } finally {
      setLoadingFee(false);
    }
  };

  // Function to fetch user profile data including balance and status
  const fetchUserProfile = async (forceRefresh = false) => {
    setLoadingBalance(true);
    setLoadingUserStatus(true);
    try {
      // If forceRefresh is true, clear the profile cache before fetching
      if (forceRefresh) {
        apiService.clearCacheByKeys("/clients/profile");
      }

      const response = await apiService.getProfile();
      if (response.status && response.data) {
        // Set the account balance from the profile data
        setAccountBalance(response.data.balance || 0);
        // Set the user status
        setUserStatus(response.data.status || null);
      } else {
        // Silently fail and use default balance of 0
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      // Silently fail and use default balance of 0
    } finally {
      setLoadingBalance(false);
      setLoadingUserStatus(false);
    }
  };

  // Function to fetch currency details
  const fetchCurrencyDetails = async () => {
    setLoadingCurrency(true);
    try {
      const response = await apiService.getCurrencyById("2"); // Static ID for USDC
      if (response.status && response.data) {
        setCurrencyDetails(response.data);
        setCurrencyRate(response.data.usd_rate || 1);
      } else {
        // Silently fail and use default rate of 1
      }
    } catch (error) {
      // Silently fail and use default rate of 1
    } finally {
      setLoadingCurrency(false);
    }
  };

  // Function to refresh all data after successful withdrawal
  const refreshAllData = async (skipCacheClear = false) => {
    try {
      // Clear relevant cache entries to ensure fresh data is fetched
      if (!skipCacheClear) {
        apiService.clearCacheByKeys([
          "/clients/profile",
          "/clients/networks-address",
          "/clients/transaction-fees/withdraw",
          "/clients/currencies/2",
        ]);
      }

      // Fetch all data in parallel for faster loading
      await Promise.all([
        fetchUserProfile(true), // Always force refresh profile data to get latest balance
        fetchCryptoAddresses(),
        fetchWithdrawFee(),
        fetchCurrencyDetails(),
      ]);

      // Data refreshed successfully
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh some data");
      // Error already shown to user via toast
    }
  };

  // Fetch all required data on component mount
  useEffect(() => {
    // Use Promise.all to fetch data in parallel for better performance
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchCryptoAddresses(),
          fetchWithdrawFee(),
          fetchUserProfile(),
          fetchCurrencyDetails(),
        ]);
      } catch (error) {
        toast.error("Failed to load some data. Please refresh the page.");
      }
    };

    fetchInitialData();
  }, []);

  // Handle form submission - now just validates and shows confirmation modal
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    // Validate form
    if (!amount || isNaN(parseFloat(amount))) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amountValue = parseFloat(amount);

    // Check if the amount is too small
    if (amountValue <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    // Check if the user has sufficient balance
    if (amountValue > accountBalance) {
      toast.error(
        `Insufficient balance. Your current balance is ${accountBalance.toLocaleString()} USD`
      );
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a crypto address");
      return;
    }

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    // All validations passed, show confirmation modal
    setIsConfirmModalOpen(true);
  };

  return (
    <>
      <Breadcrumb />
      <div className="p-8 bg-gradient-to-t from-[#9EDA581A] via-[#68DB9F1A] to-[#2020201A] rounded-[32px] border border-[#3B3B3B]">
        <div className="pb-10">
          <h2 className="text-base font-semibold inter text-white mb-1">
            Withdraw Funds{" "}
          </h2>
          <p className="inter font-semibold text-xs text-[#777576]">
            Withdraw USD to USDC{" "}
          </p>
        </div>
        <div className="max-w-[582px] mx-auto border border-[#69E1A4] rounded-[32px] p-6">
          <div className="text-center flex justify-center items-center flex-col">
            <p className="text-[#E2FFCC] inter font-semibold text-sm items-center space-x-2 text-center block">
              <svg
                className="mr-2 inline-block"
                width={15}
                height={16}
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.09366 7.39935C6.90699 7.00602 6.33366 6.75935 6.33366 6.13268C6.33366 5.45268 7.07366 5.20602 7.54033 5.20602C8.41366 5.20602 8.73366 5.86602 8.80699 6.09935L9.86033 5.65268C9.76033 5.35268 9.31366 4.37268 8.16699 4.15935V3.33268H6.83366V4.17268C5.18033 4.54602 5.17366 6.07935 5.17366 6.14602C5.17366 7.65935 6.67366 8.08602 7.40699 8.35268C8.46033 8.72602 8.92699 9.06602 8.92699 9.70602C8.92699 10.4593 8.22699 10.7793 7.60699 10.7793C6.39366 10.7793 6.04699 9.53268 6.00699 9.38602L4.90033 9.83268C5.32033 11.2927 6.42033 11.686 6.83366 11.806V12.666H8.16699V11.8393C8.43366 11.7793 10.1003 11.446 10.1003 9.69268C10.1003 8.76602 9.69366 7.95268 8.09366 7.39935ZM1.50033 13.9993H0.166992V9.99935H4.16699V11.3327H2.51366C3.58699 12.9393 5.42033 13.9993 7.50033 13.9993C9.09162 13.9993 10.6177 13.3672 11.743 12.242C12.8682 11.1168 13.5003 9.59065 13.5003 7.99935H14.8337C14.8337 12.0527 11.5537 15.3327 7.50033 15.3327C5.02033 15.3327 2.82699 14.0993 1.50033 12.2193V13.9993ZM0.166992 7.99935C0.166992 3.94602 3.44699 0.666016 7.50033 0.666016C9.98033 0.666016 12.1737 1.89935 13.5003 3.77935V1.99935H14.8337V5.99935H10.8337V4.66602H12.487C11.4137 3.05935 9.58033 1.99935 7.50033 1.99935C5.90903 1.99935 4.3829 2.63149 3.25768 3.75671C2.13247 4.88193 1.50033 6.40805 1.50033 7.99935H0.166992Z"
                  fill="#E2FFCC"
                />
              </svg>
              Withdraw Currency
            </p>
            <div className="text-sm font-semibold text-center bg-[#E2FFCC14] py-1 px-4 rounded-full inter text-[#E2FFCC] size-fit mt-4">
              {loadingBalance ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-[#E2FFCC] mr-2"></div>
                  Loading balance...
                </span>
              ) : (
                `Account balance:${parseFloat(accountBalance || "0,00").toFixed(
                  2
                )} USD`
              )}
            </div>
            {!loadingUserStatus && userStatus && (
              <div
                className={`mt-4 py-2 px-4 rounded-md text-sm ${
                  canUserWithdraw(userStatus)
                    ? "bg-green-900/20 text-green-400"
                    : "bg-red-900/20 text-red-400"
                }`}
              >
                <div className="flex items-center">
                  {canUserWithdraw(userStatus) ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        Account Status:{" "}
                        <span className="font-bold">ACTIVE</span> - You can
                        withdraw funds
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <span>
                        Account Status:{" "}
                        <span className="font-bold">{userStatus}</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="pt-10">
            <div className="">
              <div className="mb-3">
                <label
                  htmlFor="input-group-1"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Enter Amount{" "}
                </label>
                <div className="relative mb-2">
                  <input
                    
                    type="text"
                    id="input-group-1"
                    className="border outline-0 border-[#868685] text-xl font-semibold text-white h-[60px] placeholder:text-white inter rounded-lg block w-full ps-4 p-2.5 "
                    value={amount}
                    onChange={(e) => {
                      // Only allow numbers and decimal point
                      const value = e.target.value.replace(/[^0-9.]/g, "");
                      // Prevent multiple decimal points
                      const parts = value.split(".");
                      const formatted =
                        parts.length > 1
                          ? `${parts[0]}.${parts.slice(1).join("")}`
                          : value;
                      setAmount(formatted);
                    }}
                    placeholder="Enter amount"
                    required
                  />
                  <div className="absolute inset-y-0 end-4 flex items-center ps-3.5 pointer-events-none inter text-base font-medium text-white">
                    <svg
                      className="w-4 h-4 text-white mr-2"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <mask
                        id="mask0_468_337"
                        style={{ maskType: "luminance" }}
                        maskUnits="userSpaceOnUse"
                        x={1}
                        y={1}
                        width={18}
                        height={18}
                      >
                        <path
                          d="M18.5716 1.65039H1.42871V18.7932H18.5716V1.65039Z"
                          fill="white"
                        />
                      </mask>
                      <g mask="url(#mask0_468_337)">
                        <path
                          d="M8.14919 1.85305L8.30369 2.00755L7.76798 2.54327L7.30868 2.084C6.47602 2.35927 5.70036 2.75841 5.00265 3.2601L5.17868 3.43611L4.64297 3.97183L4.40372 3.73258C4.13953 3.96063 3.88785 4.20277 3.65329 4.46104L4.0569 4.86468L3.52118 5.40039L3.16793 5.04709C2.96803 5.31055 2.78377 5.58626 2.61492 5.87233L3.03585 6.29324L2.50014 6.82895L2.24375 6.57256C1.7218 7.67994 1.42871 8.91644 1.42871 10.2218H10.0001V1.65039C9.36438 1.65039 8.74552 1.72172 8.14919 1.85305Z"
                          fill="#1D1D8C"
                        />
                        <path
                          d="M14.7373 3.07895C13.3801 2.177 11.7518 1.65039 10 1.65039V3.07895H14.7373Z"
                          fill="white"
                        />
                        <path
                          d="M10 4.50755H16.3871C15.9009 3.96441 15.3466 3.48387 14.7373 3.07898H10V4.50755Z"
                          fill="#F23E53"
                        />
                        <path
                          d="M10 5.93613H17.4219C17.1257 5.42428 16.7791 4.94541 16.3871 4.50757H10L10 5.93613Z"
                          fill="white"
                        />
                        <path
                          d="M10 7.36472H18.0818C17.9052 6.86549 17.6834 6.38806 17.4219 5.93616H10V7.36472Z"
                          fill="#F23E53"
                        />
                        <path
                          d="M10 8.79331H18.4507C18.3682 8.30166 18.2442 7.8242 18.0818 7.36475H10L10 8.79331Z"
                          fill="white"
                        />
                        <path
                          d="M10 10.2218H18.5714C18.5714 9.73478 18.5287 9.25803 18.4507 8.79321H10V10.2218Z"
                          fill="#F23E53"
                        />
                        <path
                          d="M10.0001 10.2218H1.42871C1.42871 10.7088 1.47143 11.1856 1.54946 11.6504H18.4508C18.5288 11.1856 18.5715 10.7088 18.5715 10.2218H10.0001Z"
                          fill="white"
                        />
                        <path
                          d="M1.91873 13.079H18.0822C18.2447 12.6195 18.3686 12.142 18.4511 11.6504H1.5498C1.63233 12.142 1.7563 12.6195 1.91873 13.079Z"
                          fill="#F23E53"
                        />
                        <path
                          d="M2.57786 14.5074H17.4216C17.6832 14.0555 17.905 13.5781 18.0815 13.0789H1.91797C2.09449 13.5781 2.31633 14.0555 2.57786 14.5074Z"
                          fill="white"
                        />
                        <path
                          d="M3.61286 15.9361H16.3871C16.7791 15.4983 17.1256 15.0194 17.4219 14.5076H2.57812C2.87435 15.0194 3.22085 15.4983 3.61286 15.9361Z"
                          fill="#F23E53"
                        />
                        <path
                          d="M5.2631 17.3646H14.7377C15.347 16.9597 15.9013 16.4792 16.3875 15.936H3.61328C4.09952 16.4792 4.65384 16.9597 5.2631 17.3646Z"
                          fill="white"
                        />
                        <path
                          d="M10 18.7932C11.7518 18.7932 13.3801 18.2666 14.7373 17.3646H5.2627C6.61995 18.2666 8.24823 18.7932 10 18.7932Z"
                          fill="#F23E53"
                        />
                        <path
                          d="M3.52107 7.18604L2.98535 7.72175L3.52107 8.25746L4.05678 7.72175L3.52107 7.18604Z"
                          fill="white"
                        />
                        <path
                          d="M5.62556 7.18604L5.08984 7.72175L5.62556 8.25746L6.16127 7.72175L5.62556 7.18604Z"
                          fill="white"
                        />
                        <path
                          d="M7.76814 7.18604L7.23242 7.72175L7.76814 8.25746L8.30385 7.72175L7.76814 7.18604Z"
                          fill="white"
                        />
                        <path
                          d="M5.62556 4.32886L5.08984 4.86457L5.62556 5.40029L6.16127 4.86457L5.62556 4.32886Z"
                          fill="white"
                        />
                        <path
                          d="M7.76814 4.32898L7.23242 4.86469L7.76814 5.40041L8.30385 4.86469L7.76814 4.32898Z"
                          fill="white"
                        />
                        <path
                          d="M2.50056 8.61475L1.96484 9.15046L2.50056 9.68617L3.03627 9.15046L2.50056 8.61475Z"
                          fill="white"
                        />
                        <path
                          d="M4.64314 8.61462L4.10742 9.15034L4.64314 9.68605L5.17885 9.15034L4.64314 8.61462Z"
                          fill="white"
                        />
                        <path
                          d="M6.74665 8.61475L6.21094 9.15046L6.74665 9.68617L7.28237 9.15046L6.74665 8.61475Z"
                          fill="white"
                        />
                        <path
                          d="M8.89021 8.61475L8.35449 9.15046L8.89021 9.68617L9.42592 9.15046L8.89021 8.61475Z"
                          fill="white"
                        />
                        <path
                          d="M4.64314 5.75757L4.10742 6.29328L4.64314 6.829L5.17885 6.29328L4.64314 5.75757Z"
                          fill="white"
                        />
                        <path
                          d="M6.74665 5.75757L6.21094 6.29328L6.74665 6.829L7.28237 6.29328L6.74665 5.75757Z"
                          fill="white"
                        />
                        <path
                          d="M8.89021 5.75757L8.35449 6.29328L8.89021 6.829L9.42592 6.29328L8.89021 5.75757Z"
                          fill="white"
                        />
                        <path
                          d="M6.74665 2.90039L6.21094 3.4361L6.74665 3.97182L7.28237 3.4361L6.74665 2.90039Z"
                          fill="white"
                        />
                        <path
                          d="M8.89021 2.90039L8.35449 3.4361L8.89021 3.97182L9.42592 3.4361L8.89021 2.90039Z"
                          fill="white"
                        />
                        <path
                          d="M4.05693 4.86518L3.65333 4.46155C3.48281 4.64926 3.32142 4.84525 3.16797 5.04759L3.52122 5.4009L4.05693 4.86518Z"
                          fill="white"
                        />
                        <path
                          d="M3.03625 6.29274L2.61531 5.87183C2.48133 6.09886 2.35718 6.33222 2.24414 6.57206L2.50053 6.82845L3.03625 6.29274Z"
                          fill="white"
                        />
                        <path
                          d="M5.17828 3.43626L5.00225 3.26025C4.79546 3.40897 4.59575 3.56663 4.40332 3.73275L4.64257 3.972L5.17828 3.43626Z"
                          fill="white"
                        />
                        <path
                          d="M8.3036 2.00716L8.1491 1.85266C7.86327 1.91561 7.58296 1.99288 7.30859 2.08358L7.76789 2.54285L8.3036 2.00716Z"
                          fill="white"
                        />
                      </g>
                    </svg>
                    USD
                  </div>
                </div>
                <div className="inter font-bold text-sm text-[#95DA66] tracking-[-0.08px]">
                  {loadingCurrency ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-[#95DA66] mr-2"></div>
                      Loading rate...
                    </span>
                  ) : (
                    `1 USD = ${currencyRate} ${currencyDetails?.code || "USDC"}`
                  )}
                </div>
              </div>
              <div className="mb-3">
                <p
                  htmlFor="input-group-1"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Paying with{" "}
                </p>
                <div className="relative">
                  <div
                    className="relative mb-2 border outline-0 border-[#868685] text-xl font-semibold text-white h-[60px] placeholder:text-white inter rounded-lg w-full ps-4 p-2.5 flex items-center cursor-pointer"
                    onClick={() => setAddressDropdownOpen(!addressDropdownOpen)}
                  >
                    <div className="flex items-center space-x-4">
                      <svg
                        width={32}
                        height={32}
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          width={32}
                          height={32}
                          rx={16}
                          fill="#E2FFCC"
                          fillOpacity="0.08"
                        />
                        <g opacity="0.72">
                          <path
                            d="M19 17.5C19 17.7652 18.8946 18.0196 18.7071 18.2071C18.5196 18.3946 18.2652 18.5 18 18.5H15V16.5H18C18.2652 16.5 18.5196 16.6054 18.7071 16.7929C18.8946 16.9804 19 17.2348 19 17.5ZM23 16C23 17.2856 22.6188 18.5423 21.9046 19.6112C21.1903 20.6801 20.1752 21.5132 18.9874 22.0052C17.7997 22.4972 16.4928 22.6259 15.2319 22.3751C13.971 22.1243 12.8129 21.5052 11.9038 20.5962C10.9948 19.6872 10.3757 18.529 10.1249 17.2681C9.87409 16.0072 10.0028 14.7003 10.4948 13.5126C10.9868 12.3248 11.8199 11.3097 12.8888 10.5954C13.9577 9.88122 15.2144 9.5 16.5 9.5C18.2234 9.50182 19.8756 10.1872 21.0942 11.4058C22.3128 12.6244 22.9982 14.2767 23 16ZM20 17.5C20 17.155 19.9107 16.8159 19.7408 16.5156C19.5709 16.2153 19.3263 15.964 19.0306 15.7863C19.2482 15.5276 19.3966 15.2179 19.4621 14.8863C19.5276 14.5547 19.5079 14.2119 19.405 13.89C19.302 13.568 19.1192 13.2774 18.8735 13.0452C18.6278 12.8131 18.3273 12.647 18 12.5625V12C18 11.8674 17.9473 11.7402 17.8536 11.6464C17.7598 11.5527 17.6326 11.5 17.5 11.5C17.3674 11.5 17.2402 11.5527 17.1464 11.6464C17.0527 11.7402 17 11.8674 17 12V12.5H16V12C16 11.8674 15.9473 11.7402 15.8536 11.6464C15.7598 11.5527 15.6326 11.5 15.5 11.5C15.3674 11.5 15.2402 11.5527 15.1464 11.6464C15.0527 11.7402 15 11.8674 15 12V12.5H14C13.8674 12.5 13.7402 12.5527 13.6464 12.6464C13.5527 12.7402 13.5 12.8674 13.5 13C13.5 13.1326 13.5527 13.2598 13.6464 13.3536C13.7402 13.4473 13.8674 13.5 14 13.5V18.5C13.8674 18.5 13.7402 18.5527 13.6464 18.6464C13.5527 18.7402 13.5 18.8674 13.5 19C13.5 19.1326 13.5527 19.2598 13.6464 19.3536C13.7402 19.4473 13.8674 19.5 14 19.5H15V20C15 20.1326 15.0527 20.2598 15.1464 20.3536C15.2402 20.4473 15.3674 20.5 15.5 20.5C15.6326 20.5 15.7598 20.4473 15.8536 20.3536C15.9473 20.2598 16 20.1326 16 20V19.5H17V20C17 20.1326 17.0527 20.2598 17.1464 20.3536C17.2402 20.4473 17.3674 20.5 17.5 20.5C17.6326 20.5 17.7598 20.4473 17.8536 20.3536C17.9473 20.2598 18 20.1326 18 20V19.5C18.5304 19.5 19.0391 19.2893 19.4142 18.9142C19.7893 18.5391 20 18.0304 20 17.5ZM18.5 14.5C18.5 14.2348 18.3946 13.9804 18.2071 13.7929C18.0196 13.6054 17.7652 13.5 17.5 13.5H15V15.5H17.5C17.7652 15.5 18.0196 15.3946 18.2071 15.2071C18.3946 15.0196 18.5 14.7652 18.5 14.5Z"
                            fill="white"
                          />
                        </g>
                      </svg>
                      <p className="inter font-semibold text-base">
                        Crypto Address
                      </p>
                    </div>

                    <div className="absolute inset-y-0 end-4 flex items-center ps-3.5 inter text-sm inter text-[#E2FFCC] font-medium">
                      {loadingAddresses ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#E2FFCC] mr-2"></div>
                          Loading...
                        </div>
                      ) : selectedAddress ? (
                        <span className="truncate max-w-[150px]">
                          {selectedAddress.name}
                        </span>
                      ) : (
                        "Select Address"
                      )}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={`size-4 ml-2 transition-transform ${
                          addressDropdownOpen ? "rotate-90" : ""
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m8.25 4.5 7.5 7.5-7.5 7.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Dropdown menu */}
                  {addressDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {loadingAddresses ? (
                        <div className="flex items-center justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#E2FFCC] mr-2"></div>
                          <p className="text-white">Loading addresses...</p>
                        </div>
                      ) : cryptoAddresses.length > 0 ? (
                        cryptoAddresses.map((address) => (
                          <div
                            key={address.id}
                            className="flex items-center px-3 py-3 hover:bg-[#3a3a3a] cursor-pointer text-white border-b border-[#3a3a3a] last:border-b-0"
                            onClick={() => {
                              setSelectedAddress(address);
                              setAddressDropdownOpen(false);
                            }}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {address.name}
                              </span>
                              <span className="text-xs text-gray-400 truncate max-w-[300px]">
                                {address.network_address}
                              </span>
                              <div className="flex items-center mt-1 text-xs">
                                <span className="text-gray-400 mr-2">
                                  {address.currency?.name}
                                </span>
                                <span className="text-gray-400">
                                  {address.network?.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-white">
                          No addresses found
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="mb-3">
                <p
                  htmlFor="input-group-1"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Receive amount
                </p>
                <div className="relative mb-2 border outline-0 border-[#868685] text-xl font-semibold text-white h-[72px] placeholder:text-white inter rounded-lg  w-full ps-4 p-2.5 flex items-center">
                  <div className="flex items-center space-x-4">
                    <svg
                      width={32}
                      height={32}
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.9999 29.3299C19.5353 29.3299 22.9258 27.9255 25.4257 25.4257C27.9255 22.9258 29.3299 19.5353 29.3299 15.9999C29.3299 12.4646 27.9255 9.07405 25.4257 6.57419C22.9258 4.07433 19.5353 2.66992 15.9999 2.66992C12.4646 2.66992 9.07405 4.07433 6.57419 6.57419C4.07433 9.07405 2.66992 12.4646 2.66992 15.9999C2.66992 19.5353 4.07433 22.9258 6.57419 25.4257C9.07405 27.9255 12.4646 29.3299 15.9999 29.3299Z"
                        fill="url(#paint0_linear_468_397)"
                      />
                      <path
                        d="M13.56 25.2199C13.56 25.5599 13.33 25.6699 13 25.6699C8.89 24.3299 6 20.5599 6 16.1099C6 11.6699 8.89 7.88995 13 6.55995C13.33 6.43995 13.56 6.65995 13.56 6.99995V7.77995C13.56 7.99995 13.44 8.21995 13.22 8.32995C11.6265 8.91486 10.2506 9.97429 9.2779 11.3654C8.30519 12.7565 7.78239 14.4125 7.78 16.1099C7.78805 17.8061 8.31308 19.4594 9.28504 20.8495C10.257 22.2395 11.6297 23.3002 13.22 23.8899C13.44 23.9999 13.56 24.2199 13.56 24.4399V25.2199Z"
                        fill="white"
                      />
                      <path
                        d="M16.8904 22.44C16.8904 22.67 16.6704 22.89 16.4404 22.89H15.5604C15.4433 22.8828 15.333 22.8331 15.2501 22.7502C15.1672 22.6673 15.1175 22.557 15.1104 22.44V21.11C13.3304 20.89 12.4404 19.89 12.1104 18.44C12.1104 18.22 12.2204 18 12.4404 18H13.4404C13.6704 18 13.7804 18.11 13.8904 18.33C14.1104 19.11 14.5604 19.78 16.0004 19.78C17.1104 19.78 17.8904 19.22 17.8904 18.33C17.8904 17.44 17.4404 17.11 15.8904 16.89C13.5604 16.56 12.4404 15.89 12.4404 14C12.4404 12.56 13.5604 11.44 15.1104 11.22V9.89995C15.1104 9.67995 15.3304 9.44995 15.5604 9.44995H16.4404C16.6704 9.44995 16.8904 9.67995 16.8904 9.89995V11.23C18.2204 11.45 19.1104 12.23 19.3304 13.45C19.3304 13.68 19.2304 13.9 19.0004 13.9H18.1104C17.8904 13.9 17.7804 13.79 17.6704 13.57C17.4404 12.79 16.8904 12.45 15.8904 12.45C14.7804 12.45 14.2204 13.01 14.2204 13.79C14.2204 14.57 14.5604 15.01 16.2204 15.23C18.5604 15.57 19.6704 16.23 19.6704 18.13C19.6704 19.57 18.5604 20.79 16.8904 21.13V22.45"
                        fill="white"
                      />
                      <path
                        d="M19.0004 25.6701C18.6704 25.7701 18.4404 25.5601 18.4404 25.2201V24.4401C18.4404 24.2201 18.5604 24.0001 18.7804 23.8901C20.374 23.3051 21.7498 22.2457 22.7225 20.8546C23.6953 19.4635 24.218 17.8075 24.2204 16.1101C24.2124 14.4139 23.6874 12.7606 22.7154 11.3705C21.7434 9.98048 20.3708 8.91983 18.7804 8.33006C18.6779 8.27946 18.5917 8.20106 18.5316 8.10381C18.4715 8.00657 18.4399 7.89439 18.4404 7.78006V7.00006C18.4404 6.67006 18.6704 6.56006 19.0004 6.56006C23.0004 7.89006 26.0004 11.6601 26.0004 16.1101C26.0004 20.5601 23.1104 24.3301 19.0004 25.6701Z"
                        fill="white"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_468_397"
                          x1="9.93992"
                          y1="2.32992"
                          x2="23.7799"
                          y2="28.8599"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#0666CE" />
                          <stop offset={1} stopColor="#61A9F8" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <p className="inter font-semibold text-base">
                      {currencyDetails?.code || "USDC"}
                    </p>
                  </div>

                  <div className="absolute inset-y-0 end-4 flex items-center ps-3.5 pointer-events-none inter text-base font-semibold tracking-[0.84px] text-white">
                    {amount && !isNaN(parseFloat(amount))
                      ? (parseFloat(amount) * currencyRate).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </div>
              <div className="relative mb-2 border outline-0 border-[#868685] text-xl font-semibold text-white placeholder:text-white inter rounded-lg  w-full p-4">
                <div className="flex items-center w-full justify-between border-b border-[#FFFFFF1F] pb-2.5">
                  <p className="inter font-normal text-sm tracking-[-0.11px]">
                    Our fee
                  </p>

                  <p className="inter font-normal text-sm tracking-[-0.11px] ">
                    {loadingFee ? (
                      <span className="flex items-center">
                        <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-2"></span>
                        Loading...
                      </span>
                    ) : (
                      <span>
                        {amount && !isNaN(parseFloat(amount))
                          ? `${(
                              (parseFloat(amount) * withdrawFee) /
                              100
                            ).toFixed(2)} USD`
                          : `0.00 USD`}
                        {/* <span className="text-xs text-gray-400 ml-1">
                          ({withdrawFee}%)
                        </span> */}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center w-full justify-between pt-2.5">
                  <p className="inter font-semibold text-sm tracking-[-0.11px]">
                    Total receivable amount{" "}
                  </p>

                  <p className="inter font-semibold text-sm tracking-[-0.11px] ">
                    {amount && !isNaN(parseFloat(amount))
                      ? `${Math.max(
                          0,
                          parseFloat(amount) *
                            currencyRate *
                            (1 - withdrawFee / 100)
                        ).toFixed(2)} ${currencyDetails?.code || "USDC"}`
                      : `0.00 ${currencyDetails?.code || "USDC"}`}
                  </p>
                </div>
              </div>
              <div className="py-4">
                <p className="inter font-normal text-sm tracking-[-0.11px] text-white">
                  Processing time:{" "}
                  <span className="font-semibold">1-12 hours</span>
                </p>
                <div className="flex items-center mb-4 pt-4">
                  <input
                    id="default-checkbox"
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 border-gray-300 rounded-sm accent-[#69E1A4] cursor-pointer"
                  />
                  <label
                    htmlFor="default-checkbox "
                    className="ms-2 inter font-normal text-sm tracking-[-0.11px] text-white "
                  >
                    I have read and agree to the terms and conditions{" "}
                  </label>
                </div>
              </div>
              {loadingUserStatus ? (
                <button
                  className="inter text-base font-semibold text-white tracking-[-0.18px] rounded-full bg-gray-500 w-full px-4 py-3 flex items-center justify-center"
                  disabled
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Loading...
                </button>
              ) : canUserWithdraw(userStatus) ? (
                <button
                  className="inter text-base font-semibold text-white tracking-[-0.18px] rounded-full bg-linear-to-r from-[#69E1A4] to-[#648A3A] w-full px-4 py-3 cursor-pointer"
                  onClick={onSubmitHandler}
                >
                  Withdraw money
                </button>
              ) : (
                <div className="text-center">
                  <button
                    className="inter text-base font-semibold text-white tracking-[-0.18px] rounded-full bg-gray-500 w-full px-4 py-3 mb-3 cursor-not-allowed opacity-70"
                    disabled
                  >
                    Withdraw Unavailable
                  </button>
                  <p className="text-red-500 text-sm">
                    {getWithdrawStatusMessage(userStatus)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MyAddressModal />
      <ConfirmModal />
    </>
  );
};

export default Withdraw;
