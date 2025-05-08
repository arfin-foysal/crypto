"use client";
import AddressModal from "@/components/backend/AddressModal";
import React, { useState, useEffect, Suspense } from "react";
import apiService from "@/services/api";
import toast from "react-hot-toast";
import { PencilIcon } from "@heroicons/react/24/outline";
import Breadcrumb from "@/components/backend/Breadcrumb";
import { useSearchParams } from "next/navigation";

// Create a client component that uses useSearchParams
const SearchParamsHandler = () => {
  const searchParams = useSearchParams();
  // You can use searchParams here if needed
  return null;
};

const Address = () => {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [networkAddresses, setNetworkAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to handle edit button click
  const handleEditAddress = (addressId) => {
    setEditAddressId(addressId);
    setShowAddressModal(true);
  };

  // Fetch network addresses from API
  useEffect(() => {
    const fetchNetworkAddresses = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.getNetworkAddresses();
        if (response.data) {
          setNetworkAddresses(response.data);
        } else {
          setError("Failed to fetch network addresses");
        }
      } catch (err) {
        console.error("Error fetching network addresses:", err);
        setError("An error occurred while fetching network addresses");
        toast.error("Failed to load network addresses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNetworkAddresses();
  }, []);

  return (
    <>
      {/* Wrap useSearchParams in Suspense */}
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      <Breadcrumb />
      <div className="bg-gradient-to-b from-[#9EDA581A] via-[#68DB9F1A] to-[#2020201A] rounded-[32px] p-8">
        <div className="mb-5">
          <h2 className="text-xl font-semibold inter text-white mb-1">
            Network Addresses{" "}
          </h2>
          <p className="text-xs font-semibold inter text-[#777576]">
            Details information of your network addresses{" "}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#648A3A]"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Map through network addresses from API */}
            {networkAddresses.map((address) => (
              <div
                key={address.id}
                className="bg-no-repeat bg-center bg-auto rounded-[20px] h-40 p-4 overflow-hidden relative border border-white/50"
                style={{
                  backgroundImage:
                    "url('/assets/backend_assets/images/address-card-bg.png')",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="kronaOne font-normal text-xl text-white">
                    {address.network?.name || "Network"}
                  </h3>
                  <div className="w-9 h-9 bg-[#FFFFFF]/50 rounded-full flex items-center justify-center">
                    <div className="w-9 h-9 bg-[#FFFFFF]/50 rounded-full flex items-center justify-center">
                      <svg
                        width={21}
                        height={16}
                        viewBox="0 0 21 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_478_33200)">
                          <path
                            d="M3.31509 12.2118C3.43829 12.0886 3.60768 12.0167 3.78734 12.0167H20.0799C20.3777 12.0167 20.5265 12.376 20.3161 12.5865L17.0976 15.805C16.9744 15.9282 16.805 16 16.6253 16H0.332736C0.0350136 16 -0.113847 15.6407 0.0966113 15.4303L3.31509 12.2118Z"
                            fill="url(#paint0_linear_478_33200)"
                          />
                          <path
                            d="M3.31704 0.195059C3.44537 0.071864 3.61477 0 3.78929 0H20.0819C20.3796 0 20.5285 0.35932 20.318 0.569779L17.0995 3.78826C16.9763 3.91145 16.8069 3.98332 16.6273 3.98332H0.334689C0.0369667 3.98332 -0.111894 3.624 0.0985644 3.41354L3.31704 0.195059Z"
                            fill="url(#paint1_linear_478_33200)"
                          />
                          <path
                            d="M17.0976 6.16491C16.9744 6.04171 16.805 5.96985 16.6253 5.96985H0.332736C0.0350136 5.96985 -0.113847 6.32917 0.0966113 6.53963L3.31509 9.75811C3.43829 9.8813 3.60768 9.95317 3.78734 9.95317H20.0799C20.3777 9.95317 20.5265 9.59385 20.3161 9.38339L17.0976 6.16491Z"
                            fill="url(#paint2_linear_478_33200)"
                          />
                        </g>
                        <defs>
                          <linearGradient
                            id="paint0_linear_478_33200"
                            x1="18.5235"
                            y1="-1.92259"
                            x2="7.24774"
                            y2="19.675"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#00FFA3" />
                            <stop offset={1} stopColor="#DC1FFF" />
                          </linearGradient>
                          <linearGradient
                            id="paint1_linear_478_33200"
                            x1="13.5951"
                            y1="-4.4967"
                            x2="2.31931"
                            y2="17.1009"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#00FFA3" />
                            <stop offset={1} stopColor="#DC1FFF" />
                          </linearGradient>
                          <linearGradient
                            id="paint2_linear_478_33200"
                            x1="16.0426"
                            y1="-3.21786"
                            x2="4.76685"
                            y2="18.3798"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#00FFA3" />
                            <stop offset={1} stopColor="#DC1FFF" />
                          </linearGradient>
                          <clipPath id="clip0_478_33200">
                            <rect width="20.4145" height={16} fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Status badge */}
                <div className="absolute top-1 right-1 flex space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(address.id);
                    }}
                    className="bg-white/20 p-1 rounded-full hover:bg-white/30 transition-colors"
                    title="Edit Address"
                  >
                    <PencilIcon className="h-3 w-3 " />
                  </button>
                </div>

                {/* address name */}

                <div className="absolute top-14 left-4">
                  <h4 className="gradient_text inter font-bold text-lg">
                    {address.name || "N/A"}
                  </h4>
                </div>

                <div className="bg-white/20 absolute bottom-0 left-0 w-full px-4 py-3 flex justify-between items-center rounded-b-[16px]">
                  <div className="">
                    <p className="inter text-[7px] font-normal text-white">
                      Currency
                    </p>
                    <p className="inter text-[13px] font-normal text-white">
                      {address.currency?.name || "N/A"}
                    </p>
                  </div>
                  <div className="">
                    <p className="inter text-[7px] font-normal text-white">
                      Network Address
                    </p>
                    <p className="inter text-[13px] font-normal text-white truncate max-w-[120px]">
                      {address.network_address}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Add New Address button */}
            <div
              className="bg-[#9EDA581A] rounded-[20px] h-40 p-4 overflow-hidden relative text-white flex items-center justify-center flex-col border border-[#648a3a] cursor-pointer"
              onClick={() => {
                setEditAddressId(null);
                setShowAddressModal(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <p className="inter font-medium text-base text-[#FFFBFD] mt-3">
                Add New Address
              </p>
            </div>
          </div>
        )}
      </div>
      {showAddressModal && (
        <AddressModal
          setShowAddressModal={setShowAddressModal}
          editAddressId={editAddressId}
        />
      )}
    </>
  );
};

export default Address;
