import Dashboard from '../pages/dashboard/Dashboard';

import Users from '../pages/users/Users';
import DetailUser from '../pages/users/DetailUser';
import PendingUsers from '../pages/users/PendingUsers';
import FrozenUsers from '../pages/users/FrozenUsers';
import Withdraws from '../pages/withdraws/Withdraws';
import ViewWithdraw from '../pages/withdraws/ViewWithdraw';
import SuspendedUsers from '../pages/users/SuspendedUsers';
import ActiveUsers from '../pages/users/ActiveUsers';
import AddUser from '../pages/users/AddUser';
import EditUser from '../pages/users/EditUser';

// Bank Management
import Banks from '../pages/banks/Banks';
import AddBank from '../pages/banks/AddBank';
import EditBank from '../pages/banks/EditBank';
import ViewBank from '../pages/banks/ViewBank';

// Bank Account Management
import BankAccounts from '../pages/bank-accounts/BankAccounts';
import AddBankAccount from '../pages/bank-accounts/AddBankAccount';
import EditBankAccount from '../pages/bank-accounts/EditBankAccount';
import ViewBankAccount from '../pages/bank-accounts/ViewBankAccount';

// Currency Management
import Currencies from '../pages/currencies/Currencies';
import AddCurrency from '../pages/currencies/AddCurrency';
import EditCurrency from '../pages/currencies/EditCurrency';
import ViewCurrency from '../pages/currencies/ViewCurrency';

// Network Management
import Networks from '../pages/networks/Networks';
import AddNetwork from '../pages/networks/AddNetwork';
import EditNetwork from '../pages/networks/EditNetwork';
import ViewNetwork from '../pages/networks/ViewNetwork';

// Transaction Management
import Transactions from '../pages/transactions/Transactions';
import ViewTransaction from '../pages/transactions/ViewTransaction';
import BulkBankAccount from '../pages/bank-accounts/BulkBankAccount';

// Transaction Fees Management
import TransactionFees from '../pages/transaction-fees/TransactionFees';
import AddTransactionFee from '../pages/transaction-fees/AddTransactionFee';
import EditTransactionFee from '../pages/transaction-fees/EditTransactionFee';
import ViewTransactionFee from '../pages/transaction-fees/ViewTransactionFee';
import Clients from '../pages/clients/Clients';
import DetailClient from '../pages/clients/DetailClient';

// Country Management
import Countries from '../pages/countries/Countries';
import AddCountry from '../pages/countries/AddCountry';
import EditCountry from '../pages/countries/EditCountry';
import ViewCountry from '../pages/countries/ViewCountry';

// Content Management
import Contents from '../pages/contents/Contents';
import AddContent from '../pages/contents/AddContent';
import EditContent from '../pages/contents/EditContent';
import ViewContent from '../pages/contents/ViewContent';

// Component mapping for string-based references
const componentMap = {
  Users,
  AddUser,
  Banks,
  AddBank,
  BankAccounts,
  AddBankAccount,
  Currencies,
  AddCurrency,
  Networks,
  AddNetwork,
  Transactions,
  TransactionFees,
  AddTransactionFee,
  Countries,
  AddCountry,
  Contents,
  AddContent,
};

