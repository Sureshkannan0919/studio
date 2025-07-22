
"use client";

import type { ReactNode } from 'react';
import { CartProvider } from '@/hooks/use-cart';
import { FavoritesProvider } from '@/hooks/use-favorites';
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FavoritesProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </FavoritesProvider>
  );
}
