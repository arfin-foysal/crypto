"use client";

import { useState, useEffect } from "react";
import apiService from "@/services/api";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AddressModal({
  setShowAddressModal,
  editAddressId = null,
}) {
  const [open, setOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [name, setName] = useState("");
  const [networkAddress, setNetworkAddress] = useState("");

  // Dropdown states
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);

  // API data
  const [currencies, setCurrencies] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [loadingNetworks, setLoadingNetworks] = useState(false);

  // Error state
  const [error, setError] = useState(null);

  // Fetch address data if in edit mode
  useEffect(() => {
    const fetchAddressData = async () => {
      if (!editAddressId) return;

      setIsLoading(true);
      try {
        const response = await apiService.getNetworkAddressById(editAddressId);
        if (response.data) {
          const addressData = response.data;
          setName(addressData.name || "");
          setNetworkAddress(addressData.network_address || "");

          // We'll set the currency and network after fetching currencies
          // Store the IDs for later use
          window.tempCurrencyId = addressData.currency_id;
          window.tempNetworkId = addressData.network_id;
        } else {
          setError("Failed to fetch address data");
          toast.error("Failed to load address data");
        }
      } catch (err) {
        console.error("Error fetching address data:", err);
        setError("An error occurred while fetching address data");
        toast.error("Failed to load address data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddressData();
  }, [editAddressId]);

  // Fetch currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        const response = await apiService.getCurrencies();
        if (response.data) {
          setCurrencies(response.data);

          // If we're editing, find the currency by ID
          if (window.tempCurrencyId && response.data.length > 0) {
            const currency = response.data.find(
              (c) => c.id === window.tempCurrencyId
            );
            if (currency) {
              setSelectedCurrency(currency);
            } else {
              // If currency not found, use the first one
              setSelectedCurrency(response.data[0]);
            }
          } else if (response.data.length > 0) {
            // If not editing or currency not found, use the first one
            setSelectedCurrency(response.data[0]);
          }
        } else {
          setError("Failed to fetch currencies");
        }
      } catch (err) {
        console.error("Error fetching currencies:", err);
        setError("An error occurred while fetching currencies");
        toast.error("Failed to load currencies");
      } finally {
        setLoadingCurrencies(false);
      }
    };

    fetchCurrencies();
  }, []);

  // Fetch networks when currency changes
  useEffect(() => {
    if (!selectedCurrency) return;

    const fetchNetworks = async () => {
      setLoadingNetworks(true);
      try {
        const response = await apiService.getNetworks(selectedCurrency.id);
        if (response.data) {
          setNetworks(response.data);

          // If we're editing, find the network by ID
          if (window.tempNetworkId && response.data.length > 0) {
            const network = response.data.find(
              (n) => n.id === window.tempNetworkId
            );
            if (network) {
              setSelectedNetwork(network);
              // Clear the temp variables after use
              delete window.tempCurrencyId;
              delete window.tempNetworkId;
            } else {
              // If network not found, use the first one
              setSelectedNetwork(response.data[0]);
            }
          } else if (response.data.length > 0) {
            // If not editing or network not found, use the first one
            setSelectedNetwork(response.data[0]);
          } else {
            setSelectedNetwork(null);
          }
        } else {
          setError("Failed to fetch networks");
          setNetworks([]);
          setSelectedNetwork(null);
        }
      } catch (err) {
        console.error("Error fetching networks:", err);
        setError("An error occurred while fetching networks");
        toast.error("Failed to load networks");
        setNetworks([]);
        setSelectedNetwork(null);
      } finally {
        setLoadingNetworks(false);
      }
    };

    fetchNetworks();
  }, [selectedCurrency]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!selectedCurrency) {
      toast.error("Please select a currency");
      return;
    }

    if (!selectedNetwork) {
      toast.error("Please select a network");
      return;
    }

    if (!networkAddress.trim()) {
      toast.error("Please enter a network address");
      return;
    }

    // Prepare data for API
    const data = {
      currency_id: selectedCurrency.id,
      network_id: selectedNetwork.id,
      network_address: networkAddress,
      name: name.trim() || null, // Optional field
    };

    setIsSubmitting(true);

    try {
      let response;

      if (editAddressId) {
        // Update existing address
        response = await apiService.updateNetworkAddress(editAddressId, data);
        if (response.status) {
          toast.success("Network address updated successfully");
          setShowAddressModal(false);
          // Refresh the page to show the updated address
          window.location.reload();
        } else {
          const errorMessage =
            response.errors ||
            response.message ||
            "Failed to update network address";
          toast.error(errorMessage);
        }
      } else {
        // Create new address
        response = await apiService.createNetworkAddress(data);
        if (response.status) {
          toast.success("Network address created successfully");
          setShowAddressModal(false);
          // Refresh the page to show the new address
          window.location.reload();
        } else {
          const errorMessage =
            response.errors ||
            response.message ||
            "Failed to create network address";
          toast.error(errorMessage);
        }
      }
    } catch (err) {
      console.error(
        `Error ${editAddressId ? "updating" : "creating"} network address:`,
        err
      );
      toast.error(
        `An error occurred while ${
          editAddressId ? "updating" : "creating"
        } network address`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-xl bg-[#1a1a1a] rounded-[24px] overflow-hidden shadow-xl border border-[#648a3a] pb-4">
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold inter text-[#FFFBFD]">
                {editAddressId
                  ? "Edit Network Address"
                  : "Create New Network Address"}
              </h2>
              <button
                type="button"
                className="text-white rounded-full h-8 w-8 flex items-center justify-center cursor-pointer"
                onClick={() => setShowAddressModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <p className="text-white inter font-medium text-base">
              Enter following information to{" "}
              {editAddressId ? "update" : "create new"} network address
            </p>

            {error && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="network-title"
                  className="block text-sm font-medium text-white"
                >
                  Network Title (Optional)
                </label>
                <input
                  id="network-title"
                  placeholder="Enter network title"
                  className="w-full px-3 h-[60px] py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="currency"
                  className="block text-sm font-medium text-white"
                >
                  Select a Currency
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full h-[60px] flex items-center justify-between px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white"
                    onClick={() => setCurrencyOpen(!currencyOpen)}
                    disabled={loadingCurrencies}
                  >
                    {loadingCurrencies ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <p className="text-base font-semibold inter">
                          Loading currencies...
                        </p>
                      </div>
                    ) : selectedCurrency ? (
                      <div className="flex items-center">
                        {selectedCurrency.image ? (
                          <Image
                            src={selectedCurrency.image}
                            alt={selectedCurrency.name}
                            width={24}
                            height={24}
                            className="mr-2 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex items-center justify-center text-xs">
                            {selectedCurrency.code?.substring(0, 2)}
                          </div>
                        )}
                        <p className="text-base font-semibold inter">
                          {selectedCurrency.name} ({selectedCurrency.code})
                        </p>
                      </div>
                    ) : (
                      <p className="text-base font-semibold inter text-gray-500">
                        Select a currency
                      </p>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${
                        currencyOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {currencyOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {currencies.map((currency) => (
                        <div
                          key={currency.id}
                          className="flex items-center px-3 py-2 hover:bg-[#3a3a3a] cursor-pointer text-white"
                          onClick={() => {
                            setSelectedCurrency(currency);
                            setCurrencyOpen(false);
                          }}
                        >
                          {currency.image ? (
                            <Image
                              src={currency.image}
                              alt={currency.name}
                              width={24}
                              height={24}
                              className="mr-2 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex items-center justify-center text-xs">
                              {currency.code?.substring(0, 2)}
                            </div>
                          )}
                          {currency.name} ({currency.code})
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="network"
                  className="block text-sm font-medium text-white"
                >
                  Select a Network
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className="w-full h-[60px] flex items-center justify-between px-3 py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white"
                    onClick={() => setNetworkOpen(!networkOpen)}
                    disabled={loadingNetworks || !selectedCurrency}
                  >
                    {loadingNetworks ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        <p className="text-base font-semibold inter">
                          Loading networks...
                        </p>
                      </div>
                    ) : selectedNetwork ? (
                      <div className="flex items-center">
                        {selectedNetwork.image ? (
                          <Image
                            src={selectedNetwork.image}
                            alt={selectedNetwork.name}
                            width={24}
                            height={24}
                            className="mr-2 rounded-full"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex items-center justify-center text-xs">
                            {selectedNetwork.code?.substring(0, 2)}
                          </div>
                        )}
                        <p className="text-base font-semibold inter">
                          {selectedNetwork.name}
                        </p>
                      </div>
                    ) : (
                      <p className="text-base font-semibold inter text-gray-500">
                        {selectedCurrency
                          ? "No networks available"
                          : "Select a currency first"}
                      </p>
                    )}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform ${
                        networkOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>

                  {networkOpen && networks.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {networks.map((network) => (
                        <div
                          key={network.id}
                          className="flex items-center px-3 py-2 hover:bg-[#3a3a3a] cursor-pointer text-white"
                          onClick={() => {
                            setSelectedNetwork(network);
                            setNetworkOpen(false);
                          }}
                        >
                          {network.image ? (
                            <Image
                              src={network.image}
                              alt={network.name}
                              width={24}
                              height={24}
                              className="mr-2 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-gray-600 rounded-full mr-2 flex items-center justify-center text-xs">
                              {network.code?.substring(0, 2)}
                            </div>
                          )}
                          {network.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="network-address"
                  className="block text-sm font-medium text-white"
                >
                  Network Address
                </label>
                <input
                  id="network-address"
                  placeholder="Enter network address"
                  className="w-full px-3 h-[60px] py-2 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                  value={networkAddress}
                  onChange={(e) => setNetworkAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                className="px-6 py-3 bg-[#3D3D3D] text-white rounded-lg mr-3"
                onClick={() => setShowAddressModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-[#648A3A] text-white rounded-lg flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {editAddressId ? "Updating..." : "Creating..."}
                  </>
                ) : editAddressId ? (
                  "Update Address"
                ) : (
                  "Create Address"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
