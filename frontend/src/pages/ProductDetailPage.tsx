import { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProductById } from '../hooks/useQueries';
import { useCart } from '../context/CartContext';
import QuantitySelector from '../components/product-detail/QuantitySelector';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Zap, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams({ from: '/products/$id' });
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductById(id);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  if (isLoading) {
    return (
      <div className="pt-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-warm-brown mb-4">Product not found</p>
          <button
            onClick={() => navigate({ to: '/products' })}
            className="font-sans text-sm text-warm-tan hover:text-warm-brown underline"
          >
            Back to products
          </button>
        </div>
      </div>
    );
  }

  const price = Number(product.price) / 100;
  const imageUrl = product.image.getDirectURL();

  const handleAddToCart = () => {
    setAdding(true);
    addToCart({ productId: product.id, title: product.title, price, imageUrl }, quantity);
    toast.success(`${product.title} added to cart 🧶`);
    setTimeout(() => setAdding(false), 600);
  };

  const handleBuyNow = () => {
    addToCart({ productId: product.id, title: product.title, price, imageUrl }, quantity);
    navigate({ to: '/checkout' });
  };

  return (
    <div className="pt-20 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back */}
        <button
          onClick={() => navigate({ to: '/products' })}
          className="flex items-center gap-2 font-sans text-sm text-warm-tan hover:text-warm-brown transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <div className="img-zoom-container rounded-3xl overflow-hidden shadow-soft-lg bg-cream-200 aspect-square">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center animate-fade-up">
            {product.bestseller && (
              <div className="flex items-center gap-1 mb-3">
                <Star className="w-4 h-4 text-warm-brown fill-warm-brown" />
                <span className="font-sans text-xs tracking-wider uppercase text-warm-brown">Bestseller</span>
              </div>
            )}

            <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-warm-brown mb-4 leading-tight">
              {product.title}
            </h1>
            <p className="font-serif text-3xl text-warm-brown mb-6">
              ${price.toFixed(2)}
            </p>

            <div className="w-12 h-px bg-cream-300 mb-6" />

            <p className="font-sans text-warm-tan leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-3">Quantity</p>
              <QuantitySelector value={quantity} onChange={setQuantity} />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase btn-luxury transition-all duration-300 ${
                  adding ? 'opacity-70 scale-95' : 'hover:bg-warm-tan'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {adding ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-full border-2 border-warm-brown text-warm-brown font-sans text-sm tracking-wider uppercase btn-luxury hover:bg-warm-brown hover:text-cream-50 transition-all duration-300"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="mt-8 pt-6 border-t border-cream-300 grid grid-cols-3 gap-4 text-center">
              {['Handmade', 'Premium Quality', 'Free Returns'].map(badge => (
                <div key={badge}>
                  <p className="font-sans text-xs text-warm-tan">{badge}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
