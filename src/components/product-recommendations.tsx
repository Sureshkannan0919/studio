
"use client";

import { useEffect, useState } from 'react';
import { productRecommendations } from '@/ai/flows/product-recommendations';
import type { Product } from '@/lib/types';
import ProductCard from './product-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from './ui/skeleton';
import { useFavorites } from '@/hooks/use-favorites';

interface ProductRecommendationsProps {
  allProducts: Product[];
}

export default function ProductRecommendations({ allProducts }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { favorites } = useFavorites();

  useEffect(() => {
    async function getRecommendations() {
      if (allProducts.length === 0) {
        setLoading(false);
        return;
      };

      try {
        setLoading(true);

        const browsingHistory = favorites.length > 0
            ? `User has shown interest in the following products: ${favorites.map(f => f.name).join(', ')}.`
            : "User has not shown any specific interests yet.";

        const input = {
          browsingHistory,
          purchaseHistory: "User has not purchased anything yet.",
          currentDeals: "All decks have free grip tape included. Get 10% off on all apparel."
        };

        const result = await productRecommendations(input);
        
        const recommendedProducts = result.recommendations
          .map(recName => {
            // Find the product that is the closest match to the recommendation
            const lowerRecName = recName.toLowerCase();
            return allProducts.find(p => p.name.toLowerCase().includes(lowerRecName) || lowerRecName.includes(p.name.toLowerCase()));
          })
          .filter((p): p is Product => p !== undefined);
        
        // Remove duplicates and limit to a reasonable number
        const uniqueRecommendations = Array.from(new Map(recommendedProducts.map(p => [p.id, p])).values());

        setRecommendations(uniqueRecommendations.slice(0, 6));

      } catch (error) {
        console.error("Failed to get product recommendations:", error);
        // Silently fail, don't show an error to the user
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    }
    
    // Only run if there are products, to avoid running on initial empty state
    if (allProducts.length > 0) {
      getRecommendations();
    } else {
      setLoading(false);
    }

  }, [allProducts, favorites]);
  
  if (loading) {
    return (
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="font-headline">Just For You</CardTitle>
          <CardDescription>Our AI is finding products you might like...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 overflow-hidden">
            <div className="w-full md:w-1/2 lg:w-1/3 p-1">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
            </div>
             <div className="w-full md:w-1/2 lg:w-1/3 p-1 hidden md:block">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
            </div>
             <div className="w-full md:w-1/2 lg:w-1/3 p-1 hidden lg:block">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle className="font-headline">Just For You</CardTitle>
        <CardDescription>Based on your activity, we think you'll love these.</CardDescription>
      </CardHeader>
      <CardContent>
        <Carousel opts={{ align: "start", loop: recommendations.length > 2 }}>
          <CarouselContent className="-ml-4">
            {recommendations.map(product => (
              <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      </CardContent>
    </Card>
  );
}
