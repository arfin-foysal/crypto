"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
  useCallback,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Create the navigation context
const NavigationContext = createContext();

// Client component that uses useSearchParams
const RouteChangeDetector = ({ onRouteChange }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onRouteChange(pathname, searchParams);
  }, [pathname, searchParams, onRouteChange]);

  return null;
};

// Navigation provider component
export function NavigationProvider({ children }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [isSidebarNavigation, setSidebarNavigation] = useState(false);

  // Handle route changes
  const handleRouteChange = useCallback(() => {
    // Show loader only if it's a sidebar navigation
    // This ensures ShimmerLoader only shows for sidebar menu navigation
    if (isSidebarNavigation) {
      setIsNavigating(true);
    }

    // Hide loader after a short delay to ensure it's visible
    // Minimum display time of 600ms, but allow longer if the page takes time to load
    const timer = setTimeout(() => {
      setIsNavigating(false);
      setSidebarNavigation(false); // Reset sidebar navigation flag
    }, 600); // Slightly faster to make the app feel more responsive

    return () => clearTimeout(timer);
  }, [isSidebarNavigation]);

  // Context value
  const value = {
    isNavigating,
    setIsNavigating,
    isSidebarNavigation,
    setSidebarNavigation,
  };

  return (
    <NavigationContext.Provider value={value}>
      <Suspense fallback={null}>
        <RouteChangeDetector onRouteChange={handleRouteChange} />
      </Suspense>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook to use navigation context
export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
