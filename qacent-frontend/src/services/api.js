/**
 * Enhanced API client for making HTTP requests
 * Supports all HTTP methods (GET, POST, PUT, DELETE) with JSON and FormData
 */

// Get the API base URL from environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Function to handle unauthorized (401) responses
const handleUnauthorized = () => {
  // Only run on client side
  if (typeof window !== "undefined") {
    // Clear localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("expires_in");
    localStorage.removeItem("user");

    // Clear API cache
    apiCache.clear();

    // Show a message to the user (if toast is available)
    if (typeof window.showToast === "function") {
      window.showToast("Session expired. Please log in again.", "error");
    }

    // Redirect to home page
    window.location.href = "/home";
  }
};

// Simple in-memory cache for API responses
const apiCache = {
  cache: new Map(),
  // Set a cache entry with optional expiration time (in milliseconds)
  set: function (key, value, ttl = 60000) {
    // Default TTL: 1 minute
    const expiresAt = Date.now() + ttl;
    this.cache.set(key, { value, expiresAt });
  },
  // Get a cache entry if it exists and hasn't expired
  get: function (key) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  },
  // Clear all cache entries
  clear: function () {
    this.cache.clear();
  },
};

/**
 * ApiClient class for making HTTP requests
 * Provides a flexible and reusable way to interact with APIs
 */
