import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  getCurrentUser: () => api.get('/api/auth/me'),
};

// Task API
export const taskAPI = {
  getAllTasks: () => api.get('/api/tasks'),
  getTask: (taskId) => api.get(`/api/tasks/${taskId}`),
  updateTaskStatus: (taskId, status) =>
    api.patch(`/api/tasks/${taskId}/status`, { status }),
};

// Novu API
export const novuAPI = {
  createSubscriber: () => api.post('/api/novu/subscriber'),
  getNotifications: () => api.get('/api/novu/notifications'),
  markAsRead: (messageId) =>
    api.post(`/api/novu/notifications/${messageId}/read`),
};

// Users API (Admin only)
export const usersAPI = {
  getAllUsers: () => api.get('/api/users'),
};

export default api;
