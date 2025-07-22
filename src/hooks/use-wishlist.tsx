"use client";

import type { WishlistItem, Product } from '@/lib/types';
import React, { 
  createContext, 
  useContext, 
  useState, 
  useMemo, 
  useCallback, 
  type ReactNode 
} from 'react';
import { useToast } from "@/hooks/use-toast";

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.find((item) => item.id === product.id)) {
        return prevWishlist; // Already in wishlist
      }
      return [...prevWishlist, product];
    });
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been saved for later.`,
    });
  }, [toast]);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prevWishlist) => prevWishlist.filter((item) => item.id !== productId));
    toast({
      variant: "destructive",
      title: "Removed from wishlist",
      description: `Item has been removed from your wishlist.`,
    });
  }, [toast]);
  
  const isInWishlist = useCallback((productId: string) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);

  const value = useMemo(() => ({
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }), [wishlist, addToWishlist, removeFromWishlist, isInWishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
