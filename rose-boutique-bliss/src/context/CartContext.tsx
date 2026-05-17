import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getCart,
  addToCart,
  updateCartItem,
  clearCart,
  CartItem,
  Cart,
} from '@/services/cartService';

interface CartContextType {
  items:       CartItem[];
  itemCount:   number;
  totalPrice:  number;
  loading:     boolean;
  addItem:     (item: CartItem) => Promise<void>;
  updateItem:  (productId: string, quantity: number, size: string, color: string) => Promise<void>;
  emptyCart:   () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart,    setCart]    = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = () => !!localStorage.getItem('maleja_token');

  /* ── Carga el carrito desde el orders-service ── */
  const refreshCart = async () => {
    if (!isLoggedIn()) return;
    try {
      setLoading(true);
      const data = await getCart();
      setCart(data);
    } catch {
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  /* Carga al montar y cuando el usuario inicia sesión */
  useEffect(() => {
    refreshCart();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'maleja_token') refreshCart();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  /* ── Agregar ítem → POST /api/cart ── */
  const addItem = async (newItem: CartItem) => {
    if (!isLoggedIn()) throw new Error('no_auth');
    try {
      setLoading(true);
      const updated = await addToCart(newItem);
      setCart(updated);
    } finally {
      setLoading(false);
    }
  };

  /* ── Actualizar cantidad → PUT /api/cart/:productId ── */
  const updateItem = async (
    productId: string,
    quantity:  number,
    size:      string,
    color:     string
  ) => {
    try {
      setLoading(true);
      await updateCartItem(productId, quantity, size, color);
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  /* ── Vaciar carrito → DELETE /api/cart ── */
  const emptyCart = async () => {
    try {
      setLoading(true);
      await clearCart();
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const items      = cart?.items      ?? [];
  const totalPrice = cart?.totalPrice ?? items.reduce((s, i) => s + i.price * i.quantity, 0);
  const itemCount  = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, totalPrice, loading, addItem, updateItem, emptyCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};
