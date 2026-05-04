import axios from 'axios';

// Rutas relativas — el nginx del frontend hace el proxy al API Gateway
export const productsApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const ordersApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// JWT automático en cada petición del Orders Service
ordersApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('maleja_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
