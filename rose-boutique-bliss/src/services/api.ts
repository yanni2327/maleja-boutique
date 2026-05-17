import axios from 'axios';

// Products Service — rutas sin cambio
export const productsApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Orders Service — ahora con nombre visible en Network
export const ordersApi = axios.create({
  baseURL: '/api/orders-service',
  headers: { 'Content-Type': 'application/json' },
});

ordersApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('maleja_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Payments Service — ahora con nombre visible en Network
export const paymentsApi = axios.create({
  baseURL: '/api/payments-service',
  headers: { 'Content-Type': 'application/json' },
});

paymentsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('maleja_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
