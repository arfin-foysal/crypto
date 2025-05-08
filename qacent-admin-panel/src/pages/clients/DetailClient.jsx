import { useParams } from 'react-router-dom';
import { useGetApiWithIdQuery, useUpdateApiJsonMutation, usePostApiMutation, useGetApiWithStringQuery, useGetApiQuery } from '../../store/api/commonSlice';
import { ArrowLeftIcon, BanknotesIcon, IdentificationIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, ClockIcon, CurrencyDollarIcon, PlusCircleIcon, DocumentCheckIcon, LinkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


// Define user status constants
const USER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN',
  SUSPENDED: 'SUSPENDED'
};

// Define transaction status constants
const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUND: "REFUND",
  IN_REVIEW: "IN_REVIEW",
};

const DetailClient = () => {
  const { id } = useParams();
  const { data: response, isLoading, isError, refetch } = useGetApiWithIdQuery(['users', id]);
  const user = response; // Access the data property from the response
  const [activeTab, setActiveTab] = useState('basic'); // 'basic', 'bank', or 'verification'
  const [updateStatus] = useUpdateApiJsonMutation();
  const [postApi] = usePostApiMutation();

  // Fetch unassigned bank accounts for dropdown
  const { data: unassignedBankAccounts, isLoading: isLoadingUnassignedAccounts } = useGetApiQuery({
    url: 'bank-accounts/dropdown/unassigned',
    skip: activeTab !== 'bank' // Always fetch when bank tab is active
  });

  // Fetch deposit fee
  const { data: depositFeeData } = useGetApiWithStringQuery(['transaction-fees/type', 'DEPOSIT']);

  // State for transaction pagination and search
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const searchableFields = ["transaction_id", "uid"];

  // Fetch user transactions
  const { data: transactionsData, isLoading: isTransactionsLoading } = useGetApiWithStringQuery(
    ['transactions/user', id],
    { skip: !id }
  );

  // Get transactions and paginate
  // Make sure we're working with an array
  const allTransactions = Array.isArray(transactionsData?.data) ? transactionsData.data :
    Array.isArray(transactionsData?.data?.data) ? transactionsData.data.data : [];

  // Filter transactions based on search term
  const transactions = searchTerm
    ? allTransactions.filter(transaction =>
      searchableFields.some(field =>
        transaction[field]?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    : allTransactions;

  // Calculate pagination
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };



  // Handle status update with dropdown
  const handleStatusUpdate = () => {
    // Create dropdown menu for status selection
    confirmAlert({
      title: 'Change User Status',
      message: `Select a new status for user ${user?.data?.full_name}:`,
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Change User Status</h2>
            <p className="mb-4">Select a new status for user {user?.data?.full_name}:</p>
            <div className="mb-4">
              <select
                id="status-select"
                className="w-full p-2 border rounded-lg"
                defaultValue={user?.data?.status}
              >
                {Object.values(USER_STATUS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newStatus = document.getElementById('status-select').value;
                  updateUserStatus(id, newStatus, onClose);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        );
      }
    });
  };

  // Handle bank account assignment
  const handleAssignBankAccount = () => {
    confirmAlert({
      title: 'Assign Bank Account',
      message: `Select a bank account to assign to ${user?.data?.full_name}:`,
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">Assign Bank Account</h2>
            <p className="mb-4">Select a bank account to assign to {user?.data?.full_name}:</p>

            {isLoadingUnassignedAccounts ? (
              <div className="flex justify-center items-center py-4">
                <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : unassignedBankAccounts?.data?.length > 0 ? (
              <div className="mb-4">
                <select
                  id="bank-account-select"
                  className="w-full p-2 border rounded-lg"
                >
                  <option value="">Select a bank account</option>
                  {unassignedBankAccounts.data.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.bank.name} - {account.account_number} ({account.bank.currency.code})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg">
                <p>No unassigned bank accounts available.</p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const bankAccountId = document.getElementById('bank-account-select')?.value;
                  if (!bankAccountId) {
                    toast.error('Please select a bank account');
                    return;
                  }
                  assignBankAccount(id, bankAccountId, onClose);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={isLoadingUnassignedAccounts || !unassignedBankAccounts?.data?.length}
              >
                Assign
              </button>
            </div>
          </div>
        );
      }
    });
  };

  // Function to call the API to assign bank account to user
  const assignBankAccount = async (userId, bankAccountId, onClose) => {
    try {
      await postApi({
        end_point: 'bank-accounts/assign',
        body: { user_id: parseInt(userId), bank_account_id: parseInt(bankAccountId) }
      }).unwrap();
      toast.success('Bank account assigned successfully');
      refetch(); // Refresh the data
      onClose();
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to assign bank account');
      console.error('Bank account assignment error:', error);
      onClose();
    }
  };

  // Function to call the API to update user status
  const updateUserStatus = async (id, newStatus, onClose) => {
    try {
      await updateStatus({
        end_point: `users/status/${id}`,
        body: { status: newStatus }
      }).unwrap();
      toast.success(`User status updated to ${newStatus}`);
      refetch(); // Refresh the data
      onClose();
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update user status');
      console.error('Status update error:', error);
      onClose();
    }
  };


  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          Error loading user details. Please try again later.
        </div>
      </div>
    );
  }


  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <Link
            to="/clients"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
        </div>
      </div>

      {/* User Profile Header Card */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg mb-6 overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* User Avatar */}
          <div >
            {user?.data?.photo ? (
              <img src={`${import.meta.env.VITE_MEDIA_URL}${user?.data?.photo}`} alt={user?.data?.full_name} className="h-24 w-24 rounded-full object-cover" />
            ) : (
              <span className=" text-3xl font-bold text-indigo-600 h-24 w-24 rounded-full bg-white flex items-center justify-center shadow-md border-4 border-white">
                {user?.data?.full_name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          {/* User Basic Info */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{user?.data?.full_name}</h2>
            <p className="text-indigo-100">{user?.data?.email}</p>
            <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user?.data?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                user?.data?.status === 'FROZEN' ? 'bg-red-100 text-red-800' :
                  user?.data?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'}`}>
                {user?.data?.status || 'N/A'}
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                {user?.data?.role || 'N/A'}
              </span>

            </div>
          </div>

          {/* Balance Card */}
          <div className="ml-auto hidden md:flex space-x-4">
            {/* Status Badge with Change Button */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
              <div className="mr-3">
                <p className="text-xs font-medium text-indigo-100">Status</p>
                <div className="flex items-center mt-1">
                  {user?.data?.status === 'ACTIVE' && <CheckCircleIcon className="h-4 w-4 text-green-400 mr-1" />}
                  {user?.data?.status === 'FROZEN' && <XCircleIcon className="h-4 w-4 text-red-400 mr-1" />}
                  {user?.data?.status === 'PENDING' && <ClockIcon className="h-4 w-4 text-yellow-400 mr-1" />}
                  {user?.data?.status === 'SUSPENDED' && <ExclamationTriangleIcon className="h-4 w-4 text-purple-400 mr-1" />}
                  <span className="text-sm font-semibold text-white">{user?.data?.status}</span>
                </div>
              </div>
              <button
                onClick={handleStatusUpdate}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                title="Change Status"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>

            {/* Balance Card with Deposit Button */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-indigo-100">Balance</p>
                  <p className="text-2xl font-bold">${parseFloat(user?.data?.balance || 0).toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    confirmAlert({
                      title: 'Add Balance',
                      message: `Add funds to ${user?.data?.full_name}'s account:`,
                      customUI: ({ onClose }) => {
                        const handleSubmit = async (e) => {
                          e.preventDefault();

                          // Get form data
                          const formData = new FormData(e.target);
                          const amount = formData.get('amount');
                          const charge = formData.get('charge_amount') || '0';
                          const fee_type = formData.get('fee_type') || '';
                          const status = formData.get('status') || TRANSACTION_STATUS.PENDING;

                          // Validate form
                          if (!amount || parseFloat(amount) <= 0) {
                            toast.error('Please enter a valid amount');
                            return;
                          }

                          // Show confirmation dialog
                          confirmAlert({
                            title: 'Confirm Balance Addition',
                            message: `Are you sure you want to add $${parseFloat(amount).toFixed(2)} to ${user?.data?.full_name}'s account?`,
                            buttons: [
                              {
                                label: 'Yes, Add Balance',
                                onClick: async () => {
                                  // Show loading state
                                  const submitButton = e.target.querySelector('button[type="submit"]');
                                  submitButton.disabled = true;
                                  submitButton.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Pending...';


                                  try {
                                    // Prepare deposit data
                                    const depositData = {
                                      amount: parseFloat(amount),
                                      user_id: parseInt(id),
                                      charge_amount: parseFloat(charge) || 0,
                                      fee_type: fee_type,
                                      status: status,


                                    };

                                    // Call API to create deposit
                                    await postApi({
                                      end_point: 'deposits',
                                      body: depositData
                                    }).unwrap();

                                    toast.success('Balance added successfully');
                                    onClose();
                                    refetch(); // Refresh user data to show updated balance
                                  } catch (error) {
                                    toast.error(error?.data?.errors || 'Failed to add balance');
                                    console.error('Balance addition error:', error);
                                    // Reset loading state
                                    const submitButton = e.target.querySelector('button[type="submit"]');
                                    submitButton.disabled = false;
                                    submitButton.innerHTML = 'Add Balance';
                                  }
                                }
                              },
                              {
                                label: 'Cancel',
                                onClick: () => {
                                  // Do nothing, just close the confirmation dialog
                                }
                              }
                            ]
                          });
                        };

                        return (
                          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-between items-center">
                              <div className="flex items-center">
                                <CurrencyDollarIcon className="h-6 w-6 text-white mr-2" />
                                <div>
                                  <h3 className="text-lg font-medium text-white">Add Balance</h3>
                                  {depositFeeData?.data?.fee && (
                                    <span className="text-md text-indigo-100">Fee: {depositFeeData.data.fee}%</span>
                                  )}
                                </div>
                              </div>
                              <button
                                onClick={onClose}
                                className="text-white hover:text-gray-200"
                              >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6">
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                                <div className="p-2 border rounded-lg bg-gray-50">
                                  <div className="font-medium">{user?.data?.full_name}</div>
                                  <div className="text-sm text-gray-500">{user?.data?.email}</div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount
                                  <span className='text-red-500'> *</span>
                                </label>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">$</span>
                                  </div>
                                  <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    defaultValue=""
                                    className="w-full pl-7 p-2 border rounded-lg"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <label htmlFor="charge" className="block text-sm font-medium text-gray-700">Charge Amount</label>
                                  {depositFeeData?.data?.fee && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                      Fee: {depositFeeData.data.fee}%
                                    </span>
                                  )}
                                </div>
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">$</span>
                                  </div>
                                  <input
                                    type="number"
                                    id="charge"
                                    name="charge_amount"
                                    defaultValue="0"
                                    className="w-full pl-7 p-2 border rounded-lg"
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                  />
                                </div>
                              </div>

                              <div className="mb-4">
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                  id="status"
                                  name="status"
                                  defaultValue={TRANSACTION_STATUS.COMPLETED}
                                  className="w-full p-2 border rounded-lg"
                                >
                                  {Object.values(TRANSACTION_STATUS).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="mb-4">
                                <label htmlFor="fee_type" className="block text-sm font-medium text-gray-700 mb-1">Note <span className='text-red-500'> *</span></label>
                                <textarea
                                  id="fee_type"
                                  name="fee_type"
                                  defaultValue=""
                                  className="w-full p-2 border rounded-lg"
                                  placeholder="Add a fee type about this deposit"
                                  rows="3"
                                  required
                                />
                              </div>

                              <div className="flex justify-end space-x-2 pt-4">
                                <button
                                  type="button"
                                  onClick={onClose}
                                  className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                                  disabled={false}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                >
                                  Add Balance
                                </button>
                              </div>
                            </form>
                          </div>
                        );
                      }
                    });
                  }}
                  className="ml-4 p-1.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors duration-200 flex items-center justify-center"
                  title="Make Deposit"
                >
                  <PlusCircleIcon className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-t-xl shadow-md border border-gray-200 mb-0">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <IdentificationIcon className="h-5 w-5 mr-2" />
            Basic Information
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'bank' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <BanknotesIcon className="h-5 w-5 mr-2" />
            Bank Account
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`flex items-center px-6 py-4 text-sm font-medium transition-all duration-200 ${activeTab === 'verification' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <DocumentCheckIcon className="h-5 w-5 mr-2" />
            Verification
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-b-xl shadow-md border border-gray-200 border-t-0 mb-6">
        {/* Basic Information Tab Content */}
        {activeTab === 'basic' && (
          <div className="p-6">
            {/* Mobile Balance Card - Only visible on mobile */}
            {/* Mobile Status and Balance Cards - Only visible on mobile */}
            <div className="md:hidden space-y-4 mb-6">
              {/* Status Card */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-indigo-100">Status</p>
                    <div className="flex items-center mt-1">
                      {user?.data?.status === 'ACTIVE' && <CheckCircleIcon className="h-4 w-4 text-green-400 mr-1" />}
                      {user?.data?.status === 'FROZEN' && <XCircleIcon className="h-4 w-4 text-red-400 mr-1" />}
                      {user?.data?.status === 'PENDING' && <ClockIcon className="h-4 w-4 text-yellow-400 mr-1" />}
                      {user?.data?.status === 'SUSPENDED' && <ExclamationTriangleIcon className="h-4 w-4 text-purple-400 mr-1" />}
                      <span className="text-sm font-semibold text-white">{user?.data?.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleStatusUpdate}
                    className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
                    title="Change Status"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Balance Card with Deposit Button */}
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-indigo-100">Balance</p>
                    <p className="text-2xl font-bold">${parseFloat(user?.data?.balance || 0).toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => {
                      confirmAlert({
                        title: 'Add Balance',
                        message: `Add funds to ${user?.data?.full_name}'s account:`,
                        customUI: ({ onClose }) => {
                          // Handle deposit form submission

                          const handleSubmit = async (e) => {
                            e.preventDefault();

                            // Get form data
                            const formData = new FormData(e.target);
                            const amount = formData.get('amount');
                            const charge = formData.get('charge_amount') || '0';
                            const fee_type = formData.get('fee_type') || '';
                            const status = formData.get('status') || TRANSACTION_STATUS.PENDING;

                            // Validate form
                            if (!amount || parseFloat(amount) <= 0) {
                              toast.error('Please enter a valid amount');
                              return;
                            }

                            // Show confirmation dialog
                            confirmAlert({
                              title: 'Confirm Balance Addition',
                              message: `Are you sure you want to add $${parseFloat(amount).toFixed(2)} to ${user?.data?.full_name}'s account?`,
                              buttons: [
                                {
                                  label: 'Yes, Add Balance',
                                  onClick: async () => {
                                    // Show loading state
                                    const submitButton = e.target.querySelector('button[type="submit"]');
                                    submitButton.disabled = true;
                                    submitButton.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Pending...';

                                    try {
                                      // Prepare deposit data
                                      const depositData = {
                                        amount: parseFloat(amount),
                                        user_id: parseInt(id),
                                        charge_amount: parseFloat(charge) || 0,
                                        fee_type: fee_type,
                                        status: status,
                                      };

                                      // Call API to create deposit
                                      await postApi({
                                        end_point: 'deposits',
                                        body: depositData
                                      }).unwrap();

                                      toast.success('Balance added successfully');
                                      onClose();
                                      refetch(); // Refresh user data to show updated balance
                                    } catch (error) {
                                      toast.error(error?.data?.errors || 'Failed to add balance');
                                      console.error('Balance addition error:', error);
                                      // Reset loading state
                                      const submitButton = e.target.querySelector('button[type="submit"]');
                                      submitButton.disabled = false;
                                      submitButton.innerHTML = 'Add Balance';
                                    }
                                  }
                                },
                                {
                                  label: 'Cancel',
                                  onClick: () => {
                                    // Do nothing, just close the confirmation dialog
                                  }
                                }
                              ]
                            });
                          };

                          return (
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
                              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 flex justify-between items-center">
                                <div className="flex items-center">
                                  <CurrencyDollarIcon className="h-6 w-6 text-white mr-2" />
                                  <div>
                                    <h3 className="text-lg font-medium text-white">Add Balance</h3>
                                    {depositFeeData?.data?.fee && (
                                      <span className="text-xs text-indigo-100">Fee: {depositFeeData.data.fee}%</span>
                                    )}
                                  </div>
                                </div>
                                <button
                                  onClick={onClose}
                                  className="text-white hover:text-gray-200"
                                >
                                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>

                              <form onSubmit={handleSubmit} className="p-6">
                                <div className="mb-4">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                                  <div className="p-2 border rounded-lg bg-gray-50">
                                    <div className="font-medium">{user?.data?.full_name}</div>
                                    <div className="text-sm text-gray-500">{user?.data?.email}</div>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                      type="number"
                                      id="amount"
                                      name="amount"
                                      defaultValue=""
                                      className="w-full pl-7 p-2 border rounded-lg"
                                      placeholder="0.00"
                                      step="0.01"
                                      min="0.01"
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <div className="flex justify-between items-center mb-1">
                                    <label htmlFor="charge" className="block text-sm font-medium text-gray-700">Charge Amount</label>
                                    {depositFeeData?.data?.fee && (
                                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        Fee: {depositFeeData.data.fee}%
                                      </span>
                                    )}
                                  </div>
                                  <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                      <span className="text-gray-500">$</span>
                                    </div>
                                    <input
                                      type="number"
                                      id="charge"
                                      name="charge_amount"
                                      defaultValue="0"
                                      className="w-full pl-7 p-2 border rounded-lg"
                                      placeholder="0.00"
                                      step="0.01"
                                      min="0"
                                    />
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                  <select
                                    id="status"
                                    name="status"
                                    defaultValue={TRANSACTION_STATUS.COMPLETED}
                                    className="w-full p-2 border rounded-lg"
                                  >
                                    {Object.values(TRANSACTION_STATUS).map(s => (
                                      <option key={s} value={s}>{s}</option>
                                    ))}
                                  </select>
                                </div>

                                <div className="mb-4">
                                  <label htmlFor="fee_type" className="block text-sm font-medium text-gray-700 mb-1">Note (Optional)</label>
                                  <textarea
                                    id="fee_type"
                                    name="fee_type"
                                    defaultValue=""
                                    className="w-full p-2 border rounded-lg"
                                    placeholder="Add a fee_type about this deposit"
                                    rows="3"
                                  />
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                  <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
                                    disabled={false}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                  >
                                    Add Balance
                                  </button>
                                </div>
                              </form>
                            </div>
                          );
                        }
                      });
                    }}
                    className="ml-4 p-1.5 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors duration-200 flex items-center justify-center"
                    title="Add Balance"
                  >
                    <PlusCircleIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* User Details Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Personal Information</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Profile ID</span>
                    <span className="text-sm text-gray-900 font-mono bg-gray-100 px-2 py-0.5 rounded">{user?.data?.code || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Phone</span>
                    <span className="text-sm text-gray-900">{user?.data?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Date of Birth</span>
                    <span className="text-sm text-gray-900">
                      {user?.data?.dob ? new Date(user?.data?.dob).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Address</span>
                    <span className="text-sm text-gray-900">{user?.data?.address || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Country</span>
                    <span className="text-sm text-gray-900">{user?.data?.country?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Account Information Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700">Account Information</h3>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${user?.data?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        user?.data?.status === 'FROZEN' ? 'bg-red-100 text-red-800' :
                          user?.data?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            user?.data?.status === 'SUSPENDED' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {user?.data?.status || 'N/A'}
                      </span>
                      <button
                        onClick={handleStatusUpdate}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        title="Change Status"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Role</span>
                    <span className="text-sm text-gray-900">{user?.data?.role || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Registration Date</span>
                    <span className="text-sm text-gray-900">
                      {user?.data?.created_at ? new Date(user?.data?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-500">Last Updated</span>
                    <span className="text-sm text-gray-900">
                      {user?.data?.updated_at ? new Date(user?.data?.updated_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction History */}
            <div className="mt-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Transaction History</h3>
                  <div className="flex space-x-2">
                    <span className="text-xs text-gray-500">{transactions.length} transactions</span>
                  </div>
                </div>
                <div className="p-4">
                  {/* Search */}
                  <div className="mb-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search by Transaction ID or UID"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1); // Reset to first page when searching
                        }}
                      />
                    </div>
                  </div>
                  {isTransactionsLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : transactions.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">

                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</th>
                            <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {currentTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">{transaction.transaction_id}</td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                {new Date(transaction.created_at).toLocaleString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <span className={`inline-flex text-xs px-2 py-1 rounded-full ${transaction.transaction_type === 'DEPOSIT' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {transaction.transaction_type}
                                </span>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-900">
                                ${parseFloat(transaction.amount).toFixed(2)}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                {transaction.fee_type || '-'}
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                <span className={`inline-flex text-xs px-2 py-1 rounded-full ${transaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : transaction.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : transaction.status === 'FAILED' ? 'bg-red-100 text-red-800' : transaction.status === 'REFUND' ? 'bg-purple-100 text-purple-800' : transaction.status === 'IN_REVIEW' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {transaction.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                      <p className="mt-1 text-sm text-gray-500">This user has no transaction history yet.</p>
                    </div>
                  )}

                  {/* Pagination - Always visible */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          {transactions.length > 0 ? (
                            <>
                              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                              <span className="font-medium">
                                {indexOfLastItem > transactions.length ? transactions.length : indexOfLastItem}
                              </span>{' '}
                              of <span className="font-medium">{transactions.length}</span> results
                            </>
                          ) : (
                            <>No transactions found</>
                          )}
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1 || totalPages === 0}
                            className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${(currentPage === 1 || totalPages === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className="sr-only">Previous</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                            </svg>
                          </button>

                          {/* Page numbers */}
                          {totalPages > 0 ? (
                            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                                  ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                  }`}
                              >
                                {page}
                              </button>
                            ))
                          ) : (
                            <button
                              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-400 ring-1 ring-inset ring-gray-300 cursor-not-allowed"
                              disabled
                            >
                              1
                            </button>
                          )}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${(currentPage === totalPages || totalPages === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <span className="sr-only">Next</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bank Account Tab Content */}
        {activeTab === 'bank' && (
          <div className="p-6">
            {user?.data?.bankAccounts ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Bank Account Details</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${user?.data?.bankAccounts?.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user?.data?.bankAccounts?.is_open ? 'Active Account' : 'Closed Account'}
                    </span>
                    <button
                      onClick={() => handleAssignBankAccount()}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Change Account
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  {/* Bank Card */}
                  <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 mb-6 text-white shadow-md">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <p className="text-xs text-gray-400">Bank</p>
                        <p className="text-lg font-semibold">{user?.data?.bankAccounts?.bank?.name || 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Currency</p>
                        <p className="text-lg font-semibold">
                          {user?.data?.bankAccounts?.bank?.currency_id ? `${user?.data?.bankAccounts?.bank?.currency?.code || ''}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mb-6">
                      <p className="text-xs text-gray-400">Account Number</p>
                      <p className="text-lg font-mono tracking-wider">{user?.data?.bankAccounts?.account_number || 'N/A'}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400">Account Holder</p>
                        <p className="text-sm font-medium">{user?.data?.full_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Since</p>
                        <p className="text-sm">
                          {user?.data?.bankAccounts?.created_at ? new Date(user?.data?.bankAccounts?.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user?.data?.bankAccounts?.bank?.ach_routing_no && (
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">ACH Routing</span>
                        <span className="text-sm text-gray-900 font-mono">{user?.data?.bankAccounts?.bank?.ach_routing_no}</span>
                      </div>
                    )}
                    {user?.data?.bankAccounts?.bank?.wire_routing_no && (
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Wire Routing</span>
                        <span className="text-sm text-gray-900 font-mono">{user?.data?.bankAccounts?.bank?.wire_routing_no}</span>
                      </div>
                    )}
                    {user?.data?.bankAccounts?.bank?.sort_code && (
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Sort Code</span>
                        <span className="text-sm text-gray-900 font-mono">{user?.data?.bankAccounts?.bank?.sort_code}</span>
                      </div>
                    )}
                    {user?.data?.bankAccounts?.bank?.swift_code && (
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">SWIFT Code</span>
                        <span className="text-sm text-gray-900 font-mono">{user?.data?.bankAccounts?.bank?.swift_code}</span>
                      </div>
                    )}
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-500">Created At</span>
                      <span className="text-sm text-gray-900">
                        {user?.data?.bankAccounts?.created_at ? new Date(user?.data?.bankAccounts?.created_at).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-500">Last Updated</span>
                      <span className="text-sm text-gray-900">
                        {user?.data?.bankAccounts?.updated_at ? new Date(user?.data?.bankAccounts?.updated_at).toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-700">Bank Account Details</h3>
                  <button
                    onClick={() => handleAssignBankAccount()}
                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Assign Account
                  </button>
                </div>
                <div className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <BanknotesIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Bank Account Found</h3>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">
                    This user does not have any bank accounts associated with their profile yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Verification Tab Content */}
        {activeTab === 'verification' && (
          <div className="p-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Verification Information</h3>
              </div>
              <div className="p-4">
                {/* Verification Type and ID Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-500">Verification Type</span>
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                      {user?.data?.verification_type || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-500">ID/passport Number</span>
                    <span className="text-sm text-gray-900 font-mono">{user?.data?.id_number || 'N/A'}</span>
                  </div>
                </div>

                {/* Verification Images */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Verification Documents</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image 1 */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700">Front Side</h5>
                      </div>
                      <div className="p-4">
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_MEDIA_URL}${user?.data?.verification_image1}`}
                            alt="Verification Image 1"
                            className="w-full max-h-[400px] object-contain mx-auto"
                            onClick={(e) => {
                              // Create a modal to show the full-size image when clicked
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                              modal.onclick = () => document.body.removeChild(modal);

                              const img = document.createElement('img');
                              img.src = e.target.src;
                              img.className = 'max-w-full max-h-[90vh] object-contain';

                              modal.appendChild(img);
                              document.body.appendChild(modal);
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="mt-2 text-center text-xs text-gray-500">
                            Click on the image to view in full size
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image 2 */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700">Back Side</h5>
                      </div>
                      <div className="p-4">
                        <div className="rounded-lg overflow-hidden">
                          <img
                            src={`${import.meta.env.VITE_MEDIA_URL}${user?.data?.verification_image2}`}
                            alt="Verification Image 2"
                            className="w-full max-h-[400px] object-contain mx-auto"
                            onClick={(e) => {
                              // Create a modal to show the full-size image when clicked
                              const modal = document.createElement('div');
                              modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4';
                              modal.onclick = () => document.body.removeChild(modal);

                              const img = document.createElement('img');
                              img.src = e.target.src;
                              img.className = 'max-w-full max-h-[90vh] object-contain';

                              modal.appendChild(img);
                              document.body.appendChild(modal);
                            }}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="mt-2 text-center text-xs text-gray-500">
                            Click on the image to view in full size
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};



export default DetailClient;
