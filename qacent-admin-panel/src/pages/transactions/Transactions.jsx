import { useState } from 'react';
import { useGetApiQuery, useUpdateApiJsonMutation } from '../../store/api/commonSlice';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import TableSkeleton from '../../components/common/TableSkeleton';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BiUpArrow } from 'react-icons/bi';


const TRANSACTION_STATUS = {
  // PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUND: "REFUND",
  IN_REVIEW: "IN_REVIEW",
};

const TRANSACTION_TYPES = {
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
};

const FEE_TYPES = {
  WIRE: "WIRE",
  ACH: "ACH",
};



export default function Transactions() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [feeTypeFilter, setFeeTypeFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [updateTransactionStatus] = useUpdateApiJsonMutation();

  // Handle status update
  const handleStatusUpdate = (id, currentStatus, transactionId, transactionType) => {
    // Create dropdown menu for status selection
    confirmAlert({
      title: 'Change Transaction Status',
      message: `Select a new status for transaction "${transactionId}":`,
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Change Transaction Status</h2>
            <p className="mb-4">Select a new status for transaction &ldquo;{transactionId}&rdquo;:</p>
            <div className="mb-4">
              <select
                id="status-select"
                className="w-full p-2 border rounded-lg"
                defaultValue={currentStatus}
              >
                {Object.values(TRANSACTION_STATUS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newStatus = document.getElementById('status-select').value;
                  if (newStatus !== currentStatus) {
                    updateTransactionStatusFn(id, newStatus, transactionType, onClose);
                  } else {
                    onClose();
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        );
      }
    });
  };

  // Function to call the API to update transaction status
  const updateTransactionStatusFn = async (id, newStatus, transactionType, onClose) => {
    try {
      // Use different API endpoints based on transaction type
      let endpoint = '';

      if (transactionType === TRANSACTION_TYPES.DEPOSIT) {
        endpoint = `deposits/status/${id}`;
      } else if (transactionType === TRANSACTION_TYPES.WITHDRAW) {
        endpoint = `withdraws/status/${id}`;
      } else {
        // Fallback to generic endpoint if type is unknown
        endpoint = `transactions/status/${id}`;
      }

      await updateTransactionStatus({
        end_point: endpoint,
        body: { status: newStatus }
      }).unwrap();

      toast.success(`Transaction status updated to ${newStatus}`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update transaction status');
      console.error('Status update error:', error);
      onClose();
    }
  };

  // Build query string for API call
  const buildQueryString = () => {
    let queryString = `transactions?page=${page}`;

    if (search) queryString += `&search=${search}`;
    if (statusFilter) queryString += `&status=${statusFilter}`;
    if (typeFilter) queryString += `&transaction_type=${typeFilter}`;
    if (feeTypeFilter) queryString += `&fee_type=${feeTypeFilter}`;
    if (minAmount) queryString += `&minAmount=${minAmount}`;
    if (maxAmount) queryString += `&maxAmount=${maxAmount}`;
    if (startDate) queryString += `&startDate=${startDate}`;
    if (endDate) queryString += `&endDate=${endDate}`;

    return queryString;
  };

  // Fetch transactions data
  const { data: transactionsData, isLoading, isError } = useGetApiQuery({
    url: buildQueryString()
  });

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setTypeFilter('');
    setFeeTypeFilter('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  // Get status style for display
  const getStatusStyle = (status) => {
    switch (status) {
      case TRANSACTION_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TRANSACTION_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TRANSACTION_STATUS.FAILED:
        return 'bg-red-100 text-red-800';
      case TRANSACTION_STATUS.IN_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case TRANSACTION_STATUS.REFUND:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get transaction type style
  const getTypeStyle = (type) => {
    switch (type) {
      case TRANSACTION_TYPES.DEPOSIT:
        return 'bg-blue-100 text-blue-800';
      case TRANSACTION_TYPES.WITHDRAW:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link to="/" className="flex items-center hover:text-gray-700 transition">
            <HomeIcon className="h-4 w-4 mr-1" />
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Transactions</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction Management</h1>
        <p className="text-gray-600 mt-1">View and manage all transaction records</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID, UID or user..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Extended Filter Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status, Transaction Type, and Fee Type Filters */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter Options</label>
                  <div className="flex gap-2">
                    {/* Status Filter */}
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">Status</span>
                      </div>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 p-2 pl-16 border"
                      >
                        <option value="">All Status</option>
                        {Object.values(TRANSACTION_STATUS).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    {/* Transaction Type Filter */}
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">Type</span>
                      </div>
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 p-2 pl-12 border"
                      >
                        <option value="">All Types</option>
                        {Object.values(TRANSACTION_TYPES).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Fee Type Filter */}
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">Fee</span>
                      </div>
                      <select
                        value={feeTypeFilter}
                        onChange={(e) => setFeeTypeFilter(e.target.value)}
                        className="block w-full rounded-md border-gray-300 p-2 pl-11 border"
                      >
                        <option value="">All Fee Types</option>
                        {Object.values(FEE_TYPES).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Amount Range */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        className="block w-full rounded-md border-gray-300 p-2 border"
                        placeholder="Min Amount"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        className="block w-full rounded-md border-gray-300 p-2 border"
                        placeholder="Max Amount"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">From</span>
                      </div>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 p-2 pl-14 border"
                        placeholder="Start Date"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">To</span>
                      </div>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 p-2 pl-10 border"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={9} rows={5} />
              ) : isError ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-red-500">
                    Error loading transactions. Please try again later.
                  </td>
                </tr>
              ) : transactionsData?.data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactionsData?.data?.data?.map((transaction, index) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(transaction.created_at)}</div>
                      <div className="text-xs text-gray-500">Updated: {formatDate(transaction.updated_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.user?.full_name}</div>
                      <div className="text-xs text-gray-500">{transaction.user?.email}</div>
                    </td>



                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeStyle(transaction.transaction_type)}`}>
                        {transaction.transaction_type}
                      </span>
                      {/* <div className="text-xs text-gray-500 mt-1">{transaction.fee_type}</div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{transaction.transaction_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</div>
                      {/* <div className="text-xs text-gray-500">After Fee: {formatCurrency(transaction.after_fee_amount)}</div> */}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(transaction.fee_amount)}</div>
                      <div className="text-xs text-gray-500">Charge: {formatCurrency(transaction.charge_amount)}</div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/transactions/${transaction.id}`} className="text-black hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" title="View Details" />
                        </Link>

                        <button
                          onClick={() => handleStatusUpdate(transaction.id, transaction.status, transaction.transaction_id, transaction.transaction_type)}
                          title="Change Status"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <BiUpArrow className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !isError && transactionsData?.data && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              page={page}
              lastPage={transactionsData.data.last_page || 1}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