class ApiClient {
  /**
   * Constructor for ApiClient
   * @param {string} baseUrl - The base URL for API requests
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {};
  }

  /**
   * Set default headers for all requests
   * @param {Object} headers - Headers to set as default
   */
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }

  /**
   * Get authentication headers
   * @returns {Object} - Authentication headers
   */
  getAuthHeaders() {
    const headers = {};

    // Add authorization header if token exists
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        const tokenType = localStorage.getItem("token_type") || "Bearer";
        headers["Authorization"] = `${tokenType} ${token}`;
      }
    }

    return headers;
  }

  /**
   * Make a request to the API
   * @param {string} endpoint - The API endpoint
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {Object|FormData} data - Request data (optional)
   * @param {Object} customHeaders - Custom headers (optional)
   * @param {Object} options - Additional fetch options (optional)
   * @returns {Promise<any>} - The response data
   */
  async request(
    endpoint,
    method,
    data = null,
    customHeaders = {},
    options = {}
  ) {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = data instanceof FormData;

    // Prepare headers
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...customHeaders,
    };

    // Only set Content-Type for non-FormData requests
    if (!isFormData && !headers["Content-Type"] && method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    // Prepare request options
    const requestOptions = {
      method,
      headers,
      ...options,
    };

    // Add body for non-GET requests if data is provided
    if (method !== "GET" && data !== null) {
      requestOptions.body = isFormData ? data : JSON.stringify(data);
    }

    // Log request details in development mode only
    if (process.env.NODE_ENV === "development") {
      console.log(`API ${method} request to: ${url}`, {
        method,
        headers: {
          ...headers,
          Authorization: headers.Authorization ? "[REDACTED]" : undefined,
        },
      });
    }

    try {
      // Make the request
      const response = await fetch(url, requestOptions);
      // Log response status in development mode only
      if (process.env.NODE_ENV === "development") {
        console.log(
          `API response status: ${response.status} ${response.statusText}`
        );
      }

      // Handle response
      return await this.handleResponse(response);
    } catch (error) {
      console.error("API request error:", error);
      return {
        status: false,
        message: error.message || "Network error occurred",
        error,
      };
    }
  }

  /**
   * Handle API response
   * @param {Response} response - Fetch Response object
   * @returns {Promise<any>} - Processed response data
   */
  async handleResponse(response) {
    // Check if response is ok
    if (!response.ok) {
      return await this.handleErrorResponse(response);
    }

    // Handle successful response
    try {
      // Check if response has content
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        // Log success response in development mode only
        if (process.env.NODE_ENV === "development") {
          console.log("API success response:", data);
        }
        return data;
      } else {
        // Handle non-JSON responses (like empty responses)
        return { status: true, message: "Operation completed successfully" };
      }
    } catch (jsonError) {
      // Only log errors in development mode
      if (process.env.NODE_ENV === "development") {
        console.error("Error parsing JSON response:", jsonError);
      }
      return { status: true, message: "Operation completed successfully" };
    }
  }

  /**
   * Handle error response
   * @param {Response} response - Fetch Response object
   * @returns {Promise<any>} - Processed error data
   */
  async handleErrorResponse(response) {
    // Check for 401 Unauthorized response
    if (response.status === 401) {
      // Handle unauthorized access (token expired or invalid)
      if (process.env.NODE_ENV === "development") {
        console.error("Unauthorized access (401). Logging out...");
      }

      // Call the handleUnauthorized function to log out and redirect
      handleUnauthorized();
    }

    try {
      // Try to parse error as JSON
      const errorData = await response.json();
      // Only log errors in development mode
      if (process.env.NODE_ENV === "development") {
        console.error("API error response:", errorData);
      }

      return {
        status: false,
        message:
          errorData.message ||
          `API request failed with status ${response.status}`,
        errors: errorData.errors || errorData.error || null,
        error: errorData,
      };
    } catch (jsonError) {
      // Handle non-JSON error responses
      // Only log errors in development mode
      if (process.env.NODE_ENV === "development") {
        console.error(`Error parsing error response: ${jsonError.message}`);
      }

      return {
        status: false,
        message: `API request failed with status ${response.status}: ${response.statusText}`,
        error: { status: response.status, statusText: response.statusText },
      };
    }
  }

  /**
   * Make a GET request
   * @param {string} endpoint - The API endpoint
   * @param {Object} params - Query parameters (optional)
   * @param {Object} headers - Custom headers (optional)
   * @returns {Promise<any>} - The response data
   */
  async get(endpoint, params = {}, headers = {}) {
    // Add query parameters to endpoint if provided
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpointWithParams = queryString
      ? `${endpoint}?${queryString}`
      : endpoint;

    return this.request(endpointWithParams, "GET", null, headers);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - The API endpoint
   * @param {Object|FormData} data - Request data
   * @param {Object} headers - Custom headers (optional)
   * @returns {Promise<any>} - The response data
   */
  async post(endpoint, data, headers = {}) {
    return this.request(endpoint, "POST", data, headers);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - The API endpoint
   * @param {Object|FormData} data - Request data
   * @param {Object} headers - Custom headers (optional)
   * @returns {Promise<any>} - The response data
   */
  async put(endpoint, data, headers = {}) {
    return this.request(endpoint, "PUT", data, headers);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - Request data (optional)
   * @param {Object} headers - Custom headers (optional)
   * @returns {Promise<any>} - The response data
   */
  async delete(endpoint, data = null, headers = {}) {
    return this.request(endpoint, "DELETE", data, headers);
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - The API endpoint
   * @param {Object|FormData} data - Request data
   * @param {Object} headers - Custom headers (optional)
   * @returns {Promise<any>} - The response data
   */
  async patch(endpoint, data, headers = {}) {
    return this.request(endpoint, "PATCH", data, headers);
  }
}

// Create and export a singleton instance with the API base URL
export const apiClient = new ApiClient(API_BASE_URL);

// For backward compatibility with existing code
export async function apiRequest(endpoint, options = {}) {
  const method = options.method || "GET";
  const headers = options.headers || {};
  const data = options.body || null;

  // Convert string body to object if it's JSON
  let parsedData = data;
  if (
    typeof data === "string" &&
    headers["Content-Type"] === "application/json"
  ) {
    try {
      parsedData = JSON.parse(data);
    } catch (e) {
      parsedData = data;
    }
  }

  // Use the new apiClient methods
  switch (method) {
    case "GET":
      return apiClient.get(endpoint, {}, headers);
    case "POST":
      return apiClient.post(endpoint, parsedData, headers);
    case "PUT":
      return apiClient.put(endpoint, parsedData, headers);
    case "DELETE":
      return apiClient.delete(endpoint, parsedData, headers);
    case "PATCH":
      return apiClient.patch(endpoint, parsedData, headers);
    default:
      return apiClient.request(endpoint, method, parsedData, headers);
  }
}

/**
 * API service methods
 */
const apiService = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @returns {Promise<any>} - The response data
   */
  login: async (credentials) => {
    return apiClient.post("/auth/login", credentials);
  },

  /**
   * Register user
   * @param {Object} userData - User registration data
   * @returns {Promise<any>} - The response data
   */
  register: async (userData) => {
    // Log form data entries in development mode only (excluding sensitive data)
    if (
      process.env.NODE_ENV === "development" &&
      userData instanceof FormData
    ) {
      console.log("Registration data being sent:");
      for (let [key, value] of userData.entries()) {
        if (!key.includes("password")) {
          console.log(
            `Form data entry - ${key}:`,
            typeof value === "string" ? value : "[File]"
          );
        }
      }
    }

    // Use the new apiClient which handles both JSON and FormData
    return apiClient.post("/auth/register", userData);
  },

  /**
   * Get countries list
   * @returns {Promise<any>} - The response data with countries
   */
  getCountries: async () => {
    const cacheKey = "/open/dropdown/countries";
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/open/dropdown/countries");

    if (response.status) {
      // Cache successful responses for 1 day (countries rarely change)
      apiCache.set(cacheKey, response, 86400000); // 24 hours
    }

    return response;
  },

  // Removed commented-out code for cleaner codebase

  /**
   * Get transactions with optional filters
   * @param {Object} filters - Optional filters (search, endDate, status, page, per_page)
   * @returns {Promise<any>} - The response data with transactions
   */
  getTransactions: async (filters = {}) => {
    // Map per_page to perPage for API compatibility
    const apiFilters = { ...filters };
    if (apiFilters.per_page) {
      apiFilters.perPage = apiFilters.per_page;
      delete apiFilters.per_page;
    }

    return apiClient.get("/clients/transactions", apiFilters);
  },

  /**
   * Get network addresses for the client
   * @param {Object} filters - Optional filters (page, per_page)
   * @returns {Promise<any>} - The response data with network addresses
   */
  getNetworkAddresses: async (filters = {}) => {
    // Map per_page to perPage for API compatibility
    const apiFilters = { ...filters };
    if (apiFilters.per_page) {
      apiFilters.perPage = apiFilters.per_page;
      delete apiFilters.per_page;
    }

    return apiClient.get("/clients/networks-address", apiFilters);
  },

  /**
   * Create a new network address for the client
   * @param {Object} data - The network address data
   * @param {string} data.currency_id - The currency ID
   * @param {string} data.network_id - The network ID
   * @param {string} data.name - The name of the network address (optional)
   * @param {string} data.network_address - The network address
   * @returns {Promise<any>} - The response data
   */
  createNetworkAddress: async (data) => {
    return apiClient.post("/clients/networks-address", data);
  },

  /**
   * Get currencies for dropdown
   * @returns {Promise<any>} - The response data with currencies
   */
  getCurrencies: async () => {
    const cacheKey = "/clients/dropdown/currencies";
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/clients/dropdown/currencies");

    if (response.status) {
      // Cache successful responses for 1 hour (currencies rarely change)
      apiCache.set(cacheKey, response, 3600000);
    }

    return response;
  },

  /**
   * Get networks for a specific currency
   * @param {string} currencyId - The currency ID
   * @returns {Promise<any>} - The response data with networks
   */
  getNetworks: async (currencyId) => {
    return apiClient.get(`/clients/dropdown/networks/${currencyId}`);
  },

  /**
   * Get a specific network address by ID
   * @param {string} id - The network address ID
   * @returns {Promise<any>} - The response data with network address details
   */
  getNetworkAddressById: async (id) => {
    return apiClient.get(`/clients/networks-address/${id}`);
  },

  /**
   * Update a network address
   * @param {string} id - The network address ID
   * @param {Object} data - The updated network address data
   * @param {string} data.currency_id - The currency ID
   * @param {string} data.network_id - The network ID
   * @param {string} data.name - The name of the network address (optional)
   * @param {string} data.network_address - The network address
   * @returns {Promise<any>} - The response data
   */
  updateNetworkAddress: async (id, data) => {
    return apiClient.put(`/clients/networks-address/${id}`, data);
  },

  /**
   * Get bank account details
   * @returns {Promise<any>} - The response data with bank account details
   */
  getBankAccount: async () => {
    const cacheKey = "/clients/bank-account";
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/clients/bank-account");

    if (response.status) {
      // Cache successful responses for 5 minutes (bank details rarely change)
      apiCache.set(cacheKey, response, 300000);
    }

    return response;
  },

  /**
   * Get user profile
   * @returns {Promise<any>} - The response data with user profile
   */
  getProfile: async () => {
    const cacheKey = "/clients/profile";
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/clients/profile");

    if (response.status) {
      // Cache successful responses for 30 seconds
      apiCache.set(cacheKey, response, 30000);
    }

    return response;
  },

  /**
   * Update user profile
   * @param {Object|FormData} data - The profile data to update
   * @returns {Promise<any>} - The response data
   */
  updateProfile: async (data) => {
    // Log FormData entries in development mode only (excluding sensitive data)
    if (process.env.NODE_ENV === "development" && data instanceof FormData) {
      for (let [key, value] of data.entries()) {
        if (!key.includes("password")) {
          console.log(
            `Form data entry - ${key}:`,
            typeof value === "string" ? value : "[File]"
          );
        }
      }
    }

    // Use the new apiClient which handles both JSON and FormData
    return apiClient.put("/clients/profile", data);
  },

  // Profile photo upload is now handled by the updateProfile method

  /**
   * Create a withdrawal request
   * @param {Object} data - The withdrawal data
   * @param {number} data.amount - The amount to withdraw
   * @param {number} data.to_currency_id - The currency ID to withdraw to
   * @param {number} data.user_network_id - The network address ID
   * @param {number} data.form_currency_id - The currency ID to withdraw from
   * @returns {Promise<any>} - The response data
   */
  createWithdraw: async (data) => {
    return apiClient.post("/clients/withdraws", data);
  },

  /**
   * Get withdraw transaction fee
   * @returns {Promise<any>} - The response data with withdraw fee details
   */
  getWithdrawFee: async () => {
    const cacheKey = "/clients/transaction-fees/withdraw";
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/clients/transaction-fees/withdraw");

    if (response.status) {
      // Cache successful responses for 1 hour (fees rarely change)
      apiCache.set(cacheKey, response, 3600000);
    }

    return response;
  },

  /**
   * Get currency details by ID
   * @param {string} currencyId - The currency ID
   * @returns {Promise<any>} - The response data with currency details
   */
  getCurrencyById: async (currencyId) => {
    const cacheKey = `/clients/currencies/${currencyId}`;
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get(`/clients/currencies/${currencyId}`);

    if (response.status) {
      // Cache successful responses for 5 minutes (currency details rarely change)
      apiCache.set(cacheKey, response, 300000);
    }

    return response;
  },

  /**
   * Get balance changes data for dashboard chart
   * @returns {Promise<any>} - The response data with balance changes
   */
  getBalanceChanges: async () => {
    const cacheKey = "/clients/dashboard/balance-changes";
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    const response = await apiClient.get("/clients/dashboard/balance-changes");

    if (response.status) {
      // Cache successful responses for 5 minutes
      apiCache.set(cacheKey, response, 300000);
    }

    return response;
  },

  /**
   * Get content by IDs
   * @param {string|Array<string>} ids - The content IDs to fetch
   * @returns {Promise<any>} - The response data with content
   */
  getContentByIds: async (ids) => {
    if (!ids) return { status: false, message: "No content IDs provided" };

    // Convert array to comma-separated string if needed
    const contentIds = Array.isArray(ids) ? ids.join(",") : ids;

    const cacheKey = `/clients/contents/by-ids?ids=${contentIds}`;
    const cachedData = apiCache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await apiClient.get(
        `/clients/contents/by-ids?ids=${contentIds}`
      );

      if (response.status) {
        // Cache successful responses for 1 hour (content rarely changes)
        apiCache.set(cacheKey, response, 3600000);
      }

      return response;
    } catch (error) {
      console.error("Error fetching content by IDs:", error);
      return { status: false, message: "Failed to fetch content", data: {} };
    }
  },

  /**
   * Clear all cached API responses
   * Call this method when user logs out or when cache needs to be refreshed
   */
  clearCache: () => {
    apiCache.clear();
  },

  /**
   * Clear specific cached API responses by key or prefix
   * @param {string|Array<string>} keys - The cache key(s) or prefix(es) to clear
   */
  clearCacheByKeys: (keys) => {
    if (!keys) return;

    const keysArray = Array.isArray(keys) ? keys : [keys];

    for (const [cacheKey] of apiCache.cache.entries()) {
      for (const keyToMatch of keysArray) {
        if (cacheKey === keyToMatch || cacheKey.startsWith(keyToMatch)) {
          apiCache.cache.delete(cacheKey);
          break;
        }
      }
    }
  },

  /**
   * Handle unauthorized access (401)
   * This method can be called directly from components if needed
   */
  handleUnauthorized: () => {
    handleUnauthorized();
  },
};

export default apiService;
