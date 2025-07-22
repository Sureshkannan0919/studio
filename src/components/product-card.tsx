
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { ShoppingCart, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={600}
              height={600}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              data-ai-hint={product.data_ai_hint}
            />
          </div>
        </Link>
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/75"
          onClick={handleFavoriteClick}
        >
          <Heart className={cn("w-5 h-5", isFavorite ? "text-red-500 fill-current" : "text-foreground")} />
        </Button>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`}>
          <CardTitle className="font-headline text-lg mb-2 hover:text-primary transition-colors">
            {product.name}
          </CardTitle>
        </Link>
        <p className="font-bold text-primary text-xl">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={() => addToCart(product)}
          className="w-full bg-primary hover:bg-primary/90"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
