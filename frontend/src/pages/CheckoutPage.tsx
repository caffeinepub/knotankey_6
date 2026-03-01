import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCart } from '../context/CartContext';
import { useCreateOrder } from '../hooks/useQueries';
import OrderSummary from '../components/checkout/OrderSummary';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, CreditCard, Lock } from 'lucide-react';
import type { Order, OrderItem } from '../backend';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const EMPTY_FORM: FormData = {
  fullName: '', email: '', phone: '', address: '', city: '', postalCode: '', country: '',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Valid email required';
    if (!form.phone.trim()) newErrors.phone = 'Required';
    if (!form.address.trim()) newErrors.address = 'Required';
    if (!form.city.trim()) newErrors.city = 'Required';
    if (!form.postalCode.trim()) newErrors.postalCode = 'Required';
    if (!form.country.trim()) newErrors.country = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const orderItems: OrderItem[] = items.map(item => ({
      productId: item.productId,
      title: item.title,
      quantity: BigInt(item.quantity),
      price: BigInt(Math.round(item.price * 100)),
    }));

    const order: Order = {
      id: orderId,
      customerInfo: {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      },
      items: orderItems,
      total: BigInt(Math.round(total * 100)),
      status: 'pending',
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    createOrder(order, {
      onSuccess: (orderId) => {
        clearCart();
        navigate({ to: '/checkout/thank-you', search: { orderId } });
      },
      onError: () => toast.error('Failed to place order. Please try again.'),
    });
  };

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const fields: { key: keyof FormData; label: string; type?: string; colSpan?: boolean }[] = [
    { key: 'fullName', label: 'Full Name', colSpan: true },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'phone', label: 'Phone Number', type: 'tel' },
    { key: 'address', label: 'Shipping Address', colSpan: true },
    { key: 'city', label: 'City' },
    { key: 'postalCode', label: 'Postal Code' },
    { key: 'country', label: 'Country', colSpan: true },
  ];

  return (
    <div className="pt-20 min-h-screen">
      <div className="bg-cream-200 py-16 px-4 text-center border-b border-cream-300">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-3">Almost there</p>
        <h1 className="font-serif text-5xl text-warm-brown">Checkout</h1>
        <div className="w-16 h-px bg-warm-tan mx-auto mt-4" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-3xl shadow-soft border border-cream-300 p-8">
                <h2 className="font-serif text-2xl text-warm-brown mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {fields.map(field => (
                    <div key={field.key} className={field.colSpan ? 'sm:col-span-2' : ''}>
                      <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                        {field.label}
                      </Label>
                      <Input
                        type={field.type || 'text'}
                        value={form[field.key]}
                        onChange={update(field.key)}
                        className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown focus:border-warm-brown ${
                          errors[field.key] ? 'border-destructive' : ''
                        }`}
                      />
                      {errors[field.key] && (
                        <p className="font-sans text-xs text-destructive mt-1">{errors[field.key]}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Payment section */}
                <div className="mt-8 pt-6 border-t border-cream-300">
                  <h2 className="font-serif text-2xl text-warm-brown mb-4">Payment</h2>
                  <div className="bg-cream-200 rounded-2xl p-5 border border-cream-300 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-warm-tan" />
                    <div>
                      <p className="font-sans text-sm text-warm-brown font-medium">Secure Payment</p>
                      <p className="font-sans text-xs text-warm-tan">
                        Payment link will be sent to your email after order placement
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-4">
                <OrderSummary />

                {/* Secure Payment Notice */}
                <div
                  className="rounded-2xl border border-[#E8DDD0] px-5 py-4 flex items-start gap-3"
                  style={{ backgroundColor: '#F8F5F0' }}
                >
                  <div className="mt-0.5 shrink-0">
                    <Lock className="w-4 h-4 text-warm-brown" />
                  </div>
                  <div className="text-center flex-1">
                    <p className="font-serif text-sm text-warm-brown font-semibold mb-1">
                      Secure Payment Process
                    </p>
                    <p className="font-sans text-xs text-warm-tan leading-relaxed">
                      After placing your order, we will send a secure payment link to your email.
                      Payment will be completed securely through that link to confirm your order.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending || items.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
