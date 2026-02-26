import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const imageUrl = product.image.getDirectURL();
  const price = Number(product.price) / 100;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart({
      productId: product.id,
      title: product.title,
      price,
      imageUrl,
    });
    toast.success(`${product.title} added to cart 🧶`);
    setTimeout(() => setAdding(false), 600);
  };

  return (
    <div className="group bg-card rounded-3xl overflow-hidden shadow-soft card-lift border border-cream-300">
      {/* Image */}
      <Link to="/products/$id" params={{ id: product.id }}>
        <div className="img-zoom-container aspect-square bg-cream-200 relative overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {product.bestseller && (
            <span className="absolute top-3 left-3 bg-warm-brown text-cream-50 text-xs font-sans tracking-wider px-3 py-1 rounded-full">
              Bestseller
            </span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-5">
        <Link to="/products/$id" params={{ id: product.id }}>
          <h3 className="font-serif text-lg text-warm-brown mb-1 group-hover:text-warm-tan transition-colors duration-300 leading-snug">
            {product.title}
          </h3>
        </Link>
        <p className="font-sans text-sm text-warm-tan mb-1 capitalize">{product.category}</p>
        <p className="font-serif text-xl text-warm-brown font-medium mb-4">
          ${price.toFixed(2)}
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-warm-brown text-cream-50 font-sans text-xs tracking-wider uppercase transition-all duration-300 btn-luxury ${
              adding ? 'opacity-70 scale-95' : 'hover:bg-warm-tan'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            {adding ? 'Added!' : 'Quick Add'}
          </button>
          <Link
            to="/products/$id"
            params={{ id: product.id }}
            className="flex items-center justify-center p-2.5 rounded-2xl border border-cream-300 text-warm-tan hover:text-warm-brown hover:border-warm-brown transition-all duration-300"
            aria-label="View product"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
