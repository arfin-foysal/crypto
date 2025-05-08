"use client";
import AddressModal from "@/components/backend/AddressModal";
import React, { useState } from "react";

const Address = () => {
  const [showAddressModal, setShowAddressModal] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-b from-[#9EDA581A] via-[#68DB9F1A] to-[#2020201A] rounded-[32px] p-8">
        <div className="mb-5">
          <h2 className="text-xl font-semibold inter text-white mb-1">
            Crypto address{" "}
          </h2>
          <p className="text-xs font-semibold inter text-[#777576]">
            Details information of your crypto address{" "}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div
            className="bg-no-repeat bg-center bg-auto rounded-[20px] h-40 p-4 overflow-hidden relative border border-white/50"
            style={{
              backgroundImage:
                "url('/assets/backend_assets/images/address-card-bg.png')",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="kronaOne font-normal text-xl text-white">
                Solana
              </h3>
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
            <h4 className="gradient_text inter font-bold text-lg">
              My Network 1
            </h4>
            <div className="bg-white/20 absolute bottom-0 left-0 w-full px-4 py-3 flex justify-between items-center rounded-b-[16px]">
              <div className="">
                <p className="inter text-[7px] font-normal text-white">
                  Currency
                </p>
                <p className="inter text-[13px] font-normal text-white">USDC</p>
              </div>
              <div className="">
                <p className="inter text-[7px] font-normal text-white">
                  Network Address
                </p>
                <p className="inter text-[13px] font-normal text-white">
                  Ahnaf.ayon@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-no-repeat bg-center bg-auto rounded-[20px] h-40 p-4 overflow-hidden relative border border-white/50"
            style={{
              backgroundImage:
                "url('/assets/backend_assets/images/address-card-bg.png')",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="kronaOne font-normal text-xl text-white">
                Solana
              </h3>
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
            <h4 className="gradient_text inter font-bold text-lg">
              My Network 1
            </h4>
            <div className="bg-white/20 absolute bottom-0 left-0 w-full px-4 py-3 flex justify-between items-center rounded-b-[16px]">
              <div className="">
                <p className="inter text-[7px] font-normal text-white">
                  Currency
                </p>
                <p className="inter text-[13px] font-normal text-white">USDC</p>
              </div>
              <div className="">
                <p className="inter text-[7px] font-normal text-white">
                  Network Address
                </p>
                <p className="inter text-[13px] font-normal text-white">
                  Ahnaf.ayon@gmail.com
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-[#9EDA581A] rounded-[20px] h-40 p-4 overflow-hidden relative  text-white flex items-center justify-center flex-col border border-[#648a3a] cursor-pointer"
            onClick={() => setShowAddressModal(true)}
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
      </div>
      {showAddressModal && (
        <AddressModal setShowAddressModal={setShowAddressModal} />
      )}
    </>
  );
};

export default Address;
