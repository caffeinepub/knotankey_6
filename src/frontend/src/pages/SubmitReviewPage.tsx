import { ExternalBlob } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGetProducts, useSubmitReview } from "@/hooks/useQueries";
import { useSEO } from "@/hooks/useSEO";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, Loader2, Star, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <fieldset className="flex gap-1" aria-label="Rating selector">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
        >
          <Star
            className={`w-7 h-7 transition-colors duration-150 ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </fieldset>
  );
}

export default function SubmitReviewPage() {
  useSEO({
    title: "Write a Review",
    description: "Share your experience with Knotankey handcrafted products.",
    url: "/reviews/submit",
  });

  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { productId?: string };
  const { data: products, isLoading: productsLoading } = useGetProducts();
  const submitReview = useSubmitReview();

  const [form, setForm] = useState({
    name: "",
    email: "",
    orderNumber: "",
    productId: search.productId ?? "",
    rating: 0,
    message: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedProduct = products?.find((p) => p.id === form.productId);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required.";
    if (!form.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Please enter a valid email address.";
    if (!form.orderNumber.trim())
      newErrors.orderNumber = "Order number is required.";
    if (!form.productId) newErrors.productId = "Please select a product.";
    if (!form.rating) newErrors.rating = "Please select a rating.";
    if (!form.message.trim()) newErrors.message = "Review message is required.";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    if (!selectedProduct) return;

    let image: ExternalBlob;
    if (imageFile) {
      const bytes = new Uint8Array(await imageFile.arrayBuffer());
      image = ExternalBlob.fromBytes(bytes);
    } else {
      image = ExternalBlob.fromBytes(new Uint8Array(0));
    }

    const review = {
      id: `REV-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.title,
      category: selectedProduct.category,
      name: form.name.trim(),
      email: form.email.trim(),
      orderNumber: form.orderNumber.trim(),
      rating: BigInt(form.rating),
      message: form.message.trim(),
      image,
      status: "pending",
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await submitReview.mutateAsync(review);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-foreground mb-3">
            Thank you for your review!
          </h2>
          <p className="text-muted-foreground mb-8">
            Your review has been submitted and is awaiting approval. We
            appreciate you sharing your experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/reviews" })}
              className="gap-2"
              data-ocid="submit_review.secondary_button"
            >
              <ArrowLeft className="w-4 h-4" />
              View All Reviews
            </Button>
            <Button
              onClick={() => navigate({ to: "/products" })}
              data-ocid="submit_review.primary_button"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <button
          type="button"
          onClick={() => navigate({ to: "/reviews" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          data-ocid="submit_review.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reviews
        </button>

        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-serif text-foreground mb-2">
            Write a Review
          </h1>
          <p className="text-muted-foreground">
            Share your experience with Knotankey handcrafted products
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-soft space-y-6"
          data-ocid="submit_review.dialog"
          noValidate
        >
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="review-name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="review-name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Your name"
              data-ocid="submit_review.input"
            />
            {errors.name && (
              <p
                className="text-sm text-destructive"
                data-ocid="submit_review.error_state"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="review-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="review-email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((p) => ({ ...p, email: e.target.value }))
              }
              placeholder="your@email.com"
              data-ocid="submit_review.input"
            />
            {errors.email && (
              <p
                className="text-sm text-destructive"
                data-ocid="submit_review.error_state"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Order Number */}
          <div className="space-y-2">
            <Label htmlFor="review-order">
              Order Number <span className="text-destructive">*</span>
            </Label>
            <Input
              id="review-order"
              value={form.orderNumber}
              onChange={(e) =>
                setForm((p) => ({ ...p, orderNumber: e.target.value }))
              }
              placeholder="e.g. ORD-1234567890"
              data-ocid="submit_review.input"
            />
            {errors.orderNumber && (
              <p
                className="text-sm text-destructive"
                data-ocid="submit_review.error_state"
              >
                {errors.orderNumber}
              </p>
            )}
          </div>

          {/* Product */}
          <div className="space-y-2">
            <Label htmlFor="review-product">
              Product <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.productId}
              onValueChange={(val) =>
                setForm((p) => ({ ...p, productId: val }))
              }
              disabled={productsLoading}
            >
              <SelectTrigger
                id="review-product"
                data-ocid="submit_review.select"
              >
                <SelectValue
                  placeholder={
                    productsLoading ? "Loading products…" : "Select a product"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {products?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.productId && (
              <p
                className="text-sm text-destructive"
                data-ocid="submit_review.error_state"
              >
                {errors.productId}
              </p>
            )}
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>
              Rating <span className="text-destructive">*</span>
            </Label>
            <StarSelector
              value={form.rating}
              onChange={(v) => setForm((p) => ({ ...p, rating: v }))}
            />
            {errors.rating && (
              <p
                className="text-sm text-destructive"
                data-ocid="submit_review.error_state"
              >
                {errors.rating}
              </p>
            )}
          </div>

          {/* Review Message */}
          <div className="space-y-2">
            <Label htmlFor="review-message">
              Review Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="review-message"
              value={form.message}
              onChange={(e) =>
                setForm((p) => ({ ...p, message: e.target.value }))
              }
              placeholder="Tell us about your experience with this product…"
              rows={4}
              data-ocid="submit_review.textarea"
            />
            {errors.message && (
              <p
                className="text-sm text-destructive"
                data-ocid="submit_review.error_state"
              >
                {errors.message}
              </p>
            )}
          </div>

          {/* Image Upload (optional) */}
          <div className="space-y-2">
            <Label>Photo (optional)</Label>
            {imagePreview ? (
              <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-border">
                <img
                  src={imagePreview}
                  alt="Review preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 hover:bg-background text-foreground leading-none text-lg"
                  aria-label="Remove photo"
                >
                  ×
                </button>
              </div>
            ) : (
              <label
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors bg-secondary/20"
                data-ocid="submit_review.upload_button"
              >
                <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                <span className="text-sm text-muted-foreground">
                  Click to upload a photo
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            className="w-full gap-2"
            disabled={submitReview.isPending}
            data-ocid="submit_review.submit_button"
          >
            {submitReview.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
