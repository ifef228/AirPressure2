import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/index';
import { useAppSelector } from '../store/hooks';

interface CartContextType {
  cartItems: number[];
  addToCart: (gasId: number) => Promise<void>;
  removeFromCart: (gasId: number) => Promise<void>;
  isInCart: (gasId: number) => boolean;
  getCartItemsCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<number[]>([]);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    try {
      // Используем /cart/items для получения списка gasId в корзине
      const items = await api.cart.getCartItems();
      setCartItems(items || []);
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      // Если /cart/items не работает, пробуем через cart-icon и заявку
      try {
        const cartIcon = await api.cart.getCartIcon();
        if (cartIcon.orderId) {
          const order = await api.orders.getOrderById(cartIcon.orderId);
          const gasIds = order.gases?.map(g => g.gasId) || [];
          setCartItems(gasIds);
        } else {
          setCartItems([]);
        }
      } catch (fallbackError) {
        console.error('Ошибка при загрузке корзины через fallback:', fallbackError);
        setCartItems([]);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshCart();
    } else {
      setCartItems([]);
    }
  }, [isAuthenticated]);

  const addToCart = async (gasId: number) => {
    if (!isAuthenticated) {
      console.warn('Пользователь не авторизован');
      return;
    }
    try {
      await api.cart.addToCart(gasId);
      await refreshCart();
    } catch (error) {
      console.error('Ошибка при добавлении в корзину:', error);
      throw error;
    }
  };

  const removeFromCart = async (gasId: number) => {
    if (!isAuthenticated) {
      console.warn('Пользователь не авторизован');
      return;
    }
    try {
      await api.cart.removeFromCart(gasId);
      await refreshCart();
    } catch (error) {
      console.error('Ошибка при удалении из корзины:', error);
      throw error;
    }
  };

  const isInCart = (gasId: number) => {
    return cartItems.includes(gasId);
  };

  const getCartItemsCount = () => {
    return cartItems.length;
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    isInCart,
    getCartItemsCount,
    refreshCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
