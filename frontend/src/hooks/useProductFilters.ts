import { useMemo } from 'react';
import type { Product } from '../backend';

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  bestseller: boolean;
  sort: 'newest' | 'price-asc' | 'price-desc';
}

export function useProductFilters(products: Product[], filters: FilterState): Product[] {
  return useMemo(() => {
    let result = [...products];

    if (filters.category) {
      result = result.filter(p => p.category.toLowerCase() === filters.category.toLowerCase());
    }

    if (filters.minPrice > 0) {
      result = result.filter(p => Number(p.price) / 100 >= filters.minPrice);
    }

    if (filters.maxPrice > 0) {
      result = result.filter(p => Number(p.price) / 100 <= filters.maxPrice);
    }

    if (filters.bestseller) {
      result = result.filter(p => p.bestseller);
    }

    switch (filters.sort) {
      case 'price-asc':
        result.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case 'price-desc':
        result.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case 'newest':
        result.sort((a, b) => Number(b.createdAt) - Number(a.createdAt));
        break;
    }

    return result;
  }, [products, filters]);
}
