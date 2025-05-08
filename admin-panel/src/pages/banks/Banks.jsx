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

const BANK_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  FROZEN: 'FROZEN'
};

const statusMessages = {
  [BANK_STATUS.ACTIVE]: 'activate',
  [BANK_STATUS.FROZEN]: 'deactivate',
  [BANK_STATUS.PENDING]: 'mark as pending'
};

export default function Banks() {

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [updateStatus] = useUpdateApiJsonMutation();
  const [deleteBank] = useDeleteApiMutation();

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    confirmAlert({
      title: 'Confirm Status Change',
      message: `Are you sure you want to ${statusMessages[newStatus]} this bank?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await updateStatus({
                end_point: `banks/status/${id}`,
                body: { status: newStatus }
              }).unwrap();
              toast.success(`Bank successfully ${statusMessages[newStatus]}d`);
            } catch (error) {
              toast.error(`Failed to ${statusMessages[newStatus]} bank`);
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

  // Handle bank deletion
  const handleDelete = (id, name) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete bank "${name}"?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteBank({
                end_point: `banks/${id}`,
                body: {}
              }).unwrap();
              toast.success('Bank deleted successfully');
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to delete bank');
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

  // Fetch banks data
  const { data: banksData, isLoading, isError } = useGetApiQuery({
    url: `banks?page=${page}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`
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
      case BANK_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800';
      case BANK_STATUS.FROZEN:
        return 'bg-red-100 text-red-800';
      case BANK_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
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
          <span className="text-gray-700">Banks</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bank Management</h1>
        <p className="text-gray-600 mt-1">Manage and organize your banking information</p>
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
                  placeholder="Search bank name..."
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

              {/* Add Bank Button */}
              <div>
                <Link
                  to="/banks/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Bank
                </Link>
              </div>

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
                    <option value={BANK_STATUS.PENDING}>Pending</option>
                    <option value={BANK_STATUS.ACTIVE}>Active</option>
                    <option value={BANK_STATUS.FROZEN}>Frozen</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Currency</th>
                {/*  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Type</th>
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
                    Error loading banks. Please try again later.
                  </td>
                </tr>
              ) : banksData?.data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                    No banks found.
                  </td>
                </tr>
              ) : (
                banksData?.data?.data?.map((bank, index) => (
                  <tr key={bank.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bank.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.currency ? `${bank.currency.name} (${bank.currency.code})` : 'N/A'}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bank.description || 'N/A'}
                  </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {bank.account_type || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(bank.status)}`}>
                        {bank.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(bank.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/banks/${bank.id}`} className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link to={`/banks/edit/${bank.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(bank.id, bank.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        {bank.status !== BANK_STATUS.ACTIVE && (
                          <button
                            onClick={() => handleStatusUpdate(bank.id, BANK_STATUS.ACTIVE)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate Bank"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {bank.status !== BANK_STATUS.FROZEN && (
                          <button
                            onClick={() => handleStatusUpdate(bank.id, BANK_STATUS.FROZEN)}
                            className="text-red-600 hover:text-red-900"
                            title="Freeze Bank"
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
        {!isLoading && !isError && banksData?.data && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              page={page}
              lastPage={banksData.data.last_page || 1}
              setPage={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}

