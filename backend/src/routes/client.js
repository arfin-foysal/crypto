const express = require("express");
const Route = express.Router();
const transactionController = require("../controllers/transactionController");
const userNetworkController = require("../controllers/userNetworkController");
const profileController = require("../controllers/profileController");
const clientWithdrawController = require("../controllers/clientWithdrawController");
const clientTransactionFeeController = require("../controllers/clientTransactionFeeController");
const clientCurrencyController = require("../controllers/clientCurrencyController");
const clientDashboardController = require("../controllers/clientDashboardController");
const contentController = require("../controllers/contentController");

/* User routes */
Route.get("/", (req, res) => {
  res.json({ message: "User route" });
});

/* Profile routes */
Route.get("/profile", profileController.getProfile);
Route.put("/profile", profileController.updateProfile);
Route.get("/bank-account", profileController.getBankAccount);

/* Transaction routes */
Route.get("/transactions", transactionController.getTransactionsByUser);

/* Withdraw routes */
Route.post("/withdraws", clientWithdrawController.createClientWithdraw);

/* User Network routes */
Route.get("/networks-address", userNetworkController.getUserNetworksAddress);
Route.get(
  "/networks-address/dropdown/active",
  userNetworkController.getActiveNetworksDropdown
);
Route.get("/networks-address/:id", userNetworkController.getUserNetworkById);
Route.post("/networks-address", userNetworkController.createUserNetwork);
Route.put("/networks-address/:id", userNetworkController.updateUserNetwork);
Route.put(
  "/networks-address/status/:id",
  userNetworkController.updateUserNetworkStatus
);
Route.delete("/networks-address/:id", userNetworkController.deleteUserNetwork);

/* Currency routes */
Route.get("/currencies/:id", clientCurrencyController.getCurrencyById);

/* Dropdown routes */
Route.get("/dropdown/currencies", userNetworkController.getCurrenciesDropdown);
Route.get(
  "/dropdown/networks/:currency_id",
  userNetworkController.getNetworksByCurrencyDropdown
);
Route.get(
  "/dropdown/addresses/:currency_id",
  userNetworkController.getUserNetworkAddressesByCurrencyDropdown
);

/* Dashboard routes */
Route.get(
  "/dashboard/balance-changes",
  clientDashboardController.getBalanceChangesData
);

/* Transaction Fee routes */
Route.get(
  "/transaction-fees/type/:fee_type",
  clientTransactionFeeController.getTransactionFeeByType
);
Route.get(
  "/transaction-fees/withdraw",
  clientTransactionFeeController.getWithdrawFee
);
Route.get(
  "/dropdown/addresses/:network_id",
  userNetworkController.getUserNetworkAddressesByNetworkDropdown
);

Route.get("/contents/by-ids", contentController.getContentByIds);


module.exports = Route;
