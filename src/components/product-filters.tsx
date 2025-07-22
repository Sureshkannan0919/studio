"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ProductFiltersProps {
  filters: { category: string; sort: string };
  setFilters: (filters: { category: string; sort: string }) => void;
  categories: string[];
}

export default function ProductFilters({
  filters,
  setFilters,
  categories,
}: ProductFiltersProps) {
  const handleCategoryChange = (value: string) => {
    setFilters({ ...filters, category: value });
  };

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sort: value });
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm border flex flex-col md:flex-row gap-4 items-center">
      <div className="grid gap-2 w-full md:w-auto">
        <Label htmlFor="category-select" className="font-semibold">Category</Label>
        <Select value={filters.category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category-select" className="w-full md:w-[180px]">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 w-full md:w-auto">
        <Label htmlFor="sort-select" className="font-semibold">Sort by</Label>
        <Select value={filters.sort} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-select" className="w-full md:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
            <SelectItem value="name-desc">Name: Z to A</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
