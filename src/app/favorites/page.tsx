
"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import { useCart } from "@/hooks/use-cart";
import { Heart, Trash2, ShoppingCart } from "lucide-react";

export default function FavoritesPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-headline font-bold mb-8 text-center">Your Favorites</h1>
      {favorites.length === 0 ? (
        <Card className="text-center py-20">
          <CardContent className="flex flex-col items-center gap-4">
            <Heart className="w-16 h-16 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">You have no favorites yet.</h2>
            <p className="text-muted-foreground">Start browsing and add products you like!</p>
            <Button asChild>
              <Link href="/#products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {favorites.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center justify-between p-4">
              <div className="flex items-center gap-4 mb-4 sm:mb-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  width={100}
                  height={100}
                  className="rounded-md"
                  data-ai-hint={item.data_ai_hint}
                />
                <div>
                  <Link href={`/products/${item.id}`} className="hover:underline">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                  </Link>
                  <p className="text-primary font-semibold text-lg">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                 <Button 
                    variant="outline"
                    onClick={() => {
                        addToCart(item, 1);
                        removeFromFavorites(item.id);
                    }}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Move to Cart
                </Button>
                <Button variant="ghost" size="icon" onClick={() => removeFromFavorites(item.id)}>
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">Remove from favorites</span>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
