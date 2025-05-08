import { useState } from 'react';
import { useGetApiQuery, useUpdateApiJsonMutation, useDeleteApiMutation } from '../../store/api/commonSlice';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import TableSkeleton from '../../components/common/TableSkeleton';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const CURRENCY_STATUS = {
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN'
};

const statusMessages = {
  [CURRENCY_STATUS.ACTIVE]: 'activate',
  [CURRENCY_STATUS.FROZEN]: 'deactivate'
};

export default function Currencies() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [updateCurrencyStatus] = useUpdateApiJsonMutation();
  const [deleteCurrency] = useDeleteApiMutation();

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    confirmAlert({
      title: 'Confirm Status Change',
      message: `Are you sure you want to ${statusMessages[newStatus]} this currency?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await updateCurrencyStatus({
                end_point: `currencies/status/${id}`,
                body: { status: newStatus }
              }).unwrap();
              toast.success(`Currency ${newStatus === CURRENCY_STATUS.ACTIVE ? 'activated' : 'deactivated'} successfully`);
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to update currency status');
              console.error('Status update error:', error);
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

  // Handle currency deletion
  const handleDelete = (id, name) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete currency "${name}"?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteCurrency({
                end_point: `currencies/${id}`,
                body: {}
              }).unwrap();
              toast.success('Currency deleted successfully');
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

  // Fetch currencies data
  const { data: currenciesData, isLoading, isError } = useGetApiQuery({
    url: `currencies?page=${page}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`
  });

  // Clear all filters
  const handleClearFilters = () => {
    setStatusFilter('');
    setSearch('');
    setPage(1);
  };

  // Get status style for display
  const getStatusStyle = (status) => {
    switch (status) {
      case CURRENCY_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800';
      case CURRENCY_STATUS.FROZEN:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
          <span className="text-gray-700">Currencies</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Currency Management</h1>
        <p className="text-gray-600 mt-1">Manage and organize your cryptocurrency information</p>
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
                  placeholder="Search currency name..."
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

            {/* Add Currency Button */}
            <div>
              <Link
                to="/currencies/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Currency
              </Link>
            </div>
          </div>

          {/* Extended Filter Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300"
                  >
                    <option value="">All Status</option>
                    <option value={CURRENCY_STATUS.ACTIVE}>Active</option>
                    <option value={CURRENCY_STATUS.FROZEN}>Frozen</option>
                  </select>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">USD Rate</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={8} rows={5} />
              ) : isError ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                    Error loading currencies. Please try again later.
                  </td>
                </tr>
              ) : currenciesData?.data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No currencies found.
                  </td>
                </tr>
              ) : (
                currenciesData?.data?.data?.map((currency, index) => (
                  <tr key={currency.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(page - 1) * (currenciesData?.data?.per_page || 10) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currency.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currency.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${currency.usd_rate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {currency.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(currency.status)}`}
                      >
                        {currency.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(currency.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/currencies/${currency.id}`} className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link to={`/currencies/edit/${currency.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(currency.id, currency.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        {currency.status !== CURRENCY_STATUS.ACTIVE && (
                          <button
                            onClick={() => handleStatusUpdate(currency.id, CURRENCY_STATUS.ACTIVE)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate Currency"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {currency.status !== CURRENCY_STATUS.FROZEN && (
                          <button
                            onClick={() => handleStatusUpdate(currency.id, CURRENCY_STATUS.FROZEN)}
                            className="text-red-600 hover:text-red-900"
                            title="Freeze Currency"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !isError && currenciesData?.data && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              page={page}
              lastPage={currenciesData.data.last_page || 1}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
