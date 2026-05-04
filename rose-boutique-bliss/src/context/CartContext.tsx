import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

export interface CartItem {
  productId: string;
  name:      string;
  price:     number;
  size:      string;
  color:     string;
  quantity:  number;
  image?:    string;
}

interface CartContextType {
  items:       CartItem[];
  itemCount:   number;
  totalPrice:  number;
  loading:     boolean;
  addItem:     (item: CartItem) => void;
  updateItem:  (productId: string, quantity: number, size: string, color: string) => void;
  emptyCart:   () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items,   setItems]   = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount  = items.reduce((sum, i) => sum + i.quantity, 0);

  const addItem = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.findIndex(
        i => i.productId === newItem.productId && i.size === newItem.size && i.color === newItem.color
      );
      if (existing > -1) {
        const updated = [...prev];
        updated[existing].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });
    toast.success(`¡${newItem.name} agregado al carrito! 🛍️`);
  };

  const updateItem = (productId: string, quantity: number, size: string, color: string) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(
        i => !(i.productId === productId && i.size === size && i.color === color)
      ));
    } else {
      setItems(prev => prev.map(i =>
        i.productId === productId && i.size === size && i.color === color
          ? { ...i, quantity }
          : i
      ));
    }
  };

  const emptyCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, itemCount, totalPrice, loading, addItem, updateItem, emptyCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};
