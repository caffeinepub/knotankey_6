import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { useCreateOrder } from "@/hooks/useQueries";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import type { Order, OrderItem } from "@/backend";
import { calculateShipping } from "@/utils/shipping";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const createOrderMutation = useCreateOrder();

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    shippingAddress: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const orderItems: OrderItem[] = items.map((item) => ({
      productId: item.productId,
      title: item.title,
      quantity: BigInt(item.quantity),
      price: BigInt(Math.round(item.price)),
    }));

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const shippingAmount = calculateShipping(subtotal);
    const grandTotal = subtotal + shippingAmount;

    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

    const order: Order = {
      id: orderId,
      customerName: form.customerName,
      email: form.email,
      phone: form.phone,
      shippingAddress: form.shippingAddress,
      city: form.city,
      state: form.state,
      postalCode: form.postalCode,
      country: form.country,
      items: orderItems,
      totalPrice: BigInt(Math.round(grandTotal)),
      orderDate: BigInt(Date.now()) * BigInt(1_000_000),
      orderStatus: "pending",
    };

    try {
      await createOrderMutation.mutateAsync(order);
      clearCart();
      navigate({ to: "/checkout/thank-you", search: { orderId } });
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground font-serif mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Shipping Form */}
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-foreground">
                Shipping Information
              </h2>

              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name</Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Jane Doe"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shippingAddress">Address</Label>
                <Input
                  id="shippingAddress"
                  name="shippingAddress"
                  value={form.shippingAddress}
                  onChange={handleChange}
                  required
                  placeholder="123 Main Street, Apt 4B"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    required
                    placeholder="Mumbai"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    required
                    placeholder="Maharashtra"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    required
                    placeholder="400001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                    placeholder="India"
                  />
                </div>
              </div>

              {/* Payment Notice */}
              <div
                className="mt-4 p-4 rounded-xl border border-border flex gap-3 items-start"
                style={{ backgroundColor: "#F8F5F0" }}
              >
                <Lock className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Secure Payment Process
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    After placing your order, you'll receive a payment link via
                    email. Your order will be confirmed once payment is
                    completed. We accept UPI, bank transfer, and other secure
                    methods.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-5">
              <OrderSummary />

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2"
                disabled={createOrderMutation.isPending || items.length === 0}
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
