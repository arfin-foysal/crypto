import { useParams, useNavigate, Link } from 'react-router-dom';
import { HomeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { useGetApiWithIdQuery, useDeleteApiMutation } from '../../store/api/commonSlice';

export default function ViewCountry() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: countryData, isLoading, isError } = useGetApiWithIdQuery([
    'countries',
    id,
  ]);

  const [deleteCountry] = useDeleteApiMutation();

  const handleDelete = () => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete this country?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteCountry({
                end_point: `countries/${id}`
              }).unwrap();
              toast.success('Country deleted successfully');
              navigate('/countries');
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to delete country');
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
          <p className="text-gray-500">Loading country data...</p>
        </div>
      </div>
    );
  }

  if (isError || !countryData?.data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">Error loading country data. Please try again later.</p>
        <button
          onClick={() => navigate('/countries')}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Back to Countries
        </button>
      </div>
    );
  }

  const country = countryData.data;

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
          <Link to="/settings" className="flex items-center hover:text-gray-700 transition">
            Settings
          </Link>
          <span className="mx-2">/</span>
          <Link to="/countries" className="flex items-center hover:text-gray-700 transition">
            Countries
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">View Country</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Country Details</h1>
          <div className="flex space-x-2">
            <Link
              to={`/countries/edit/${id}`}
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

      {/* Country Details */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Country Information</h3>
            <span
              className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusStyle(country.status)}`}
            >
              {country.status}
            </span>
          </div>
        </div>
        <div className="px-6 py-5">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Country Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{country.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Country Code</dt>
              <dd className="mt-1 text-sm text-gray-900">{country.code}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Order</dt>
              <dd className="mt-1 text-sm text-gray-900">{country.order_index}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">{country.status}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(country.created_at).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Updated At</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(country.updated_at).toLocaleString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/countries')}
          className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
        >
          Back to Countries
        </button>
      </div>
    </div>
  );
}
