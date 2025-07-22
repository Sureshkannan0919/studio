
"use client";

import { useSearchParams } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/firebase/products';
import ProductCard from '@/components/product-card';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const searchResults = useMemo(() => {
    if (!query) return [];
    return allProducts.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allProducts]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-headline font-bold mb-2">Search Results</h1>
      {query ? (
        <p className="text-muted-foreground mb-8">
          Showing results for: <span className="font-semibold text-foreground">{query}</span>
        </p>
      ) : (
         <p className="text-muted-foreground mb-8">Please enter a search term.</p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {searchResults.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-20 mt-8">
          <CardContent className="flex flex-col items-center gap-4">
            <ShoppingBag className="w-16 h-16 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">No products found</h2>
            <p className="text-muted-foreground">Try a different search term or browse our categories.</p>
            <Button asChild>
              <Link href="/#products">Continue Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
