'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Photocard, Print } from '@/types/menu';

type CartItem = Photocard | Print;

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
  isInCart: (itemId: number) => boolean;
  getCartQuantity: (itemId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('CartContext: Initializing cart context');
    const savedCart = localStorage.getItem('cart');
    console.log('CartContext: Loading cart from localStorage:', savedCart);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('CartContext: Parsed cart:', parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsInitialized(true);
    console.log('CartContext: Cart context initialized');
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    console.log('CartContext: Saving cart to localStorage:', cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    console.log('CartContext: Adding item to cart:', item);
    // Check if item is in stock
    if (item.quantity <= 0) {
      alert('This item is out of stock');
      return;
    }

    setCart(prev => {
      console.log('CartContext: Current cart before adding:', prev);
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Check if adding one more would exceed available quantity
        const currentQuantity = prev.filter(cartItem => cartItem.id === item.id).length;
        if (currentQuantity >= item.quantity) {
          alert(`Only ${item.quantity} available in stock`);
          return prev;
        }
        const newCart = [...prev, item];
        console.log('CartContext: New cart after adding (existing item):', newCart);
        return newCart;
      } else {
        const newCart = [...prev, item];
        console.log('CartContext: New cart after adding (new item):', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => {
      const itemIndex = prev.findIndex(item => item.id === itemId);
      if (itemIndex !== -1) {
        const newCart = [...prev];
        newCart.splice(itemIndex, 1);
        return newCart;
      }
      return prev;
    });
  };

  const clearCart = () => {
    console.log('CartContext: Clearing cart');
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getCartCount = () => {
    console.log('CartContext: Getting cart count:', cart.length);
    return cart.length;
  };

  const isInCart = (itemId: number) => {
    return cart.some(item => item.id === itemId);
  };

  const getCartQuantity = (itemId: number) => {
    return cart.filter(item => item.id === itemId).length;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      clearCart,
      getTotalPrice,
      getCartCount,
      isInCart,
      getCartQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
