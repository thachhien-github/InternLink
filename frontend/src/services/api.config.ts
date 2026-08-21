import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_URL, API_TIMEOUT, TOKEN_STORAGE_KEY } from '../config/env';

function resolveEndpointUrl(endpoint: string): string {
  if (endpoint.startsWith('http')) return endpoint;
  const base = API_URL.replace(/\/+$/, '');
  const p = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!p.startsWith('/api/')) {
    return `${base}/api${p}`;
  }
  return `${base}${p}`;
}

const apiClient: AxiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add auth token to headers & resolve API URL
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.url) {
      config.url = resolveEndpointUrl(config.url);
    }
    return config;
  },
  (error) => {
    console.warn('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized (401)');
    } else if (error.response?.status === 403) {
      console.warn('Forbidden (403)');
    } else if (error.response?.status === 500) {
      console.warn('Server Error (500):', error.response.data);
    } else if (!error.response) {
      console.warn('Network Error / Backend unreachable:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
