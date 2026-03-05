import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetProducts } from "@/hooks/useQueries";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProductsPage() {
  const { data: products, isLoading, isError } = useGetProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique categories dynamically from fetched products only — no preloading
  const categories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const catSet = new Set<string>();
    for (const p of products) {
      if (p.category?.trim()) {
        catSet.add(p.category.trim());
      }
    }
    return Array.from(catSet).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      // "All" means no category filter applied
      const matchesCategory =
        selectedCategory === "All" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();

      const priceInRupees = Number(product.price);
      const matchesMinPrice = !minPrice || priceInRupees >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || priceInRupees <= Number(maxPrice);

      return (
        matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
      );
    });
  }, [products, searchQuery, selectedCategory, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasActiveFilters =
    searchQuery || selectedCategory !== "All" || minPrice || maxPrice;

  // Count active non-search filters for badge
  const activeFilterCount = [
    selectedCategory !== "All",
    !!minPrice,
    !!maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <div className="bg-secondary/30 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-foreground font-serif mb-3">
            Our Collection
          </h1>
          <p className="text-muted-foreground font-sans max-w-xl mx-auto">
            Explore our handcrafted crochet pieces — each one made with love and
            care.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Bar — only search bar + Filters button visible here */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 font-sans"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 font-sans"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="default"
                className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {activeFilterCount}
              </Badge>
            )}
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="gap-2 font-sans"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Filters Panel — Category dropdown + Price Range, both inside this panel only */}
        {showFilters && (
          <div className="bg-card border border-border rounded-xl p-5 mb-6 space-y-5">
            {/* Category Filter — dropdown with dynamically generated options from products */}
            <div>
              <p className="text-sm font-semibold text-foreground font-sans mb-3">
                Category
              </p>
              {isLoading ? (
                <Skeleton className="h-10 w-48 rounded-md" />
              ) : (
                <Select
                  value={selectedCategory}
                  onValueChange={(val) => setSelectedCategory(val)}
                >
                  <SelectTrigger className="w-48 font-sans">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Price Range Filter */}
            <div>
              <p className="text-sm font-semibold text-foreground font-sans mb-3">
                Price Range (₹)
              </p>
              <div className="flex gap-3 items-center">
                <Input
                  type="number"
                  placeholder="Min (₹)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-32 font-sans"
                />
                <span className="text-muted-foreground font-sans">–</span>
                <Input
                  type="number"
                  placeholder="Max (₹)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-32 font-sans"
                />
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(["s0", "s1", "s2", "s3", "s4", "s5", "s6", "s7"] as const).map(
              (k) => (
                <div key={k} className="space-y-3">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ),
            )}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-sans">
              Unable to load products. Please try again later.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg font-sans mb-4">No products found.</p>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="font-sans"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <>
            <p className="text-sm font-sans text-muted-foreground mb-4">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
              {selectedCategory !== "All" && (
                <span className="ml-1">
                  in{" "}
                  <span className="font-medium text-foreground">
                    {selectedCategory}
                  </span>
                </span>
              )}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
