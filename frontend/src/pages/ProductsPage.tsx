import { useState } from 'react';
import { useGetProducts } from '../hooks/useQueries';
import { useProductFilters, FilterState } from '../hooks/useProductFilters';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SlidersHorizontal, X } from 'lucide-react';

const DEFAULT_FILTERS: FilterState = {
  category: '',
  minPrice: 0,
  maxPrice: 0,
  bestseller: false,
  sort: 'newest',
};

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProducts();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useProductFilters(products, filters);

  const categories = [...new Set(products.map(p => p.category))];

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);
  const hasActiveFilters = filters.category || filters.minPrice > 0 || filters.maxPrice > 0 || filters.bestseller;

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-cream-200 py-16 px-4 text-center border-b border-cream-300">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-3">Our Collection</p>
        <h1 className="font-serif text-5xl text-warm-brown">All Products</h1>
        <div className="w-16 h-px bg-warm-tan mx-auto mt-4" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 font-sans text-sm text-warm-brown border border-cream-300 px-4 py-2 rounded-full hover:bg-cream-200 transition-colors duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-warm-brown" />
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 font-sans text-xs text-warm-tan hover:text-warm-brown transition-colors"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            )}
            <span className="font-sans text-sm text-warm-tan">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <Select value={filters.sort} onValueChange={v => updateFilter('sort', v as FilterState['sort'])}>
            <SelectTrigger className="w-48 bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-cream-50 border border-cream-300 rounded-3xl p-6 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">Category</Label>
                <Select value={filters.category} onValueChange={v => updateFilter('category', v === 'all' ? '' : v)}>
                  <SelectTrigger className="bg-white border-cream-300 rounded-xl font-sans text-sm text-warm-brown">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">Min Price ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={filters.minPrice || ''}
                  onChange={e => updateFilter('minPrice', Number(e.target.value))}
                  placeholder="0"
                  className="bg-white border-cream-300 rounded-xl font-sans text-sm text-warm-brown"
                />
              </div>

              <div>
                <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">Max Price ($)</Label>
                <Input
                  type="number"
                  min={0}
                  value={filters.maxPrice || ''}
                  onChange={e => updateFilter('maxPrice', Number(e.target.value))}
                  placeholder="Any"
                  className="bg-white border-cream-300 rounded-xl font-sans text-sm text-warm-brown"
                />
              </div>

              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="bestseller-filter"
                  checked={filters.bestseller}
                  onCheckedChange={v => updateFilter('bestseller', v)}
                />
                <Label htmlFor="bestseller-filter" className="font-sans text-sm text-warm-brown cursor-pointer">
                  Bestsellers only
                </Label>
              </div>
            </div>
          </div>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden">
                <Skeleton className="aspect-square w-full" />
                <div className="p-5 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s`, animationFillMode: 'both' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-warm-tan mb-3">No products found</p>
            <p className="font-sans text-sm text-warm-tan/70">Try adjusting your filters</p>
            <button onClick={resetFilters} className="mt-4 font-sans text-sm text-warm-brown underline underline-offset-4">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
