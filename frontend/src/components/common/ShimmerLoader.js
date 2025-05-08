"use client";

import React from "react";

const ShimmerLoader = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 top-[72px] z-40 flex items-center justify-center bg-[#1C1C1C] bg-opacity-30 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-5xl">
        {/* Main content area - matches the exact layout of your application */}
        <div className="w-full px-2 mt-10 ml-30 md:mt-0">
          {/* Breadcrumb shimmer */}
          <div className="flex items-center mb-4">
            <div className="h-4 w-4 bg-[#2A2A2A] rounded-sm relative overflow-hidden mr-2">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
            </div>
            <div className="h-4 w-20 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* Content container with gradient background */}
          <div className="bg-gradient-to-b from-[#9EDA581A] via-[#68DB9F1A] to-[#2020201A] rounded-[32px] p-8 border border-[#3B3B3B]">
            {/* Page title */}
            <div className="mb-5">
              <div className="h-7 w-48 bg-[#2A2A2A] rounded-md relative overflow-hidden mb-1">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
              </div>
              <div className="h-4 w-64 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
              </div>
            </div>

            {/* Main content - based on transactions page */}
            <div className="bg-[#232323] rounded-[20px] p-6">
              {/* Filter row */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="h-10 w-40 bg-[#2A2A2A] rounded-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                </div>
                <div className="h-10 w-40 bg-[#2A2A2A] rounded-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                </div>
                <div className="h-10 w-40 bg-[#2A2A2A] rounded-md relative overflow-hidden ml-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                </div>
              </div>

              {/* Table header */}
              <div className="w-full text-sm text-left mb-4">
                <div className="flex border-b border-[#3D3D3D] pb-3">
                  <div className="px-6 py-3 w-1/5">
                    <div className="h-4 w-20 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="px-6 py-3 w-1/5">
                    <div className="h-4 w-20 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="px-6 py-3 w-1/5">
                    <div className="h-4 w-20 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="px-6 py-3 w-1/5">
                    <div className="h-4 w-20 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="px-6 py-3 w-1/5">
                    <div className="h-4 w-20 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table rows */}
              <div className="w-full">
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="flex border-b border-[#3D3D3D] py-4"
                  >
                    <div className="px-6 w-1/5">
                      <div className="flex items-center">
                        <div className="h-5 w-5 bg-[#2A2A2A] rounded-full relative overflow-hidden mr-2">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                        </div>
                        <div className="h-5 w-20 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 w-1/5">
                      <div className="flex items-center">
                        <div className="h-5 w-5 bg-[#2A2A2A] rounded-full relative overflow-hidden mr-2">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                        </div>
                        <div className="h-5 w-16 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    </div>
                    <div className="px-6 w-1/5">
                      <div className="h-5 w-24 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="px-6 w-1/5">
                      <div className="h-5 w-16 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="px-6 w-1/5">
                      <div className="h-5 w-12 bg-[#2A2A2A] rounded-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-8 w-20 bg-[#2A2A2A] rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <div className="h-8 w-8 bg-[#2A2A2A] rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-8 w-8 bg-[#2A2A2A] rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-8 w-8 bg-[#2A2A2A] rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#333333] to-transparent animate-shimmer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShimmerLoader;
