"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Check if there's a token in localStorage
        const token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Authentication error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.login({ email, password });

      if (data.status && data.data) {
        // Store token and user data
        localStorage.setItem("access_token", data.data.access_token);
        localStorage.setItem("token_type", data.data.token_type);
        localStorage.setItem("expires_in", data.data.expires_in);
        localStorage.setItem("user", JSON.stringify(data.data.user));

        // Update state
        setUser(data.data.user);

        // Redirect to dashboard
        router.push("/dashboard");
        return true;
      } else {
        // Handle the error format from the backend
        // The backend returns: { errors: "...", message: "...", status: false }
        const errorObj = {
          errors: data.errors || null,
          message: data.message || "Login failed",
          status: data.status,
        };
        throw errorObj;
      }
    } catch (error) {
      // Pass the full error object to preserve all error information
      setError(error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("user");

    // Update state
    setUser(null);

    // Redirect to home page instead of login
    router.push("/home");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
