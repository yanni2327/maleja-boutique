import { paymentsApi } from './api';

export interface CreatePaymentResponse {
  paymentId:     string;
  referenceCode: string;
  redirectUrl:   string;
  amountCOP:     number;
}

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

export const getPaymentStatus = async (referenceCode: string) => {
  const res = await paymentsApi.get(`/status/${referenceCode}`);
  return res.data;
};

export const getMyPayments = async () => {
  const res = await paymentsApi.get('/my-payments');
  return res.data;
};
