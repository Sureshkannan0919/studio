"use client";

import Link from "next/link";
import { useWishlist } from "@/hooks/use-wishlist.tsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProductCard from "@/components/product-card";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useWishlist();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Your Wishlist</h1>
      {wishlist.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent className="flex flex-col items-center gap-4">
            <Heart className="w-16 h-16 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Your wishlist is empty</h2>
            <p className="text-muted-foreground">Explore our products and save your favorites here.</p>
            <Button asChild>
              <Link href="/">Discover Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {wishlist.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
