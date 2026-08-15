import axios from 'axios';

// Central Axios instance for all API calls.
// withCredentials: true is required so the browser sends the HTTP-only JWT
// cookie set by the backend on every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
