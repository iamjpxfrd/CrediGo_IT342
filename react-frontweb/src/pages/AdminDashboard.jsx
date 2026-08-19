import { useEffect, useState } from 'react';
import { FaBoxOpen, FaChevronRight, FaExchangeAlt, FaIdCard, FaUsers, FaWallet } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAdminDashboardStats } from '../services/api';
import { getAllUsers } from '../services/adminUsers';
import { getKYCRequests } from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [walletTotal, setWalletTotal] = useState(0);
  const [pendingKyc, setPendingKyc] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, usersRes] = await Promise.all([
          getAdminDashboardStats(),
          getAllUsers(),
        ]);

        setStats(statsRes.data);

        const users = usersRes.data || [];
        setWalletTotal(users.reduce((sum, u) => sum + (Number(u.balance) || 0), 0));
        setRecentUsers(
          [...users]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
        );

        try {
          const kycRes = await getKYCRequests();
          setPendingKyc((kycRes.data || []).filter((k) => k.status === 'pending').length);
        } catch (kycErr) {
          console.error('Error fetching KYC requests:', kycErr);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard data:', err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading dashboard...</div>;
  }
  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>;
  }

  // Dashboard cards
  const dashboardCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <FaUsers size={24} />,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/users'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <FaUsers size={24} />,
      color: 'from-green-500 to-green-600',
      link: '/admin/users'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: <FaBoxOpen size={24} />,
      color: 'from-purple-500 to-purple-600',
      link: '/admin/products'
    },
    {
      title: 'Pending KYC',
      value: pendingKyc,
      icon: <FaIdCard size={24} />,
      color: 'from-yellow-500 to-yellow-600',
      link: '/admin/kyc'
    },
    {
      title: 'Wallet Balance',
      value: `₱${walletTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <FaWallet size={24} />,
      color: 'from-[#eebbc3] to-pink-500',
      link: '/admin/wallet'
    },
    {
      title: 'Transactions',
      value: stats.totalTransactions,
      icon: <FaExchangeAlt size={24} />,
      color: 'from-[#6285cf] to-indigo-600',
      link: '/admin/transactions'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section with couple theme */}
      <div className="bg-gradient-to-r from-[#232946] to-[#2e3a5c] rounded-xl p-6 md:p-8 shadow-lg border border-[#eebbc3]/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Welcome to Admin Dashboard</h1>
            <p className="text-[#eebbc3] mb-4">Manage your platform with love and care 💖</p>
          </div>
          <div className="flex space-x-2">
            <img
              src="https://ui-avatars.com/api/?name=Admin+User&background=eebbc3&color=232946"
              alt="Admin"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
            <img
              src="https://ui-avatars.com/api/?name=Admin+Wife&background=232946&color=eebbc3"
              alt="Admin Wife"
              className="w-10 h-10 rounded-full border-2 border-[#eebbc3] shadow-md -ml-4"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {dashboardCards.map((card, index) => (
          <Link key={index} to={card.link} className="block">
            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                    <h3 className="text-2xl font-bold text-[#232946] mt-1">{card.value}</h3>
                  </div>
                  <div className={`p-3 rounded-full bg-gradient-to-r ${card.color} text-white shadow-md`}>
                    {card.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-[#eebbc3]">
                  <span>View Details</span>
                  <FaChevronRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#232946]">Recent Users</h2>
              <Link to="/admin/users" className="text-sm text-[#eebbc3] hover:text-[#d39ba4] flex items-center">
                View All <FaChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No users yet</p>
            ) : (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=eebbc3&color=232946`}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-[#232946]">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-[#232946]">Recent Transactions</h2>
              <Link to="/admin/transactions" className="text-sm text-[#eebbc3] hover:text-[#d39ba4] flex items-center">
                View All <FaChevronRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">No transactions yet</td>
                  </tr>
                ) : stats.recentTransactions.map((tx) => (
                  <tr key={tx.transactionId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{tx.transactionId}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{tx.username}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">₱{tx.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {tx.status === 'COMPLETED' ? 'Completed' : tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Special Banner for Couple Theme */}
      <div className="bg-gradient-to-r from-[#eebbc3] to-[#d39ba4] p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold text-[#232946]">Built with love by us ❤️</h2>
            <p className="text-[#232946] opacity-80">Thank you for choosing CrediGo for your financial needs!</p>
          </div>
          <div>
            <button
              onClick={() => navigate('/about')}
              className="px-4 py-2 bg-[#232946] text-white rounded-lg shadow hover:bg-[#1a2035] transition-colors"
            >
              Learn About Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
