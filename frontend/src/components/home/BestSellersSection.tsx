import { useRef } from 'react';
import { Link } from '@tanstack/react-router';
import { useGetProducts } from '../../hooks/useQueries';
import ProductCard from '../ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

export default function BestSellersSection() {
  const { data: products, isLoading } = useGetProducts();
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  const bestsellers = products?.filter(p => p.bestseller).slice(0, 4) ?? [];

  return (
    <section
      ref={sectionRef}
      className={`py-20 px-4 max-w-7xl mx-auto transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="text-center mb-12">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-3">Our Favourites</p>
        <h2 className="font-serif text-4xl md:text-5xl text-warm-brown">Best Sellers</h2>
        <div className="w-16 h-px bg-warm-tan mx-auto mt-4" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
      ) : bestsellers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestsellers.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s`, animationFillMode: 'both' }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="font-sans text-warm-tan">Products coming soon…</p>
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/products"
          className="inline-block border border-warm-brown text-warm-brown font-sans text-sm tracking-[0.2em] uppercase px-8 py-3 rounded-full hover:bg-warm-brown hover:text-cream-50 transition-all duration-300 btn-luxury"
        >
          View All Products
        </Link>
      </div>
    </section>
  );
}
