const express = require("express");
const Route = express.Router();
const userController = require("../controllers/userController");
const withdrawController = require("../controllers/withdrawController");
const depositController = require("../controllers/depositController");
const bankController = require("../controllers/bankController");
const bankAccountController = require("../controllers/bankAccountController");
const currencyController = require("../controllers/currencyController");
const networkController = require("../controllers/networkController");
const transactionController = require("../controllers/transactionController");
const transactionFeeController = require("../controllers/transactionFeeController");
const countryController = require("../controllers/countryController");
const dashboardController = require("../controllers/dashboardController");
const contentController = require("../controllers/contentController");

/* User routes */
Route.get("/users", userController.getUsers);
Route.get("/users/dropdown/active", userController.getActiveUsersDropdown);
Route.post("/users", userController.addUser);
Route.put("/users/status/:id", userController.updateUserStatus);
Route.get("/users/:id", userController.getUserById);
Route.put("/users/:id", userController.updateUser);
Route.delete("/users/:id", userController.deleteUser);

/* Transaction routes */
Route.get("/transactions", transactionController.getTransactions);
Route.get(
  "/transactions/user/:user_id",
  transactionController.getTransactionsByUserId
);
Route.get("/transactions/:id", transactionController.getTransactionById);
Route.put(
  "/transactions/status/:id",
  transactionController.updateTransactionStatus
);

/* Deposit routes */
Route.post("/deposits", depositController.createDeposit);
Route.put("/deposits/status/:id", depositController.updateDepositStatus);

/* Withdraw routes */
Route.get("/withdraws", withdrawController.getWithdraws);
Route.post("/withdraws", withdrawController.createWithdraw);
Route.put("/withdraws/status/:id", withdrawController.updateUserStatus);
Route.get("/withdraws/:id", withdrawController.getWithdrawById);

/* Bank routes */
Route.get("/banks", bankController.getBanks);
Route.get("/banks/dropdown/active", bankController.getActiveBanksDropdown);
Route.post("/banks", bankController.createBank);
Route.put("/banks/status/:id", bankController.updateBankStatus);
Route.get("/banks/:id", bankController.getBankById);
Route.put("/banks/:id", bankController.updateBank);
Route.delete("/banks/:id", bankController.deleteBank);

/* Bank Account routes */
Route.get("/bank-accounts", bankAccountController.getBankAccounts);
Route.post("/bank-accounts", bankAccountController.createBankAccount);
Route.put(
  "/bank-accounts/status/:id",
  bankAccountController.updateBankAccountStatus
);
Route.get("/bank-accounts/:id", bankAccountController.getBankAccountById);
Route.put("/bank-accounts/:id", bankAccountController.updateBankAccount);
Route.delete("/bank-accounts/:id", bankAccountController.deleteBankAccount);
Route.post(
  "/bank-accounts/assign",
  bankAccountController.assignUserToBankAccount
);
Route.post(
  "/bank-accounts/bulk-create",
  bankAccountController.bulkCreateBankAccounts
);
Route.get(
  "/bank-accounts/dropdown/unassigned",
  bankAccountController.getUnassignedBankAccountsDropdown
);

/* Currency routes */
Route.get("/currencies", currencyController.getCurrencies);
Route.get(
  "/currencies/dropdown/active",
  currencyController.getActiveCurrenciesDropdown
);
Route.post("/currencies", currencyController.createCurrency);
Route.put("/currencies/status/:id", currencyController.updateCurrencyStatus);
Route.get("/currencies/:id", currencyController.getCurrencyById);
Route.put("/currencies/:id", currencyController.updateCurrency);
Route.delete("/currencies/:id", currencyController.deleteCurrency);

/* Network routes */
Route.get("/networks", networkController.getNetworks);
Route.get(
  "/networks/dropdown/active",
  networkController.getActiveNetworksDropdown
);
Route.post("/networks", networkController.createNetwork);
Route.put("/networks/status/:id", networkController.updateNetworkStatus);
Route.get("/networks/:id", networkController.getNetworkById);
Route.put("/networks/:id", networkController.updateNetwork);
Route.delete("/networks/:id", networkController.deleteNetwork);

/* Transaction Fee routes */
Route.get("/transaction-fees", transactionFeeController.getTransactionFees);
Route.post("/transaction-fees", transactionFeeController.createTransactionFee);
Route.get(
  "/transaction-fees/type/:fee_type",
  transactionFeeController.getTransactionFeeByType
);
Route.get(
  "/transaction-fees/:id",
  transactionFeeController.getTransactionFeeById
);
Route.put(
  "/transaction-fees/:id",
  transactionFeeController.updateTransactionFee
);
Route.delete(
  "/transaction-fees/:id",
  transactionFeeController.deleteTransactionFee
);

/* Country routes */
Route.get("/countries", countryController.getCountries);
Route.get(
  "/countries/dropdown/active",
  countryController.getActiveCountriesDropdown
);
Route.post("/countries", countryController.createCountry);
Route.put("/countries/status/:id", countryController.updateCountryStatus);
Route.get("/countries/:id", countryController.getCountryById);
Route.put("/countries/:id", countryController.updateCountry);
Route.delete("/countries/:id", countryController.deleteCountry);

/* Dashboard routes */
Route.get("/dashboard", dashboardController.getDashboardData);

/* Content routes */
Route.get("/contents", contentController.getContents);
Route.post("/contents", contentController.createContent);
Route.get("/contents/:id", contentController.getContentById);
Route.put("/contents/:id", contentController.updateContent);
Route.delete("/contents/:id", contentController.deleteContent);

module.exports = Route;
