import axios from 'axios';

const normalizeBaseURL = (url) => {
  const value = (url || '').trim();
  return value.replace(/\/+$/, '');
};

const getBaseURL = () => {
  const configuredUrl = normalizeBaseURL(import.meta.env.VITE_API_URL);
  if (configuredUrl) return configuredUrl;

  if (import.meta.env.PROD) {
    console.error('[API] Missing VITE_API_URL in production build.');
    return '';
  }

  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor: add token and logging
API.interceptors.request.use((config) => {
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    throw new axios.AxiosError(
      'Missing VITE_API_URL. Configure the deployed frontend with your backend API URL.',
      'ERR_MISSING_API_URL',
      config
    );
  }

  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add request timestamp for debugging
  config.metadata = { startTime: Date.now() };
  return config;
}, (error) => {
  console.error('[API Request Error]', error.message);
  return Promise.reject(error);
});

// Response interceptor: handle errors and retries
API.interceptors.response.use(
  (response) => {
    // Log response time
    if (response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      if (duration > 10000) {
        console.warn(`[API] Slow response (${duration}ms):`, response.config.url);
      }
    }
    return response;
  },
  (error) => {
    // Handle 401 - Token expired or invalid
    if (error.response?.status === 401) {
      console.warn('[API] 401 - Unauthorized, clearing session');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
    
    // Handle 503 - Service Unavailable (DB connection issue)
    if (error.response?.status === 503) {
      console.error('[API] 503 - Service Unavailable:', error.response.data?.error);
      error.isServiceUnavailable = true;
      error.userMessage = error.response.data?.error || 'Service temporarily unavailable. Please try again.';
      return Promise.reject(error);
    }
    
    // Handle network errors and timeouts
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
      console.error('[API] Network/Timeout Error:', error.message);
      error.isNetworkError = true;
      error.userMessage = 'The server is waking up or temporarily unreachable. Retrying may help.';
      return Promise.reject(error);
    }

    // Handle 502/504 - Bad Gateway / Gateway Timeout
    if (error.response?.status === 502 || error.response?.status === 504) {
      console.error('[API] Gateway Error (502/504):', error.response.status);
      error.isGatewayError = true;
      error.userMessage = 'The server is temporarily unavailable. Please try again in a moment.';
      return Promise.reject(error);
    }

    console.error('[API Response Error]', {
      status: error.response?.status,
      message: error.message,
      url: error.config?.url
    });
    
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = 'Request failed. Please try again.') => {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.code === 'ERR_MISSING_API_URL') {
    return 'Frontend is missing the backend API URL. Set VITE_API_URL to your backend /api URL and redeploy.';
  }
  if (error?.userMessage) return error.userMessage;
  if (error?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (error?.message === 'Network Error') return 'Unable to reach the server. Please check your connection.';
  return error?.message || fallback;
};

export default API;
