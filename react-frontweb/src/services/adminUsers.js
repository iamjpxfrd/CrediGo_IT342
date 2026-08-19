// Dedicated admin user management API helpers
import apiClient from './api';

export const getAllUsers = () => apiClient.get('/api/admin/users');
export const createUser = (userData) => apiClient.post('/api/admin/users', userData);
export const updateUser = (userId, userData) => apiClient.put(`/api/admin/users/${userId}`, userData);
export const deleteUser = (userId) => apiClient.delete(`/api/admin/users/${userId}`);

// Optionally, fetch single user details
export const getUserById = (userId) => apiClient.get(`/api/admin/users/${userId}`);
