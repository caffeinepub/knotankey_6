import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useGetProductById } from "@/hooks/useQueries";
import { useCart } from "@/context/CartContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/utils/currency";
import { ShoppingCart, Zap, Plus, Minus, ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams({ from: "/products/$id" });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useGetProductById(id);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      {
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        imageUrl: product.image.getDirectURL(),
      },
      quantity
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
      quantity
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
            The product you're looking for doesn't exist or has been removed.
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

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
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
                alt={product.title}
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

            <p className="text-3xl font-bold text-primary mb-6">
              {formatINR(Number(product.price))}
            </p>

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
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-secondary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
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
                that's what makes it uniquely yours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
