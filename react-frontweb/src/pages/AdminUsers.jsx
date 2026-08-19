import React, { useEffect, useState } from 'react';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/adminUsers';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formState, setFormState] = useState({ username: '', email: '', active: true, balance: 0 });

  // Fetch users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllUsers();
      if (!Array.isArray(res.data)) throw new Error('Invalid response from server. Expected user list.');
      setUsers(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // If you see "Unexpected token <" errors, it means the backend returned HTML, not JSON. Check backend status and endpoint URL.


  // CRUD Handlers
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormState({
      username: user.username || '',
      email: user.email || '',
      active: user.active !== undefined ? user.active : true,
      balance: user.balance || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user?')) return;
    setActionLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await deleteUser(userId);
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formState);
      } else {
        await createUser(formState);
      }
      setShowForm(false);
      setEditingUser(null);
      setFormState({ username: '', email: '', active: true, balance: 0 });
      await fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormState({ username: '', email: '', active: true, balance: 0 });
    setShowForm(true);
  };


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-[#232946]">User Management</h2>
      <button
        className="mb-4 bg-[#eebbc3] text-[#232946] font-medium px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        onClick={handleAddUser}
      >
        + Add User
      </button>
      {showForm && (
        <div className="mb-6 p-4 bg-[#f9f9f1] border border-gray-200 rounded-xl max-w-md">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-[#232946]">Username</label>
              <input
                className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]"
                value={formState.username}
                onChange={e => setFormState(f => ({ ...f, username: e.target.value }))}
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-[#232946]">Email</label>
              <input
                className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]"
                value={formState.email}
                onChange={e => setFormState(f => ({ ...f, email: e.target.value }))}
                required
                type="email"
              />
            </div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-[#232946]">Active Status</label>
              <select
                className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]"
                value={formState.active}
                onChange={e => setFormState(f => ({ ...f, active: e.target.value === 'true' }))}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm font-semibold text-[#232946]">Balance (₱)</label>
              <input
                className="w-full p-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#eebbc3]"
                value={formState.balance}
                onChange={e => setFormState(f => ({ ...f, balance: Number(e.target.value) }))}
                type="number"
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="bg-[#eebbc3] text-[#232946] font-medium px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                {editingUser ? 'Update' : 'Create'}
              </button>
              <button type="button" className="bg-gray-200 text-[#232946] px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">Username</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">Email</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">Balance (₱)</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50 ${user.active ? '' : 'bg-red-50'}`}>
                  <td className="py-3 px-4 border-b border-gray-100 text-gray-700">{user.id}</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-[#232946] font-medium">{user.username}</td>
                  <td className="py-3 px-4 border-b border-gray-100 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 border-b border-gray-100">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b border-gray-100 text-right text-gray-700">₱{!isNaN(Number(user.balance)) ? Number(user.balance).toFixed(2) : '0.00'}</td>
                  <td className="py-3 px-4 border-b border-gray-100 flex gap-1">
                    <button
                      className="bg-[#eebbc3] text-[#232946] px-2 py-1 rounded text-xs font-medium hover:bg-opacity-90 transition-colors"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 transition-colors"
                      onClick={() => handleDelete(user.id)}
                      disabled={actionLoading[user.id]}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
