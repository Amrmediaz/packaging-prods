import axios from 'axios';
import { STORAGE_KEYS, ROUTES, STATUS_CODES } from '../utils/constants';

const api = axios.create({
baseURL: 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // ✅ get token FROM localStorage using the constant as KEY
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ use STATUS_CODES constant
    if (error.response?.status === STATUS_CODES.UNAUTHORIZED) {
      // ✅ use STORAGE_KEYS constant
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      // ✅ use ROUTES constant
      window.location.href = ROUTES.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default api;