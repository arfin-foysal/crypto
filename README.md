# Crypto Project API

A comprehensive backend API for a cryptocurrency platform with user management, bank account management, and transaction capabilities.

## Features

- **User Management**

  - Registration with automatic bank account assignment
  - Authentication with JWT
  - Role-based access control (User, Admin, SuperAdmin)
  - User profile management

- **Bank Management**

  - Create, read, update, delete banks
  - Filter and search banks
  - Status management (PENDING, ACTIVE, FROZEN, SUSPENDED)

- **Bank Account Management**

  - Auto-generated 12-digit account numbers
  - Link accounts to users and banks
  - Status management (open/closed)
  - Automatic assignment during user registration

- **Withdrawal Management**
  - Process withdrawal requests
  - Status updates and tracking

## Tech Stack

- Node.js
- Express.js
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Joi Validation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/crypto-project.git
   cd crypto-project
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/crypto_db"
   JWT_SECRET="your_jwt_secret_key"
   JWT_EXPIRES_IN="1h"
   PORT=3000
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Start the server:
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register User

```
POST /api/auth/register
```

- **Description**: Register a new user and automatically assign an available bank account
- **Request Body**:
  ```json
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "12345678"
  }
  ```
- **Response**: User details with JWT token and assigned bank account (if available)

#### User Login

```
POST /api/auth/login
```

- **Description**: Authenticate a user and get JWT token
- **Request Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "12345678"
  }
  ```
- **Response**: User details with JWT token

#### Admin Login

```
POST /api/auth/admin/login
```

- **Description**: Authenticate an admin user
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "12345678"
  }
  ```
- **Response**: Admin user details with JWT token

## Error Handling

The API uses consistent error responses:

```json
{
  "status": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

## License

[MIT License](LICENSE)

## Contributors
