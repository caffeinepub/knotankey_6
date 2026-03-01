import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import QuantitySelector from '../product-detail/QuantitySelector';
import { formatINR } from '../../utils/currency';

interface CartItemProps {
  productId: string;
  title: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export default function CartItem({ productId, title, price, imageUrl, quantity }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex gap-4 py-5 border-b border-cream-300 last:border-0">
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-cream-200 shrink-0">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-serif text-base text-warm-brown leading-snug mb-1 truncate">{title}</h4>
        <p className="font-sans text-sm text-warm-tan mb-3">{formatINR(price)} each</p>

        <div className="flex items-center justify-between">
          <QuantitySelector
            value={quantity}
            onChange={v => updateQuantity(productId, v)}
          />
          <div className="flex items-center gap-3">
            <span className="font-serif text-base text-warm-brown font-medium">
              {formatINR(price * quantity)}
            </span>
            <button
              onClick={() => removeFromCart(productId)}
              className="text-warm-tan hover:text-destructive transition-colors duration-200 p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
