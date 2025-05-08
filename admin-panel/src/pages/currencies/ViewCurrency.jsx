import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetApiWithIdQuery, useDeleteApiMutation } from '../../store/api/commonSlice';
import { HomeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function ViewCurrency() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: currencyData, isLoading, isError } = useGetApiWithIdQuery([
    'currencies',
    id,
  ]);

  const [deleteCurrency] = useDeleteApiMutation();

  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete this currency?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteCurrency({
                end_point: `currencies/${id}`
              }).unwrap();
              toast.success('Currency deleted successfully');
              navigate('/currencies');
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to delete currency');
              console.error('Delete error:', error);
            }
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'FROZEN':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading currency data...</p>
        </div>
      </div>
    );
  }

  if (isError || !currencyData?.data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Error loading currency data. Please try again later.</p>
        <button
          onClick={() => navigate('/currencies')}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to Currencies
        </button>
      </div>
    );
  }

  const currency = currencyData.data;

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
          <Link to="/currencies" className="flex items-center hover:text-gray-700 transition">
            Currencies
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">View Currency</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Currency Details</h1>
          <div className="flex space-x-2">
            <Link
              to={`/currencies/edit/${id}`}
              className="flex items-center px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <TrashIcon className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Currency Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Currency Information</h3>
        </div>

        <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Currency Name</h4>
            <p className="mt-1 text-sm text-gray-900">{currency.name}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Currency Code</h4>
            <p className="mt-1 text-sm text-gray-900">{currency.code}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">USD Rate</h4>
            <p className="mt-1 text-sm text-gray-900">${currency.usd_rate}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Display Order</h4>
            <p className="mt-1 text-sm text-gray-900">{currency.order}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</h4>
            <p className="mt-1">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(currency.status)}`}>
                {currency.status}
              </span>
            </p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</h4>
            <p className="mt-1 text-sm text-gray-900">{new Date(currency.created_at).toLocaleString()}</p>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</h4>
            <p className="mt-1 text-sm text-gray-900">{new Date(currency.updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/currencies')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Currencies
        </button>
      </div>
    </div>
  );
}
