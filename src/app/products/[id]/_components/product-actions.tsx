
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import type { Product } from "@/lib/types";
import { ShoppingCart, Heart, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface ProductActionsProps {
    product: Product;
}

export default function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const { addToCart } = useCart();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
    const { toast } = useToast();

    const isFavorite = favorites.some((fav) => fav.id === product.id);
    const isOutOfStock = product.stock === 0;

    const handleFavoriteClick = () => {
        if (isFavorite) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const handleAddToCart = () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            toast({
                variant: 'destructive',
                title: 'Please select a size',
                description: 'You must choose a size before adding to the cart.',
                duration: 2000,
            });
            return;
        }
        addToCart({ ...product, size: selectedSize }, quantity);
    };

    return (
        <div className="flex flex-col gap-4">
            {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-4">
                    <Label className="text-lg font-semibold">Select Size</Label>
                    <RadioGroup 
                        value={selectedSize} 
                        onValueChange={setSelectedSize}
                        className="flex flex-wrap gap-2"
                    >
                       {product.sizes.map((size) => (
                           <div key={size}>
                                <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                                <Label 
                                    htmlFor={`size-${size}`}
                                    className={cn(
                                        "flex items-center justify-center rounded-md border-2 p-3 text-sm font-medium uppercase hover:bg-muted/50 cursor-pointer",
                                        selectedSize === size ? "bg-primary text-primary-foreground border-primary" : "bg-transparent"
                                    )}
                                >
                                    {size}
                                </Label>
                           </div>
                       ))}
                    </RadioGroup>
                </div>
            )}
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
                    onClick={handleAddToCart}
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
