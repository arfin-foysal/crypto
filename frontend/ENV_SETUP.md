# Environment Configuration

This document explains how to configure environment variables for the Qacent Frontend application.

## Environment Files

The application uses the following environment files:

- `.env.local`: Local environment variables (not committed to git)
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

## Required Environment Variables

The following environment variables are required:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | The base URL for the API | `http://localhost:8080/api` |

## Setting Up Environment Variables

1. Create a `.env.local` file in the root directory of the project
2. Add the required environment variables to the file

Example `.env.local` file:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Using Environment Variables in the Code

Environment variables that start with `NEXT_PUBLIC_` are available in the browser. You can access them in your code like this:

```javascript
// In JavaScript files
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
```

For server-side only environment variables (not starting with `NEXT_PUBLIC_`), they will only be available in server-side code.

## API Service

The application includes an API service that uses the environment variables to make API requests. You can use it like this:

```javascript
import apiService from '@/services/api';

// Login
const response = await apiService.login({ email, password });

// Get user profile
const profile = await apiService.getProfile();
```

## Environment Variables in Next.js Config

The Next.js configuration file (`next.config.mjs`) includes the environment variables that should be available to the browser:

```javascript
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  // ...
};
```

## Deployment

When deploying the application, make sure to set the environment variables in your hosting platform.

- For Vercel, you can set environment variables in the project settings
- For other platforms, refer to their documentation on how to set environment variables