export const routes = [
  {
    path: '/dashboard',
    element: () => <Dashboard />
  },
  {
    path: '/clients',
    element: () => <Clients />
  },
  {
    path: '/clients/:id',
    element: () => <DetailClient />
  },
  {
    path: '/users',
    element: () => <Users />
  },
  {
    path: '/users/add',
    element: () => <AddUser />
  },
  {
    path: '/clients/edit/:id',
    element: () => <EditUser />,
    hideInMenu: true
  },
  {
    path: '/users/edit/:id',
    element: () => <EditUser />,
    hideInMenu: true
  },
  {
    path: '/users/edit/:id',
    element: () => <EditUser />,
    hideInMenu: true
  },
  {
    path: '/users/:id',
    element: () => <DetailUser />,
    hideInMenu: true
  },
  {
    path: '/users/active',
    element: () => <ActiveUsers />
  },
  {
    path: '/users/pending',
    element: () => <PendingUsers />
  },
  {
    path: '/users/FROZEN',
    element: () => <FrozenUsers />
  },

  {
    path: '/users/suspended',
    element: () => <SuspendedUsers />
  },
  {
    path: '/withdraw',
    element: () => <Withdraws />
  },
  {
    path: '/withdraw/:id',
    element: () => <ViewWithdraw />,
    hideInMenu: true
  },

  // Bank Management Routes
  {
    path: '/banks',
    element: () => <Banks />
  },
  {
    path: '/banks/add',
    element: () => <AddBank />
  },
  {
    path: '/banks/:id',
    element: () => <ViewBank />,
    hideInMenu: true
  },
  {
    path: '/banks/edit/:id',
    element: () => <EditBank />,
    hideInMenu: true
  },

  // Bank Account Management Routes
  {
    path: '/bank-accounts',
    element: () => <BankAccounts />
  },
  {
    path: '/bank-accounts/add',
    element: () => <AddBankAccount />
  },
  {
    path: '/bank-accounts/bulk',
    element: () => <BulkBankAccount />
  },
  {
    path: '/bank-accounts/:id',
    element: () => <ViewBankAccount />,
    hideInMenu: true
  },
  {
    path: '/bank-accounts/edit/:id',
    element: () => <EditBankAccount />,
    hideInMenu: true
  },

  // Currency Management Routes
  {
    path: '/currencies',
    element: () => <Currencies />
  },
  {
    path: '/currencies/add',
    element: () => <AddCurrency />
  },
  {
    path: '/currencies/:id',
    element: () => <ViewCurrency />,
    hideInMenu: true
  },
  {
    path: '/currencies/edit/:id',
    element: () => <EditCurrency />,
    hideInMenu: true
  },

  // Network Management Routes
  {
    path: '/networks',
    element: () => <Networks />
  },
  {
    path: '/networks/add',
    element: () => <AddNetwork />
  },
  {
    path: '/networks/:id',
    element: () => <ViewNetwork />,
    hideInMenu: true
  },
  {
    path: '/networks/edit/:id',
    element: () => <EditNetwork />,
    hideInMenu: true
  },

  // Transaction Management Routes
  {
    path: '/transactions',
    element: () => <Transactions />
  },
  {
    path: '/transactions/:id',
    element: () => <ViewTransaction />,
    hideInMenu: true
  },

  // Transaction Fees Management Routes
  {
    path: '/transaction-fees',
    element: () => <TransactionFees />
  },
  {
    path: '/transaction-fees/add',
    element: () => <AddTransactionFee />
  },
  {
    path: '/transaction-fees/:id',
    element: () => <ViewTransactionFee />,
    hideInMenu: true
  },
  {
    path: '/transaction-fees/edit/:id',
    element: () => <EditTransactionFee />,
    hideInMenu: true
  },

  {
    path: '/settings',
    element: () => <h1 className="text-2xl font-bold">Settings</h1>
  },

  // Country Management Routes
  {
    path: '/countries',
    element: () => <Countries />
  },
  {
    path: '/countries/add',
    element: () => <AddCountry />
  },
  {
    path: '/countries/:id',
    element: () => <ViewCountry />,
    hideInMenu: true
  },
  {
    path: '/countries/edit/:id',
    element: () => <EditCountry />,
    hideInMenu: true
  },

  // Content Management Routes
  {
    path: '/contents',
    element: () => <Contents />
  },
  {
    path: '/contents/add',
    element: () => <AddContent />
  },
  {
    path: '/contents/:id',
    element: () => <ViewContent />,
    hideInMenu: true
  },
  {
    path: '/contents/edit/:id',
    element: () => <EditContent />,
    hideInMenu: true
  },
  // Dynamic routes

];

// Helper function to get all routes
export const getAllRoutes = () => routes;
