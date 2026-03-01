import { useState } from "react";
import { useCreateReturnRequest } from "@/hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RotateCcw, Package, Clock, Mail, Video } from "lucide-react";
import { toast } from "sonner";
import type { ReturnRequest } from "@/backend";

const RETURN_REASONS = [
  "Damaged / Defective Item",
  "Wrong Item Received",
  "Item Not as Described",
  "Changed My Mind",
  "Other",
];

const POLICY_CARDS = [
  {
    icon: Clock,
    title: "7-Day Return Window",
    description:
      "Returns must be initiated within 7 days of delivery. An unboxing video is required as proof of condition at the time of delivery.",
  },
  {
    icon: Package,
    title: "Original Condition",
    description:
      "Items must be unused, unwashed, and in their original packaging with all tags attached.",
  },
  {
    icon: Video,
    title: "Unboxing Video Required",
    description:
      "Please record an unboxing video when you receive your order. This is required for all return and damage claims.",
  },
  {
    icon: Mail,
    title: "Contact Us First",
    description:
      "Before returning, please email us at knotankey@gmail.com so we can guide you through the process.",
  },
];

export default function ReturnsPage() {
  const createReturnMutation = useCreateReturnRequest();

  const [form, setForm] = useState({
    orderId: "",
    email: "",
    reason: "",
    description: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.reason) {
      toast.error("Please select a return reason.");
      return;
    }

    const returnRequest: ReturnRequest = {
      id: `RET-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      orderId: form.orderId,
      email: form.email,
      reason: form.reason,
      description: form.description,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await createReturnMutation.mutateAsync(returnRequest);
      toast.success("Return request submitted successfully!");
      setForm({ orderId: "", email: "", reason: "", description: "" });
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit return request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <RotateCcw className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground font-serif mb-3">
            Returns & Exchanges
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We want you to love your purchase. If something isn't right, we're
            here to help.
          </p>
        </div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-14">
          {POLICY_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-card border border-border rounded-xl p-5 flex gap-4"
              >
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Return Request Form */}
        <div className="bg-card border border-border rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-foreground font-serif mb-6">
            Submit a Return Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  name="orderId"
                  value={form.orderId}
                  onChange={handleChange}
                  required
                  placeholder="ORD-1234567890-ABCDE"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Return</Label>
              <Select
                value={form.reason}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, reason: val }))
                }
              >
                <SelectTrigger id="reason">
                  <SelectValue placeholder="Select a reason…" />
                </SelectTrigger>
                <SelectContent>
                  {RETURN_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Additional Details</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Please describe the issue in detail…"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={createReturnMutation.isPending}
            >
              {createReturnMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit Return Request"
              )}
            </Button>
          </form>
        </div>

        {/* Contact Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Need help?{" "}
          <a
            href="mailto:knotankey@gmail.com"
            className="text-primary hover:underline font-medium"
          >
            knotankey@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
}
