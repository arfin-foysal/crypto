import { useGetApiQuery } from '../../store/api/commonSlice';
import { Link } from 'react-router-dom';
import {
  AiOutlineUser,
  AiOutlineDollar,
  AiOutlineClockCircle,
  AiOutlineEye,
  AiOutlineBank,
  AiOutlineCheckCircle,
  AiOutlineWarning,
} from 'react-icons/ai';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar
} from 'recharts';

function Dashboard() {
  // Fetch dashboard data
  const { data: dashboardData, isLoading, isError } = useGetApiQuery({
    url: 'dashboard'
  });

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get status badge style
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'REFUND':
        return 'bg-purple-100 text-purple-800';
      case 'IN_REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Stats cards data
  const stats = dashboardData?.data ? [
    {
      title: 'Total Users',
      value: dashboardData.data.total_registered_users,
      icon: AiOutlineUser,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
    },
    {
      title: 'Active Users',
      value: dashboardData.data.total_active_users,
      icon: AiOutlineCheckCircle,
      bgColor: 'bg-green-50',
      textColor: 'text-green-500',
    },
    {
      title: 'Pending Users',
      value: dashboardData.data.total_pending_users,
      icon: AiOutlineClockCircle,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-500',
    },
    {
      title: 'Total Funds',
      value: formatCurrency(dashboardData.data.total_funds),
      icon: AiOutlineDollar,
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-500',
    },
    {
      title: 'Funds Received',
      value: formatCurrency(dashboardData.data.total_funds_received),
      icon: AiOutlineBank,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-500',
    },
    {
      title: 'Transactions Under Review',
      value: dashboardData.data.total_transactions_under_review,
      icon: AiOutlineWarning,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-500',
    },
  ] : [];

  // Latest withdrawal requests
  const latestWithdrawals = dashboardData?.data?.latest_withdraw_requests || [];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, Admin!</p>
      </div>

      {isLoading ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-gray-200 rounded-lg h-10 w-10"></div>
              </div>
              <div className="h-7 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        // Error state
        <div className="bg-red-50 p-4 rounded-lg mb-8">
          <p className="text-red-500">Error loading dashboard data. Please try again later.</p>
        </div>
      ) : (
        // Stats Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.title}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Grid */}
      {!isLoading && !isError && dashboardData?.data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Registration Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Registration Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.data.registration_chart_data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => formatDate(value)}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} users`, 'Registrations']}
                    labelFormatter={(value) => formatDate(value)}
                  />
                  <Legend />
                  <Bar dataKey="count" name="New Users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funds Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Total Funds</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={dashboardData.data.funds_chart_data}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => formatDate(value)}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${value}`}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Total Funds']}
                    labelFormatter={(value) => formatDate(value)}
                  />
                  <Area type="monotone" dataKey="amount" name="Funds" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Latest Withdrawal Requests */}
      {!isLoading && !isError && dashboardData?.data && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Latest Withdrawal Requests</h2>
            <Link to="/withdraws" className="text-sm text-blue-500 hover:text-blue-600 font-medium">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {latestWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {withdrawal.transaction_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {withdrawal.user.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {formatCurrency(withdrawal.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeStyle(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(withdrawal.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Link to={`/withdraw/${withdrawal.id}`} className="text-blue-500 hover:text-blue-700">
                        <AiOutlineEye className="h-5 w-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
