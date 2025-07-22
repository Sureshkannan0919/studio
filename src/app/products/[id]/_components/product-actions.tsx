"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart.tsx";
import { useWishlist } from "@/hooks/use-wishlist.tsx";
import type { Product } from "@/lib/types";
import { ShoppingCart, Heart } from "lucide-react";
import { cn } from '@/lib/utils';

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const handleToggleWishlist = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
                <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center"
                    aria-label="Quantity"
                />
                <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>+</Button>
            </div>
            <Button 
                size="lg" 
                className="flex-1 bg-primary hover:bg-primary/90" 
                onClick={() => addToCart(product, quantity)}
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
            <Button 
                variant="outline" 
                size="lg" 
                onClick={handleToggleWishlist}
            >
                <Heart className={cn("mr-2 h-5 w-5", isInWishlist(product.id) && "fill-accent text-accent")} />
                {isInWishlist(product.id) ? 'Saved' : 'Save'}
            </Button>
        </div>
    );
}
