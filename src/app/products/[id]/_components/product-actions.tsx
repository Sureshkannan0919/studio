
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart.tsx";
import type { Product } from "@/lib/types";
import { ShoppingCart } from "lucide-react";

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

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
        </div>
    );
}
