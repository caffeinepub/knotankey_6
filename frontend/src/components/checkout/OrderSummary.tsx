import { useCart } from '../../context/CartContext';

export default function OrderSummary() {
  const { items, total } = useCart();

  return (
    <div className="bg-cream-200 rounded-3xl p-6 border border-cream-300">
      <h3 className="font-serif text-xl text-warm-brown mb-5">Order Summary</h3>

      <div className="space-y-4 mb-5">
        {items.map(item => (
          <div key={item.productId} className="flex gap-3">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-300 shrink-0">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-warm-brown truncate">{item.title}</p>
              <p className="font-sans text-xs text-warm-tan">Qty: {item.quantity}</p>
            </div>
            <span className="font-sans text-sm text-warm-brown font-medium whitespace-nowrap">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-cream-300 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-sans text-warm-tan">Subtotal</span>
          <span className="font-sans text-warm-brown">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="font-sans text-warm-tan">Shipping</span>
          <span className="font-sans text-warm-brown">Free</span>
        </div>
        <div className="border-t border-cream-300 pt-3 flex justify-between">
          <span className="font-sans text-sm uppercase tracking-wider text-warm-tan">Total</span>
          <span className="font-serif text-2xl text-warm-brown">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
