import axios from 'axios';

const paymentsApi = axios.create({
  baseURL: '/api/payments',
  headers: { 'Content-Type': 'application/json' },
});

paymentsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('maleja_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface CreatePaymentResponse {
  paymentId:     string;
  referenceCode: string;
  redirectUrl:   string;
  amountCOP:     number;
}

// Crear pago y obtener URL de Wompi
export const createPayment = async (data: {
  orderId:       string;
  total:         number;
  customerEmail: string;
  customerName:  string;
  customerPhone: string;
}): Promise<CreatePaymentResponse> => {
  const res = await paymentsApi.post('/create', data);
  return res.data;
};

// Consultar estado del pago
export const getPaymentStatus = async (referenceCode: string) => {
  const res = await paymentsApi.get(`/status/${referenceCode}`);
  return res.data;
};

// Mis pagos
export const getMyPayments = async () => {
  const res = await paymentsApi.get('/my-payments');
  return res.data;
};
