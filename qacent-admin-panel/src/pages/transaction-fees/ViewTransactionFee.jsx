import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGetApiWithIdQuery, useDeleteApiMutation } from '../../store/api/commonSlice';
import { HomeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function ViewTransactionFee() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: feeData, isLoading, isError } = useGetApiWithIdQuery([
    'transaction-fees',
    id,
  ]);
  
  const [deleteFee] = useDeleteApiMutation();
  
  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete this transaction fee?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteFee({
                end_point: `transaction-fees/${id}`
              }).unwrap();
              toast.success('Transaction fee deleted successfully');
              navigate('/transaction-fees');
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to delete transaction fee');
              console.error('Delete error:', error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  };
  
  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Error loading transaction fee data. Please try again later.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/transaction-fees')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Transaction Fees
        </button>
      </div>
    );
  }
  
  const fee = feeData?.data;
  
  if (!fee) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Transaction fee not found.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate('/transaction-fees')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Transaction Fees
        </button>
      </div>
    );
  }
  
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
          <Link to="/transaction-fees" className="flex items-center hover:text-gray-700 transition">
            Transaction Fees
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">View Transaction Fee</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Transaction Fee Details</h1>
          <div className="flex space-x-2">
            <Link
              to={`/transaction-fees/edit/${id}`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Transaction Fee Information</h3>
        </div>
        
        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Type</h4>
            <p className="mt-1 text-sm text-gray-900">{fee.fee_type}</p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fee Amount</h4>
            <p className="mt-1 text-sm text-gray-900">{fee.fee}</p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</h4>
            <p className="mt-1 text-sm text-gray-900">{new Date(fee.created_at).toLocaleString()}</p>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</h4>
            <p className="mt-1 text-sm text-gray-900">{new Date(fee.updated_at).toLocaleString()}</p>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={() => navigate('/transaction-fees')}
            className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            Back to Transaction Fees
          </button>
        </div>
      </div>
    </div>
  );
}
