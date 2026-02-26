import { useEffect, useState } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import { CheckCircle, Heart, Package } from 'lucide-react';

export default function ThankYouPage() {
  const [visible, setVisible] = useState(false);
  const search = useSearch({ strict: false }) as { orderId?: string };
  const orderId = search?.orderId;

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <div
        className={`max-w-lg w-full text-center transition-all duration-700 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-cream-200 flex items-center justify-center shadow-soft">
            <CheckCircle className="w-12 h-12 text-warm-brown" />
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-warm-brown mb-4">
          Thank You!
        </h1>
        <p className="font-sans text-lg text-warm-tan mb-2">
          Your order has been placed successfully.
        </p>
        {orderId && (
          <p className="font-sans text-sm text-warm-tan/70 mb-8">
            Order ID: <span className="text-warm-brown font-medium">{orderId}</span>
          </p>
        )}

        <div className="bg-cream-200 rounded-3xl p-6 border border-cream-300 mb-8 text-left space-y-4">
          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-warm-brown mt-0.5 shrink-0" />
            <div>
              <p className="font-sans text-sm text-warm-brown font-medium">What happens next?</p>
              <p className="font-sans text-sm text-warm-tan mt-1">
                We'll begin crafting your order with love. You'll receive a confirmation email shortly.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-warm-brown mt-0.5 shrink-0" />
            <div>
              <p className="font-sans text-sm text-warm-brown font-medium">Handmade with care</p>
              <p className="font-sans text-sm text-warm-tan mt-1">
                Each piece is crafted by hand, so please allow 5–10 business days for delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-block bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
          >
            Back to Home
          </Link>
          <Link
            to="/products"
            className="inline-block border border-warm-brown text-warm-brown font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-full hover:bg-warm-brown hover:text-cream-50 transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
