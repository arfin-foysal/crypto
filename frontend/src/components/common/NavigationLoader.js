"use client";

import React from "react";
import { useNavigation } from "@/context/NavigationContext";
import ShimmerLoader from "./ShimmerLoader";

const NavigationLoader = () => {
  const { isNavigating, isSidebarNavigation } = useNavigation();

  // Only show ShimmerLoader for sidebar menu navigation
  // For other navigation (like API calls), we'll use simpler loaders
  return <ShimmerLoader isLoading={isNavigating && isSidebarNavigation} />;
};

export default NavigationLoader;
