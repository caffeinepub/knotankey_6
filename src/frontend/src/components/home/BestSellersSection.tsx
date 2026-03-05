import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBestSellers } from "@/hooks/useQueries";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function BestSellersSection() {
  const navigate = useNavigate();
  const { data: products, isLoading, isError } = useGetBestSellers();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-2">
            Customer Favourites
          </p>
          <h2 className="text-4xl font-bold text-foreground font-serif mb-4">
            Best Sellers
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our most-loved handcrafted pieces, chosen by customers who
            appreciate the art of crochet.
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(["s0", "s1", "s2", "s3"] as const).map((k) => (
              <div key={k} className="space-y-3">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Unable to load best sellers. Please try again later.</p>
          </div>
        )}

        {!isLoading && !isError && products && products.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No best sellers available yet. Check back soon!</p>
          </div>
        )}

        {!isLoading && !isError && products && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: "/products" })}
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
          >
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
