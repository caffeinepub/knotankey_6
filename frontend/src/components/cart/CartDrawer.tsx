import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleCheckout = () => {
    onClose();
    navigate({ to: '/checkout' });
  };

  const handleViewCart = () => {
    onClose();
    navigate({ to: '/cart' });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-warm-brown/20 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-cream-50 shadow-soft-xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-300">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-warm-brown" />
            <h2 className="font-serif text-xl text-warm-brown">Your Cart</h2>
            {itemCount > 0 && (
              <span className="bg-warm-brown text-cream-50 text-xs font-sans px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-warm-tan hover:text-warm-brown transition-colors rounded-full hover:bg-cream-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag className="w-12 h-12 text-cream-300 mb-4" />
              <p className="font-serif text-xl text-warm-tan mb-2">Your cart is empty</p>
              <p className="font-sans text-sm text-warm-tan/70">Add some beautiful pieces to get started</p>
            </div>
          ) : (
            <div>
              {items.map(item => (
                <CartItem key={item.productId} {...item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-cream-300 bg-cream-100">
            <div className="flex justify-between items-center mb-5">
              <span className="font-sans text-sm text-warm-tan uppercase tracking-wider">Total</span>
              <span className="font-serif text-2xl text-warm-brown">${total.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={handleViewCart}
                className="w-full py-3 border border-cream-300 text-warm-brown font-sans text-sm tracking-wider uppercase rounded-full hover:bg-cream-200 transition-all duration-300"
              >
                View Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
