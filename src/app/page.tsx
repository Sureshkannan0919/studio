
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import ProductFilters from '@/components/product-filters';
import ProductRecommendations from '@/components/product-recommendations';
import { getProducts } from '@/lib/firebase/products';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'all', sort: 'name-asc' });

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const products = await getProducts();
      setAllProducts(products);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    if (loading || allProducts.length === 0) return ['all'];
    return ['all', ...Array.from(new Set(allProducts.map(p => p.category)))]
  }, [allProducts, loading]);

  const filteredAndSortedProducts = useMemo(() => {
    let result: Product[] = [...allProducts];

    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [filters, allProducts]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-16 py-16">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4 animate-fade-in-down">
            Welcome to SK Skates
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your one-stop shop for all things skates. RIDE ON.
          </p>
        </section>

        <ProductRecommendations allProducts={allProducts} />
        
        <section id="products">
          <h2 className="text-3xl font-headline font-bold text-center mb-10">Our Products</h2>
          <ProductFilters filters={filters} setFilters={setFilters} categories={categories} />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
            {loading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))
            ) : filteredAndSortedProducts.length > 0 ? (
               filteredAndSortedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">No products found matching your criteria.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
