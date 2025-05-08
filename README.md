# 💰 Crypto Project

A comprehensive cryptocurrency platform structured as a **monorepo** with three separate projects:

* `backend`: Express.js-based backend API
* `admin-panel`: React.js-based admin panel frontend
* `frontend`: Next.js-based client frontend

This universal crypto solution includes user management, admin and client dashboards, bank account management, and transaction capabilities.

---

## 🌟 Features

### 👥 User Management (Backend)

* Registration with automatic bank account assignment
* Authentication with JWT
* Role-based access control (User, Admin, SuperAdmin)
* User profile management

### 🏢 Admin Panel (`admin-panel` - React.js)

* React-based admin dashboard
* Manage admin users
* Admin role-based permissions
* View platform statistics
* Manage banks, accounts, transactions

### 👨‍💼 Client Frontend (`frontend` - Next.js)

* Next.js-based client-facing frontend
* Client registration and authentication
* Client dashboard to view account details
* Transaction history and withdrawal requests

### 🏦 Bank Management (Backend)

* Create, read, update, delete banks
* Filter and search banks
* Status management (PENDING, ACTIVE, FROZEN, SUSPENDED)

### 💳 Bank Account Management (Backend)

* Auto-generated 12-digit account numbers
* Link accounts to users and banks
* Status management (open/closed)
* Auto-assign account at user registration

### 💸 Withdrawal Management (Backend)

* Process withdrawal requests
* Status updates and tracking

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **ORM:** Prisma ORM
* **Database:** PostgreSQL
* **Authentication:** JWT
* **Validation:** Joi
* **Admin Frontend:** React.js
* **Client Frontend:** Next.js

---

## 📚 Monorepo Structure

```bash
root/
├── backend/
├── admin-panel/
└── frontend/
```

Each project contains its own `README.md` for project-specific setup instructions.

---

## 📦 Getting Started (Backend)

### Prerequisites

* Node.js (v14 or higher)
* npm or yarn
* PostgreSQL database

### Backend Installation

1. **Navigate to backend directory:**

   ```bash
   cd qacent-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Create environment file:**

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/crypto_db"
   JWT_SECRET="your_jwt_secret_key"
   JWT_EXPIRES_IN="1h"
   PORT=3000
   ```

4. **Run database migrations:**

   ```bash
   npx prisma migrate dev
   ```

5. **Start backend server:**

   ```bash
   npm start
   # or for development
   npm run dev
   ```

➡️ For frontend setup, refer to `qacent-admin-panel/README.md` and `qacent-frontend/README.md`.

---

## 📈 API Documentation (Backend)

### 🔐 Authentication Endpoints

#### Register User

* **POST** `/api/auth/register`
* **Body:**

  ```json
  { "full_name": "John Doe", "email": "john@example.com", "password": "12345678" }
  ```
* **Response:** User details + JWT token + assigned bank account

#### User Login

* **POST** `/api/auth/login`
* **Body:**

  ```json
  { "email": "john@example.com", "password": "12345678" }
  ```
* **Response:** User details + JWT token

#### Admin Login

* **POST** `/api/auth/admin/login`
* **Body:**

  ```json
  { "email": "admin@example.com", "password": "12345678" }
  ```
* **Response:** Admin details + JWT token

#### Client Login

* **POST** `/api/auth/client/login`
* **Body:**

  ```json
  { "email": "client@example.com", "password": "12345678" }
  ```
* **Response:** Client details + JWT token

---

## ⚠️ Error Handling

Consistent error format:

```json
{
  "status": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

---

## 🌍 License

MIT License

---

## 🤝 Contributors

Thank you to all contributors for your support and collaboration.

---
