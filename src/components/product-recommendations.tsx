"use client";

import { useEffect, useState } from 'react';
import { productRecommendations } from '@/ai/flows/product-recommendations';
import type { Product } from '@/lib/types';
import { products as allProducts } from '@/lib/data';
import ProductCard from './product-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Skeleton } from './ui/skeleton';

export default function ProductRecommendations() {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRecommendations() {
      try {
        setLoading(true);
        const mockInput = {
          browsingHistory: "User has looked at modern tech gadgets, and smart home devices.",
          purchaseHistory: "User has previously bought a Smart Watch X1 and a Wireless Charger.",
          currentDeals: "Smart Speaker Mini are 20% off. All headphones have free shipping."
        };

        const result = await productRecommendations(mockInput);
        
        const recommendedProducts = result.recommendations
          .map(recName => {
            const lowerRecName = recName.toLowerCase();
            return allProducts.find(p => p.name.toLowerCase() === lowerRecName);
          })
          .filter((p): p is Product => p !== undefined);

        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error("Failed to get product recommendations:", error);
      } finally {
        setLoading(false);
      }
    }

    getRecommendations();
  }, []);
  
  if (loading) {
    return (
      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="font-headline">Just For You</CardTitle>
          <CardDescription>Our AI is finding products you might like...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1/3 space-y-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
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
