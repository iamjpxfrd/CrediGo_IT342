import React, { useState, useEffect } from 'react';
import { FaUsers, FaBoxOpen, FaExchangeAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { getAdminDashboardStats } from '../services/api';

const STATUS_COLORS = {
  COMPLETED: '#16a34a',
  PENDING: '#ca8a04',
  PROCESSING: '#7c3aed',
  FAILED: '#dc2626',
  REFUNDED: '#2563eb',
};

const STATUS_LABELS = {
  COMPLETED: 'Completed',
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  FAILED: 'Failed',
  REFUNDED: 'Refunded',
};

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading dashboard data...</div>;
  }
  if (error) {
    return <div className="bg-red-100 p-4 rounded-lg text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<FaUsers className="text-[#6285cf]" size={24} />}
          change={5}
          iconBgColor="bg-blue-100"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={<FaUsers className="text-green-600" size={24} />}
          change={3}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<FaBoxOpen className="text-purple-600" size={24} />}
          change={12}
          iconBgColor="bg-purple-100"
        />
        <StatCard
          title="Transactions"
          value={stats.totalTransactions}
          icon={<FaExchangeAlt className="text-orange-600" size={24} />}
          change={8}
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Transaction status breakdown */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-[#232946] mb-4">Transaction Overview</h2>
        {Object.keys(stats.transactionsByStatus || {}).length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500 text-sm">
            No transactions yet
          </div>
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(stats.transactionsByStatus).map(([status, count]) => ({
                  status,
                  label: STATUS_LABELS[status] || status,
                  count,
                }))}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f9f9f1' }}
                  contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb', fontSize: 13 }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={56}>
                  {Object.keys(stats.transactionsByStatus).map((status) => (
                    <Cell key={status} fill={STATUS_COLORS[status] || '#9ca3af'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#232946]">Recent Transactions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions yet</td>
                </tr>
              ) : stats.recentTransactions.map((transaction) => (
                <tr key={transaction.transactionId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{transaction.transactionId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₱{transaction.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(transaction.transactionTimestamp).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={transaction.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <Link to="/admin/transactions" className="text-[#6285cf] hover:text-[#445ab1] font-medium">View All Transactions</Link>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
