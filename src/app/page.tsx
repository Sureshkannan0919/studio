
"use client";

import { useState, useMemo } from 'react';
import { products as allProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product-card';
import ProductFilters from '@/components/product-filters';
import ProductRecommendations from '@/components/product-recommendations';

export default function Home() {
  const [filters, setFilters] = useState({ category: 'all', sort: 'name-asc' });

  const categories = useMemo(() => ['all', ...Array.from(new Set(allProducts.map(p => p.category)))], []);

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
  }, [filters]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-16 py-16">
        <section className="text-center">
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-4 animate-fade-in-down">
            Welcome to ShopWave
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover your next favorite thing. Quality products, unbeatable prices, and a seamless shopping experience await.
          </p>
        </section>

        <ProductRecommendations />
        
        <section id="products">
          <h2 className="text-3xl font-headline font-bold text-center mb-10">Our Products</h2>
          <ProductFilters filters={filters} setFilters={setFilters} categories={categories} />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 mt-8">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredAndSortedProducts.length === 0 && (
              <p className="col-span-full text-center text-muted-foreground">No products found matching your criteria.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
