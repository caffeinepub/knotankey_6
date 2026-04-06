import type { Review } from "@/backend";
import ProductStructuredData from "@/components/StructuredData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/CartContext";
import {
  useGetApprovedReviewsByProduct,
  useGetProductById,
} from "@/hooks/useQueries";
import { useSEO } from "@/hooks/useSEO";
import { formatINR } from "@/utils/currency";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Minus,
  PenLine,
  Plus,
  ShoppingCart,
  Star,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useGetProductById(id);
  const { data: reviews } = useGetApprovedReviewsByProduct(id);

  useSEO({
    title: product?.title,
    description: product?.description,
    image: product ? product.image.getDirectURL() : undefined,
    url: `/products/${id}`,
    type: "product",
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        imageUrl: product.image.getDirectURL(),
      },
      quantity,
    );
    toast.success(`${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(
      {
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        imageUrl: product.image.getDirectURL(),
      },
      quantity,
    );
    navigate({ to: "/checkout" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="h-[500px] w-full rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-12 w-full mt-6" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Product Not Found
          </h2>
          <p className="text-muted-foreground mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Button onClick={() => navigate({ to: "/products" })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const imageUrl = product.image.getDirectURL();
  const productPageUrl = `https://knotankey-6kt.caffeine.xyz/products/${id}`;

  // Review summary
  const reviewList = reviews ?? [];
  const avgRating =
    reviewList.length > 0
      ? (
          reviewList.reduce((sum, r) => sum + Number(r.rating), 0) /
          reviewList.length
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Schema.org Product structured data for SEO */}
      <ProductStructuredData
        name={product.title}
        description={product.description}
        images={[imageUrl]}
        price={Number(product.price)}
        url={productPageUrl}
        sku={product.id}
        availability={"InStock"}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          type="button"
          onClick={() => navigate({ to: "/products" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/20">
              <img
                src={imageUrl}
                alt={`Handmade crochet ${product.title} by Knotankey`}
                className="w-full h-full object-cover"
              />
            </div>
            {product.bestseller && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Best Seller
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Badge
              variant="outline"
              className="w-fit mb-3 text-xs uppercase tracking-wider"
            >
              {product.category}
            </Badge>

            <h1 className="text-3xl font-bold text-foreground font-serif mb-3">
              {product.title}
            </h1>

            <p className="text-3xl font-bold text-primary mb-1">
              {formatINR(Number(product.price))}
            </p>

            {/* Review summary below price */}
            {avgRating && (
              <div className="flex items-center gap-1.5 mb-6">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm text-muted-foreground">
                  {avgRating} ({reviewList.length} review
                  {reviewList.length !== 1 ? "s" : ""})
                </span>
              </div>
            )}
            {!avgRating && <div className="mb-6" />}

            <p className="text-muted-foreground leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">
                Quantity
              </span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-secondary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-secondary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToCart}
                className="flex-1 gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              <Button size="lg" onClick={handleBuyNow} className="flex-1 gap-2">
                <Zap className="w-5 h-5" />
                Buy Now
              </Button>
            </div>

            {/* Handmade Notice */}
            <div className="mt-8 p-4 bg-secondary/30 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">
                🧶{" "}
                <strong className="text-foreground">
                  Handcrafted with love.
                </strong>{" "}
                Each piece is made to order and may have slight variations —
                that&apos;s what makes it uniquely yours.
              </p>
            </div>
          </div>
        </div>

        {/* ── Customer Reviews Section ── */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-serif text-foreground">
              Customer Reviews
            </h2>
            <Link
              to="/reviews/submit"
              search={{ productId: id }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warm-brown text-cream-50 font-sans text-xs tracking-wider uppercase transition-all duration-300 btn-luxury hover:bg-warm-tan"
              data-ocid="product.primary_button"
            >
              <PenLine className="w-3.5 h-3.5" />
              Write a Review
            </Link>
          </div>

          {reviewList.length === 0 ? (
            <div
              className="text-center py-10 text-muted-foreground bg-secondary/20 rounded-2xl border border-border"
              data-ocid="product.empty_state"
            >
              <p className="mb-1">No reviews yet for this product.</p>
              <p className="text-sm">Be the first to share your experience!</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              data-ocid="product.list"
            >
              {reviewList.slice(0, 10).map((review, idx) => (
                <div
                  key={review.id}
                  className="bg-card border border-border rounded-2xl p-5 shadow-soft"
                  data-ocid={`product.item.${idx + 1}`}
                >
                  <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                    <span className="font-semibold text-foreground text-sm">
                      {review.name}
                    </span>
                    <div className="flex flex-col items-end gap-0.5">
                      <StarDisplay rating={Number(review.rating)} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.message}
                  </p>
                  {hasImage(review) && (
                    <img
                      src={review.image.getDirectURL()}
                      alt={`Review by ${review.name}`}
                      loading="lazy"
                      className="mt-3 w-full max-h-40 object-cover rounded-xl border border-border"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
