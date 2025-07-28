
"use client";

import type { Product } from '@/lib/types';
import React, { 
  createContext, 
  useContext, 
  useState, 
  useMemo, 
  useCallback, 
  type ReactNode 
} from 'react';
import { useToast } from "@/hooks/use-toast";

interface FavoritesContextType {
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const { toast } = useToast();

  const addToFavorites = useCallback((product: Product) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(p => p.id === product.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, product];
    });
    toast({
      variant: "success",
      title: "Added to favorites",
      description: `${product.name} has been added to your favorites.`,
    });
  }, [toast]);

  const removeFromFavorites = useCallback((productId: string) => {
    const favoriteToRemove = favorites.find(p => p.id === productId);
    setFavorites((prevFavorites) => prevFavorites.filter((item) => item.id !== productId));
    if (favoriteToRemove) {
      toast({
        variant: "destructive",
        title: "Removed from favorites",
        description: `${favoriteToRemove.name} has been removed from your favorites.`,
      });
    }
  }, [favorites, toast]);
  
  const isFavorite = useCallback((productId: string) => {
    return favorites.some(p => p.id === productId);
  }, [favorites]);

  const value = useMemo(() => ({
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }), [favorites, addToFavorites, removeFromFavorites, isFavorite]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
