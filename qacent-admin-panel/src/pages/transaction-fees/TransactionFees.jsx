import { useState } from 'react';
import { useGetApiQuery, useDeleteApiMutation } from '../../store/api/commonSlice';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import TableSkeleton from '../../components/common/TableSkeleton';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export default function TransactionFees() {
  const [page, setPage] = useState(1);
  const [deleteTransactionFee] = useDeleteApiMutation();

  // Fetch transaction fees data
  const { data: feesData, isLoading, isError } = useGetApiQuery({
    url: `transaction-fees?page=${page}`
  });
  console.log(feesData)

  // Handle transaction fee deletion
  const handleDelete = (id, feeType) => {
    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the ${feeType} transaction fee?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await deleteTransactionFee({
                end_point: `transaction-fees/${id}`,
                body: {}
              }).unwrap();
              toast.success('Transaction fee deleted successfully');
            } catch (error) {
              toast.error(error?.data?.errors || 'Failed to delete transaction fee');
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
          <span className="text-gray-700">Transaction Fees</span>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transaction Fees</h1>
            <p className="text-gray-600 mt-1">Manage transaction fees for deposits and withdrawals</p>
          </div>
          <Link
            to="/transaction-fees/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Transaction Fee
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee %</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={5} rows={5} />
              ) : isError ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-red-500">
                    Error loading transaction fees. Please try again later.
                  </td>
                </tr>
              ) : feesData?.data?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No transaction fees found.
                  </td>
                </tr>
              ) : (
                feesData?.data?.map((fee, index) => (
                  <tr key={fee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{fee.fee_type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {fee.fee}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(fee.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <Link
                          to={`/transaction-fees/${fee.id}`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </Link>
                        <Link
                          to={`/transaction-fees/edit/${fee.id}`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(fee.id, fee.fee_type)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {feesData?.data?.meta && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={page}
              totalPages={feesData.data.meta.last_page}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
