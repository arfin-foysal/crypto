import { useParams } from 'react-router-dom';
import { useGetApiWithIdQuery } from '../../store/api/commonSlice';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const DetailUser = () => {
  const { id } = useParams();
  const { data: response, isLoading, isError } = useGetApiWithIdQuery(['users', id]);
  const user = response; // Access the data property from the response




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
            to="/users"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">User Details</h1>
        </div>
      </div>

      {/* User Information Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          {/* User Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
              {user?.data?.photo ? (
                <img src={user?.data?.photo} alt={user?.data?.full_name} className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <span className="text-2xl font-medium text-gray-600">
                  {user?.data?.full_name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.data?.full_name}</h2>
              <p className="text-sm text-gray-500">{user?.data?.email}</p>
            </div>
          </div>

          {/* user?.data? Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user?.data?.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    user?.data?.status === 'FROZEN' ? 'bg-red-100 text-red-800' :
                      user?.data?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                  }`}>
                  {user?.data?.status || 'N/A'}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Country</h3>
                <p className="mt-1 text-sm text-gray-900">{user?.data?.country?.name || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Balance</h3>
                <p className="mt-1 text-sm text-gray-900">${parseFloat(user?.data?.balance || 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Registration Date</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.data?.created_at ? new Date(user?.data?.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.data?.updated_at ? new Date(user?.data?.updated_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailUser;
