
"use client";

import type { CartItem, Product } from '@/lib/types';
import React, { 
  createContext, 
  useContext, 
  useState, 
  useMemo, 
  useCallback, 
  type ReactNode 
} from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product & { size?: string }, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((product: Product & { size?: string }, quantity = 1) => {
    setCart((prevCart) => {
      // Cart items need a unique ID that accounts for size.
      const cartItemId = product.size ? `${product.id}-${product.size}` : product.id;
      const existingItem = prevCart.find((item) => item.id === cartItemId);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Add the item, ensuring we store the original product ID separately.
      return [...prevCart, { ...product, id: cartItemId, productId: product.id, quantity }];
    });
    toast({
      variant: "success",
      title: "Added to cart",
      description: `${product.name} ${product.size ? `(Size: ${product.size})` : ''} has been added to your cart.`,
    });
  }, [toast]);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    toast({
      variant: "destructive",
      title: "Removed from cart",
      description: `Item has been removed from your cart.`,
    });
  }, [toast]);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
    }
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const totalPrice = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
