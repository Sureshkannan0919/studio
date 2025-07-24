
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import type { Product } from "@/lib/types";
import { ShoppingCart, Heart, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
    const isFavorite = favorites.some((fav) => fav.id === product.id);
    const isOutOfStock = product.stock === 0;

    const handleFavoriteClick = () => {
        if (isFavorite) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={isOutOfStock}>-</Button>
                    <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 text-center"
                        aria-label="Quantity"
                        disabled={isOutOfStock}
                    />
                    <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} disabled={isOutOfStock}>+</Button>
                </div>
                <Button 
                    size="lg" 
                    className="flex-1 bg-primary hover:bg-primary/90" 
                    onClick={() => addToCart(product, quantity)}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? <XCircle className="mr-2 h-5 w-5" /> : <ShoppingCart className="mr-2 h-5 w-5" />}
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </div>
             <Button 
                size="lg" 
                variant="outline"
                className="w-full"
                onClick={handleFavoriteClick}
            >
                <Heart className={cn("mr-2 h-5 w-5", isFavorite && "text-red-500 fill-current")} />
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
        </div>
    );
}
