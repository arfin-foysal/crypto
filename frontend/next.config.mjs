/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables that should be available to the browser
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  // Configure image domains
  images: {
    domains: ["localhost"],
  },

  // Other Next.js config options
  reactStrictMode: true,
};

export default nextConfig;
