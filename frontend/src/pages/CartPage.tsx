import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../context/CartContext';
import CartItem from '../components/cart/CartItem';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { formatINR } from '../utils/currency';

export default function CartPage() {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-cream-200 py-16 px-4 text-center border-b border-cream-300">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-3">Your Selection</p>
        <h1 className="font-serif text-5xl text-warm-brown">Shopping Cart</h1>
        <div className="w-16 h-px bg-warm-tan mx-auto mt-4" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag className="w-16 h-16 text-cream-300 mx-auto mb-6" />
            <h2 className="font-serif text-3xl text-warm-tan mb-4">Your cart is empty</h2>
            <p className="font-sans text-warm-tan/70 mb-8">Discover our beautiful handcrafted pieces</p>
            <Link
              to="/products"
              className="inline-block bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-3xl shadow-soft border border-cream-300 px-6">
                {items.map(item => (
                  <CartItem key={item.productId} {...item} />
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-3xl shadow-soft border border-cream-300 p-6 sticky top-24">
                <h3 className="font-serif text-xl text-warm-brown mb-5">Order Summary</h3>

                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="font-sans text-warm-tan truncate mr-2">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="font-sans text-warm-brown font-medium whitespace-nowrap">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-cream-300 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-sm uppercase tracking-wider text-warm-tan">Total</span>
                    <span className="font-serif text-2xl text-warm-brown">{formatINR(total)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate({ to: '/checkout' })}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/products"
                  className="block text-center mt-3 font-sans text-sm text-warm-tan hover:text-warm-brown transition-colors underline underline-offset-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
