"use client";

import toast from 'react-hot-toast';

// Add a global toast function to the window object
if (typeof window !== 'undefined') {
  window.showToast = (message, type = 'default') => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'loading':
        toast.loading(message);
        break;
      default:
        toast(message);
    }
  };
}

// Export the function for direct imports
export const showToast = (message, type = 'default') => {
  if (typeof window !== 'undefined') {
    window.showToast(message, type);
  }
};
