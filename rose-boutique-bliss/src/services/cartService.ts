import { ordersApi } from './api';

export interface CartItem {
  productId: string;
  name:      string;
  price:     number;
  size:      string;
  color:     string;
  quantity:  number;
  image?:    string;
}

export interface Cart {
  _id:        string;
  userId:     string;
  items:      CartItem[];
  totalPrice: number;
}

// Obtener carrito del usuario
export const getCart = async (): Promise<Cart> => {
  const { data } = await ordersApi.get('/cart');
  return data;
};

// Agregar ítem al carrito
export const addToCart = async (item: CartItem): Promise<Cart> => {
  const { data } = await ordersApi.post('/cart', item);
  return data.cart;
};

// Actualizar cantidad de un ítem
export const updateCartItem = async (
  productId: string,
  quantity:  number,
  size:      string,
  color:     string
): Promise<Cart> => {
  const { data } = await ordersApi.put(`/cart/${productId}`, { quantity, size, color });
  return data.cart;
};

// Vaciar carrito
export const clearCart = async (): Promise<void> => {
  await ordersApi.delete('/cart');
};

// Crear pedido desde el carrito
export const createOrder = async (payload: {
  shippingAddress: {
    name:       string;
    street:     string;
    city:       string;
    department: string;
    phone:      string;
  };
  shippingCost?: number;
}) => {
  const { data } = await ordersApi.post('/orders', payload);
  return data.order;
};

// Mis pedidos
export const getMyOrders = async () => {
  const { data } = await ordersApi.get('/orders');
  return data;
};
