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

const NETWORK_STATUS = {
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN'
};

const statusMessages = {
  [NETWORK_STATUS.ACTIVE]: 'activate',
  [NETWORK_STATUS.FROZEN]: 'deactivate'
};

export default function Networks() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [updateNetworkStatus] = useUpdateApiJsonMutation();
  const [deleteNetwork] = useDeleteApiMutation();

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    confirmAlert({
      title: 'Confirm Status Change',
      message: `Are you sure you want to ${statusMessages[newStatus]} this network?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await updateNetworkStatus({
                end_point: `networks/status/${id}`,
                body: { status: newStatus }
              }).unwrap();
              toast.success(`Network ${newStatus === NETWORK_STATUS.ACTIVE ? 'activated' : 'deactivated'} successfully`);
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to update network status');
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

  // Handle network deletion
  const handleDelete = (id, name) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete network "${name}"?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteNetwork({
                end_point: `networks/${id}`,
                body: {}
              }).unwrap();
              toast.success('Network deleted successfully');
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to delete network');
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

  // Fetch networks data
  const { data: networksData, isLoading, isError } = useGetApiQuery({
    url: `networks?page=${page}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`
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
      case NETWORK_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800';
      case NETWORK_STATUS.FROZEN:
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
          <span className="text-gray-700">Networks</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Network Management</h1>
        <p className="text-gray-600 mt-1">Manage and organize your blockchain networks</p>
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
                  placeholder="Search network name..."
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

            {/* Add Network Button */}
            <div>
              <Link
                to="/networks/add"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Network
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
                    <option value={NETWORK_STATUS.ACTIVE}>Active</option>
                    <option value={NETWORK_STATUS.FROZEN}>Frozen</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Extra Field</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={8} rows={5} />
              ) : isError ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                    Error loading networks. Please try again later.
                  </td>
                </tr>
              ) : networksData?.data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No networks found.
                  </td>
                </tr>
              ) : (
                networksData?.data?.data?.map((network, index) => (
                  <tr key={network.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(page - 1) * (networksData?.data?.per_page || 10) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {network.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {network.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {network.currency?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {network.order}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      {network.enable_extra_field ? 'Yes' : 'No'}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(network.status)}`}
                      >
                        {network.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/networks/${network.id}`} className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link to={`/networks/edit/${network.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(network.id, network.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        {network.status !== NETWORK_STATUS.ACTIVE && (
                          <button
                            onClick={() => handleStatusUpdate(network.id, NETWORK_STATUS.ACTIVE)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate Network"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {network.status !== NETWORK_STATUS.FROZEN && (
                          <button
                            onClick={() => handleStatusUpdate(network.id, NETWORK_STATUS.FROZEN)}
                            className="text-red-600 hover:text-red-900"
                            title="Freeze Network"
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
        {!isLoading && !isError && networksData?.data && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              page={page}
              lastPage={networksData.data.last_page || 1}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
