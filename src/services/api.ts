import axios from 'axios';
import { useAuth } from '../stores/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('auth');

    if (auth) {
      const { token } = JSON.parse(auth);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // contoh: token expired
      if (error.response.status === 401) {
        console.warn('Unauthorized – redirect to login');
         useAuth().logout()
      }
    }

    return Promise.reject(error);
  }
);



export default api;