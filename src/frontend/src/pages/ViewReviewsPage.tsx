import type { Review } from "@/backend";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetApprovedReviews, useGetProducts } from "@/hooks/useQueries";
import { useSEO } from "@/hooks/useSEO";
import { Link, useNavigate } from "@tanstack/react-router";
import { PenLine, Star } from "lucide-react";
import { useState } from "react";

const formatDate = (nanoseconds: bigint) =>
  new Date(Number(nanoseconds / BigInt(1_000_000))).toLocaleDateString(
    "en-IN",
    { year: "numeric", month: "long", day: "numeric" },
  );

const hasImage = (review: Review) => {
  try {
    return review.image.getDirectURL().length > 0;
  } catch {
    return false;
  }
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${
            s <= rating
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const ratingNum = Number(review.rating);
  const imageExists = hasImage(review);
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-soft flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <p className="font-semibold text-foreground">{review.name}</p>
          <Link
            to="/products/$id"
            params={{ id: review.productId }}
            className="text-sm text-primary hover:underline"
          >
            {review.productName}
          </Link>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarDisplay rating={ratingNum} />
          <span className="text-xs text-muted-foreground">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {review.message}
      </p>
      {imageExists && (
        <img
          src={review.image.getDirectURL()}
          alt={`Review by ${review.name}`}
          loading="lazy"
          className="w-full max-h-48 object-cover rounded-xl border border-border"
        />
      )}
    </div>
  );
}

const PAGE_SIZE = 10;

export default function ViewReviewsPage() {
  useSEO({
    title: "Customer Reviews",
    description:
      "See what customers are saying about Knotankey handcrafted crochet products.",
    url: "/reviews",
  });

  const navigate = useNavigate();
  const { data: reviews, isLoading } = useGetApprovedReviews();
  const { data: products } = useGetProducts();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Derive unique categories from products
  const categories = products
    ? [...new Set(products.map((p) => p.category).filter(Boolean))].sort()
    : [];

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "all"
      ? (products ?? [])
      : (products ?? []).filter(
          (p) => p.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  // Filter reviews
  const filteredReviews = (reviews ?? []).filter((r) => {
    if (selectedCategory !== "all") {
      const categoryMatch =
        r.category.toLowerCase() === selectedCategory.toLowerCase();
      if (!categoryMatch) return false;
    }
    if (selectedProduct !== "all" && r.productId !== selectedProduct) {
      return false;
    }
    return true;
  });

  // Compute average rating
  const approvedReviews = reviews ?? [];
  const avgRating =
    approvedReviews.length > 0
      ? (
          approvedReviews.reduce((sum, r) => sum + Number(r.rating), 0) /
          approvedReviews.length
        ).toFixed(1)
      : null;

  const visibleReviews = filteredReviews.slice(0, visibleCount);
  const hasMore = filteredReviews.length > visibleCount;

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setSelectedProduct("all");
    setVisibleCount(PAGE_SIZE);
  };

  const handleProductChange = (val: string) => {
    setSelectedProduct(val);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold font-serif text-foreground mb-3">
            Loved by Handmade Lovers 🧶✨
          </h1>
          <p className="text-muted-foreground mb-4">
            Real reviews from real customers
          </p>
          {avgRating && (
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {avgRating}/5 from {approvedReviews.length} review
              {approvedReviews.length !== 1 ? "s" : ""}
            </div>
          )}
          <div className="flex justify-center">
            <Button
              onClick={() => navigate({ to: "/reviews/submit" })}
              className="gap-2"
              data-ocid="reviews.primary_button"
            >
              <PenLine className="w-4 h-4" />
              Write a Review
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-8"
          data-ocid="reviews.panel"
        >
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger
              className="w-full sm:w-52"
              data-ocid="reviews.select"
            >
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedProduct} onValueChange={handleProductChange}>
            <SelectTrigger
              className="w-full sm:w-60"
              data-ocid="reviews.select"
            >
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {filteredProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Reviews */}
        {isLoading && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="reviews.loading_state"
          >
            {["s0", "s1", "s2", "s3"].map((k) => (
              <Skeleton key={k} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {!isLoading && filteredReviews.length === 0 && (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="reviews.empty_state"
          >
            <p className="text-lg mb-2">No reviews yet.</p>
            <p className="text-sm">Be the first to share your experience!</p>
          </div>
        )}

        {!isLoading && visibleReviews.length > 0 && (
          <>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              data-ocid="reviews.list"
            >
              {visibleReviews.map((review, idx) => (
                <div key={review.id} data-ocid={`reviews.item.${idx + 1}`}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  data-ocid="reviews.pagination_next"
                >
                  Load More Reviews
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
