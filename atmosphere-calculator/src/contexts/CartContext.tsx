import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartContextType {
  cartItems: number[];
  addToCart: (gasId: number) => void;
  removeFromCart: (gasId: number) => void;
  isInCart: (gasId: number) => boolean;
  getCartItemsCount: () => number;
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

  const addToCart = (gasId: number) => {
    setCartItems(prev => {
      if (!prev.includes(gasId)) {
        return [...prev, gasId];
      }
      return prev;
    });
  };

  const removeFromCart = (gasId: number) => {
    setCartItems(prev => prev.filter(id => id !== gasId));
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
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
