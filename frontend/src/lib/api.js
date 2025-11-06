import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData).then(res => res.data),
  login: (credentials) => api.post('/auth/login', credentials).then(res => res.data),
};

export const postsAPI = {
  getAll: () => api.get('/posts').then(res => res.data),
  getById: (id) => api.get(`/posts/${id}`).then(res => res.data),
  create: (postData) => api.post('/posts', postData).then(res => res.data),
  update: (id, postData) => api.put(`/posts/${id}`, postData).then(res => res.data),
  delete: (id) => api.delete(`/posts/${id}`).then(res => res.data),
};

export const usersAPI = {
  getAll: () => api.get('/users').then(res => res.data),
  updateRole: (id, isAdmin) => api.patch(`/users/${id}/role`, { isAdmin }).then(res => res.data),
};
