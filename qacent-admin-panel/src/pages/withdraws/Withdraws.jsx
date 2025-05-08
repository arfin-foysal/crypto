import { useState } from 'react';
import { useGetApiQuery, useUpdateApiJsonMutation } from '../../store/api/commonSlice';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Pagination from '../../components/common/Pagination';
import TableSkeleton from '../../components/common/TableSkeleton';
import toast from 'react-hot-toast';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { BiUpArrow } from 'react-icons/bi';

const WITHDRAWAL_STATUS = {
  // PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUND: 'REFUND',
  IN_REVIEW: 'IN_REVIEW',
};



export default function Withdraws() {

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [feeType, setFeeType] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [updateStatus] = useUpdateApiJsonMutation();

  // Handle withdrawal status update with dropdown
  const handleStatusUpdate = (id, currentStatus, withdrawalId) => {
    // Create dropdown menu for status selection
    confirmAlert({
      title: 'Change Withdrawal Status',
      message: `Select a new status for withdrawal #${withdrawalId}:`,
      customUI: ({ onClose }) => {
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto">
            <h2 className="text-xl font-bold mb-4">Change Withdrawal Status</h2>
            <p className="mb-4">Select a new status for withdrawal #{withdrawalId}:</p>
            <div className="mb-4">
              <select
                id="status-select"
                className="w-full p-2 border rounded-lg"
                defaultValue={currentStatus}
              >
                {Object.values(WITHDRAWAL_STATUS).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const newStatus = document.getElementById('status-select').value;
                  if (newStatus !== currentStatus) {
                    updateWithdrawalStatus(id, newStatus, onClose);
                  } else {
                    onClose();
                  }
                }}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        );
      }
    });
  };

  // Function to call the API to update withdrawal status
  const updateWithdrawalStatus = async (id, newStatus, onClose) => {
    try {
      await updateStatus({
        end_point: `withdraws/status/${id}`,
        body: { status: newStatus }
      }).unwrap();
      toast.success(`Withdrawal status updated to ${newStatus}`);
      onClose();
    } catch (error) {
      toast.error(error?.data?.errors || 'Failed to update withdrawal status');
      console.error('Status update error:', error);
      onClose();
    }
  };

  // Construct API URL with all filters
  const { data: withdrawsData, isLoading } = useGetApiQuery({
    url: `withdraws?page=${page}&perPage=${perPage}${search ? `&search=${search}` : ''}${statusFilter ? `&status=${statusFilter}` : 'PENDING'}${feeType ? `&fee_type=${feeType}` : ''}${minAmount ? `&minAmount=${minAmount}` : ''}${maxAmount ? `&maxAmount=${maxAmount}` : ''}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`
  });



  const handleClearFilters = () => {
    setStatusFilter('');
    setFeeType('');
    setSearch('');
    setMinAmount('');
    setMaxAmount('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case WITHDRAWAL_STATUS.COMPLETED:
        return 'bg-green-100 text-green-800';
      case WITHDRAWAL_STATUS.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case WITHDRAWAL_STATUS.FAILED:
        return 'bg-red-100 text-red-800';
      case WITHDRAWAL_STATUS.IN_REVIEW:
        return 'bg-blue-100 text-blue-800';
      case WITHDRAWAL_STATUS.REFUND:
        return 'bg-purple-100 text-purple-800';
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
          <span className="text-gray-700">Withdrawals</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Withdrawal Management</h1>
        <p className="text-gray-600 mt-1">Monitor and manage withdrawal requests</p>
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
                  placeholder="Search transaction ID..."
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
          </div>

          {/* Extended Filter Panel */}
          {filterOpen && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full rounded-md border-gray-300"
                  >
                    <option value="">All Status</option>
                    <option value={WITHDRAWAL_STATUS.PENDING}>Pending</option>
                    <option value={WITHDRAWAL_STATUS.COMPLETED}>Completed</option>
                    <option value={WITHDRAWAL_STATUS.FAILED}>Failed</option>
                    <option value={WITHDRAWAL_STATUS.CANCELLED}>Cancelled</option>
                    <option value={WITHDRAWAL_STATUS.REFUND}>Refund</option>
                    <option value={WITHDRAWAL_STATUS.IN_REVIEW}>In Review</option>
                    <option value={WITHDRAWAL_STATUS.REJECTED}>Rejected</option>
                    <option value={WITHDRAWAL_STATUS.APPROVED}>Approved</option>
                  </select>
                </div>

                {/* Fee Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type</label>
                  <select
                    value={feeType}
                    onChange={(e) => setFeeType(e.target.value)}
                    className="block w-full rounded-md border-gray-300"
                  >
                    <option value="">All Types</option>
                    <option value="WIRE">Wire</option>
                    <option value="CRYPTO">Crypto</option>
                  </select>
                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="block w-full rounded-md border-gray-300"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="block w-full rounded-md border-gray-300"
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="block w-full rounded-md border-gray-300"
                    />
                  </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DateTime</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeleton columns={8} rows={10} />
              ) : withdrawsData?.data?.data.map((withdraw, index) => (
                <tr key={withdraw.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(withdraw.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {withdraw.user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {withdraw.user.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex flex-col">
                      <span>{withdraw?.user?.bankAccounts?.account_number}</span>
                      <span className="text-xs text-gray-400">{withdraw?.user?.bankAccounts?.bank?.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${withdraw.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(withdraw.status)}`}>
                      {withdraw.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Link
                        to={`/withdraw/${withdraw.id}`}
                        className="text-black hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        onClick={() => handleStatusUpdate(withdraw.id, withdraw.status, withdraw.transaction_id || withdraw.id)}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md text-blue-600 hover:text-blue-900"
                        title="Change Status"
                      >
                                                  <BiUpArrow className="h-5 w-5" />

                      </Link>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {withdrawsData && (
          <Pagination
            currentPage={withdrawsData.currentPage}
            totalPages={withdrawsData.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}

