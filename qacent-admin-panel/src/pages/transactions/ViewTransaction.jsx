import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetApiWithIdQuery, useUpdateApiJsonMutation } from '../../store/api/commonSlice';
import {
  HomeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


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



export default function ViewTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: transactionData, isLoading, isError } = useGetApiWithIdQuery([
    'transactions',
    id,
  ]);

  const [updateTransactionStatus] = useUpdateApiJsonMutation();

  // Handle status update
  const handleStatusUpdate = (currentStatus, transactionId) => {
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
                    updateTransactionStatusFn(newStatus, onClose);
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
  const updateTransactionStatusFn = async (newStatus, onClose) => {
    try {
      // Use different API endpoints based on transaction type
      let endpoint = '';

      if (transaction.transaction_type === TRANSACTION_TYPES.DEPOSIT) {
        endpoint = `deposits/status/${id}`;
      } else if (transaction.transaction_type === TRANSACTION_TYPES.WITHDRAW) {
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
      // Refresh the page after status update
      window.location.reload();
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update transaction status');
      console.error('Status update error:', error);
      onClose();
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case TRANSACTION_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800';
      case TRANSACTION_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case TRANSACTION_STATUS.FAILED:
        return 'bg-red-100 text-red-800';
      case TRANSACTION_STATUS.REFUND:
        return 'bg-purple-100 text-purple-800';
      case TRANSACTION_STATUS.IN_REVIEW:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading transaction data...</p>
        </div>
      </div>
    );
  }

  if (isError || !transactionData?.data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Error loading transaction data. Please try again later.</p>
        <button
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const transaction = transactionData.data;

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
          <Link to="/transactions" className="flex items-center hover:text-gray-700 transition">
            Transactions
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">View Transaction</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Transaction Details</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => handleStatusUpdate(transaction.status, transaction.transaction_id)}
              className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <span className="mr-2">Change Status</span>
              <PencilIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Transaction Information</h3>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusStyle(transaction.status)}`}>
                {transaction.status}
              </span>
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getTypeStyle(transaction.transaction_type)}`}>
                {transaction.transaction_type}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            {/* Basic Transaction Info */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</h4>
              <p className="mt-1 text-sm text-gray-900">{transaction.transaction_id}</p>
            </div>



            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">User</h4>
              <p className="mt-1 text-sm text-gray-900">{transaction.user?.full_name}</p>
              <p className="text-xs text-gray-500">{transaction.user?.email}</p>
              <p className="text-xs text-gray-500">Status: {transaction.user?.status}</p>
            </div>

            {/* Amount Information */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</h4>
              <p className="mt-1 text-sm font-medium text-gray-900">{formatCurrency(transaction.amount)}</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Amount</h4>
              <p className="mt-1 text-sm text-gray-900">{formatCurrency(transaction.fee_amount)}</p>
              <p className="text-xs text-gray-500">Type: {transaction.fee_type}</p>
            </div>



            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Charge Amount</h4>
              <p className="mt-1 text-sm text-gray-900">{formatCurrency(transaction.charge_amount)}</p>
            </div>



            {/* Currency Information */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">From Currency</h4>
              {transaction.from_currency ? (
                <>
                  <p className="mt-1 text-sm text-gray-900">{transaction.from_currency.name} ({transaction.from_currency.code})</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not specified</p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">To Currency</h4>
              {transaction.to_currency ? (
                <>
                  <p className="mt-1 text-sm text-gray-900">{transaction.to_currency.name} ({transaction.to_currency.code})</p>

                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not specified</p>
              )}
            </div>

            {/* Network Information */}
            {
              transaction.transaction_type === TRANSACTION_TYPES.WITHDRAW && (
                <>
                   <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">From Network</h4>
              {transaction.from_network ? (
                <>
                  <p className="mt-1 text-sm text-gray-900">{transaction.from_network.name} ({transaction.from_network.code})</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not specified</p>
              )}
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">To Network</h4>
              {transaction.to_network ? (
                <>
                  <p className="mt-1 text-sm text-gray-900">{transaction.to_network.name} ({transaction.to_network.code})</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not specified</p>
              )}
            </div>
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">User Network</h4>
              {transaction.to_network ? (
                <>
                  <p className="mt-1 text-sm text-gray-900">{transaction.user_network.name} ({transaction.user_network.code})</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Not specified</p>
              )}
            </div>
                </>
              )
            }
           

            {/* Dates */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</h4>
              <p className="mt-1 text-sm text-gray-900">{formatDate(transaction.created_at)}</p>
            </div>

            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</h4>
              <p className="mt-1 text-sm text-gray-900">{formatDate(transaction.updated_at)}</p>
            </div>

            {/* Note */}
            {/* <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Note</h4>
              <p className="mt-1 text-sm text-gray-900">{transaction.note || 'No notes available'}</p>
            </div> */}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/transactions')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Transactions
        </button>
      </div>
    </div>
  );
}
