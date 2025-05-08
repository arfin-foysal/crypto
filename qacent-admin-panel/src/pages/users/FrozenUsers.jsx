import { useState } from 'react';
import { useGetApiQuery, useUpdateApiJsonMutation } from '../../store/api/commonSlice';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  HomeIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import TableSkeleton from '../../components/common/TableSkeleton';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const USER_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN',
  SUSPENDED: 'SUSPENDED'
};

export default function FrozenUsers() {

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [minBalance, setMinBalance] = useState('');
  const [maxBalance, setMaxBalance] = useState('');

  const [updateStatus] = useUpdateApiJsonMutation();

  const handleStatusUpdate = async (id, newStatus) => {
    const statusMessages = {
      [USER_STATUS.ACTIVE]: 'activate',
      [USER_STATUS.FROZEN]: 'deactivate',
      [USER_STATUS.SUSPENDED]: 'suspend',
      [USER_STATUS.PENDING]: 'mark as pending'
    };

    confirmAlert({
      title: `Confirm Status Change`,
      message: `Are you sure you want to ${statusMessages[newStatus]} this user?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await updateStatus({
                end_point: `users/status/${id}`,
                body: { status: newStatus }
              }).unwrap();
              toast.success(`User successfully ${statusMessages[newStatus]}d`);
            } catch (error) {
              toast.error(`Failed to ${statusMessages[newStatus]} user`);
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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800';
      case USER_STATUS.FROZEN:
        return 'bg-gray-100 text-gray-800';
      case USER_STATUS.SUSPENDED:
        return 'bg-yellow-100 text-yellow-800';
      case USER_STATUS.PENDING:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Update the query to fetch FROZEN users
  const { data: users, isLoading, isError } = useGetApiQuery({
    url: `users?page=${page}&search=${search}&role=USER&status=FROZEN${minBalance ? `&minBalance=${minBalance}` : ''}${maxBalance ? `&maxBalance=${maxBalance}` : ''}`,
  });

  // Handle balance range changes
  const handleBalanceChange = (min, max) => {
    setMinBalance(min);
    setMaxBalance(max);
    setPage(1); // Reset to first page when filter changes
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setMinBalance('');
    setMaxBalance('');
    setPage(1);
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
          <span className="text-gray-700">FROZEN Users</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">FROZEN User Management</h1>
        <p className="text-gray-600 mt-1">Manage and review FROZEN user accounts</p>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search and Filter */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>

            {/* Actions */}
            {/* <div className="flex items-center gap-3">
            
              <Link
                to="/users/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add User
              </Link>
            </div> */}
          </div>

          {/* Filter Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Balance Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Balance Range
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="number"
                          placeholder="Min"
                          value={minBalance}
                          onChange={(e) => handleBalanceChange(e.target.value, maxBalance)}
                          className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                          type="number"
                          placeholder="Max"
                          value={maxBalance}
                          onChange={(e) => handleBalanceChange(minBalance, e.target.value)}
                          className="block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        />
                      </div>
                      <button
                        onClick={() => handleBalanceChange('', '')}
                        className="px-2 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Clear All Filters */}
                  <div className="flex items-end justify-end">
                    <button
                      onClick={handleClearFilters}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Tags */}
          {(search || minBalance || maxBalance) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {search && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Search: {search}
                  <button
                    onClick={() => setSearch('')}
                    className="ml-2 inline-flex text-blue-400 hover:text-blue-600"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              )}
              {(minBalance || maxBalance) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Balance: {minBalance || '0'} - {maxBalance || '∞'}
                  <button
                    onClick={() => handleBalanceChange('', '')}
                    className="ml-2 inline-flex text-blue-400 hover:text-blue-600"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table with Loader */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <TableSkeleton
              columns={6}
              rows={5}
              showActions={true}
              imageColumn={true}
            />
          ) : isError ? (
            <div className="p-6 text-center text-red-500">
              Error loading users. Please try again later.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>

                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users?.data?.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                          {user.photo ? (
                            <img src={user.photo} alt={user.full_name} className="h-8 w-8 rounded-full" />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {user.full_name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {user.country?.name || 'N/A'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        ${parseFloat(user.balance || 0).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                        {user.status || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        {user.status === USER_STATUS.FROZEN && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(user.id, USER_STATUS.ACTIVE)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                              title="Activate User"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Activate
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(user.id, USER_STATUS.SUSPENDED)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700"
                              title="Suspend User"
                            >
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                              Suspend
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && !isError && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination page={page} lastPage={users?.last_page || 1} setPage={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
