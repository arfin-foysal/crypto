import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TableSkeleton from '../../components/common/TableSkeleton';
import Pagination from '../../components/common/Pagination';
import { useGetApiQuery, useDeleteApiMutation, useUpdateApiJsonMutation } from '../../store/api/commonSlice';

const COUNTRY_STATUS = {
  ACTIVE: "ACTIVE",
  FROZEN: "FROZEN"
};

export default function Countries() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteCountry] = useDeleteApiMutation();
  const [updateCountryStatus] = useUpdateApiJsonMutation();

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateCountryStatus({
        end_point: `countries/status/${id}`,
        body: { status: newStatus }
      }).unwrap();
      toast.success(`Country status updated to ${newStatus}`);
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update country status');
      console.error('Status update error:', error);
    }
  };

  // Handle country deletion
  const handleDelete = (id, name) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete country "${name}"?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteCountry({
                end_point: `countries/${id}`,
                body: {}
              }).unwrap();
              toast.success('Country deleted successfully');
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

  // Fetch countries data
  const { data: countriesData, isLoading, isError } = useGetApiQuery({
    url: `countries?page=${page}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`
  });

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = e.target.elements.search.value;
    setSearch(searchValue);
    setPage(1);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setPage(1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Get status style
  const getStatusStyle = (status) => {
    switch (status) {
      case COUNTRY_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800';
      case COUNTRY_STATUS.FROZEN:
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
          <Link to="/settings" className="flex items-center hover:text-gray-700 transition">
            Settings
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700">Countries</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
          <Link
            to="/countries/add"
            className="flex items-center px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Country
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                name="search"
                placeholder="Search countries..."
                className="w-full p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
          <div className="w-full md:w-64">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">All Statuses</option>
              <option value={COUNTRY_STATUS.ACTIVE}>Active</option>
              <option value={COUNTRY_STATUS.FROZEN}>Frozen</option>
            </select>
          </div>
        </div>
      </div>

      {/* Countries Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={6} rows={5} />
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-red-500">
                    Error loading countries. Please try again later.
                  </td>
                </tr>
              ) : countriesData?.data?.data?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No countries found.
                  </td>
                </tr>
              ) : (
                countriesData?.data?.data?.map((country, index) => (
                  <tr key={country.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(page - 1) * (countriesData?.data?.per_page || 10) + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {country.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {country.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {country.order_index}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(country.status)}`}
                      >
                        {country.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-3">
                        <Link to={`/countries/${country.id}`} className="text-blue-600 hover:text-blue-900">
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link to={`/countries/edit/${country.id}`} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(country.id, country.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        {country.status !== COUNTRY_STATUS.ACTIVE && (
                          <button
                            onClick={() => handleStatusUpdate(country.id, COUNTRY_STATUS.ACTIVE)}
                            className="text-green-600 hover:text-green-900"
                            title="Activate Country"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                          </button>
                        )}
                        {country.status !== COUNTRY_STATUS.FROZEN && (
                          <button
                            onClick={() => handleStatusUpdate(country.id, COUNTRY_STATUS.FROZEN)}
                            className="text-red-600 hover:text-red-900"
                            title="Freeze Country"
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
        {!isLoading && !isError && countriesData?.data?.last_page > 1 && (
          <div className="px-6 py-4 border-t">
            <Pagination
              currentPage={page}
              totalPages={countriesData?.data?.last_page || 1}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
