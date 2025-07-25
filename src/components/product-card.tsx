
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
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const router = useRouter();

  const isFavorite = favorites.some((fav) => fav.id === product.id);
  const isOutOfStock = product.stock === 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCartClick = () => {
    if (hasSizes) {
      router.push(`/products/${product.id}`);
    } else {
      addToCart(product);
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0 relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden relative">
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                 <Badge variant="destructive" className="text-lg">Sold Out</Badge>
              </div>
            )}
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
          className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full hover:bg-background/75 z-20"
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
          ₹{product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          onClick={handleAddToCartClick}
          className="w-full bg-primary hover:bg-primary/90"
          aria-label={`Add ${product.name} to cart`}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : (
            hasSizes ? (
                <>
                    Select Size <ArrowRight className="mr-2 h-4 w-4" />
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </>
            )
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
