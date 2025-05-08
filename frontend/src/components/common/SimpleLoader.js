"use client";

import React from "react";

const SimpleLoader = ({ isLoading, size = "small" }) => {
  if (!isLoading) return null;

  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-6 w-6 border-2",
    large: "h-8 w-8 border-3",
  };

  return (
    <div className="inline-flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent border-[#648A3A] animate-spin`}
      ></div>
    </div>
  );
};

export default SimpleLoader;
