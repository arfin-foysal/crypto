"use client";

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 5000,
        style: {
          background: '#fff',
          color: '#363636',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '16px',
        },
        // Custom styles for different toast types
        success: {
          style: {
            background: '#EFF8F1',
            border: '1px solid #648A3A',
            color: '#648A3A',
          },
          iconTheme: {
            primary: '#648A3A',
            secondary: '#FFFFFF',
          },
        },
        error: {
          style: {
            background: '#FFF5F5',
            border: '1px solid #E53E3E',
            color: '#E53E3E',
          },
          iconTheme: {
            primary: '#E53E3E',
            secondary: '#FFFFFF',
          },
        },
        loading: {
          style: {
            background: '#EBF8FF',
            border: '1px solid #3182CE',
            color: '#3182CE',
          },
        },
      }}
    />
  );
}
