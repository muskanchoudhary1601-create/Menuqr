import axios from 'axios';

// Central Axios instance for all API calls.
// withCredentials: true is required so the browser sends the HTTP-only JWT
// cookie set by the backend on every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://menuqr-1-x4w7.onrender.com/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token from localStorage for reliable cross-domain requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('menuqr_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
