import { useState } from "react";
import { useCreateCustomOrder } from "@/hooks/useQueries";
import { ExternalBlob } from "@/backend";
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
import { Loader2, Sparkles, CheckCircle, Upload, X } from "lucide-react";
import { toast } from "sonner";
import type { CustomOrderRequest } from "@/backend";

const PRODUCT_TYPES = [
  "Blanket / Throw",
  "Bag / Tote",
  "Wearable (Shawl, Scarf, etc.)",
  "Home Décor",
  "Baby Items",
  "Accessories",
  "Other",
];

const BUDGET_RANGES = [
  "Under ₹500",
  "₹500 – ₹1,000",
  "₹1,000 – ₹2,500",
  "₹2,500 – ₹5,000",
  "₹5,000+",
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "Custom / Not Applicable"];

export default function CustomOrderPage() {
  const createCustomOrderMutation = useCreateCustomOrder();
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [form, setForm] = useState({
    productType: "",
    colorPreference: "",
    size: "",
    description: "",
    budgetRange: "",
    email: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.productType || !form.budgetRange || !form.size) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let inspirationImage: ExternalBlob;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      inspirationImage = ExternalBlob.fromBytes(bytes).withUploadProgress(
        (pct) => setUploadProgress(pct)
      );
    } else {
      // Use a placeholder empty blob if no image provided
      inspirationImage = ExternalBlob.fromBytes(new Uint8Array(0));
    }

    const request: CustomOrderRequest = {
      id: `CUSTOM-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      productType: form.productType,
      colorPreference: form.colorPreference,
      size: form.size,
      description: form.description,
      inspirationImage,
      budgetRange: form.budgetRange,
      email: form.email,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      await createCustomOrderMutation.mutateAsync(request);
      setSubmitted(true);
      setUploadProgress(null);
    } catch (err) {
      console.error(err);
      setUploadProgress(null);
      toast.error("Failed to submit custom order. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-16 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground font-serif mb-3">
            Request Received!
          </h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your custom order request. We'll review your details
            and get back to you at{" "}
            <strong className="text-foreground">{form.email}</strong> within
            2–3 business days.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline">
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground font-serif mb-3">
            Custom Order
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have something specific in mind? Tell us about your dream piece and
            we'll bring it to life.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Type */}
            <div className="space-y-2">
              <Label>
                Product Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.productType}
                onValueChange={(val) =>
                  setForm((prev) => ({ ...prev, productType: val }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="What would you like made?" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Color Preference */}
              <div className="space-y-2">
                <Label htmlFor="colorPreference">Color Preference</Label>
                <Input
                  id="colorPreference"
                  name="colorPreference"
                  value={form.colorPreference}
                  onChange={handleChange}
                  placeholder="e.g. Sage green, cream, pastel"
                />
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label>
                  Size <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.size}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, size: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your vision — stitch style, pattern, occasion, any special requirements…"
              />
            </div>

            {/* Inspiration Image */}
            <div className="space-y-2">
              <Label>Inspiration Image (optional)</Label>
              {imagePreview ? (
                <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Inspiration"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors bg-secondary/20">
                  <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload an inspiration image
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Budget Range */}
              <div className="space-y-2">
                <Label>
                  Budget Range <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.budgetRange}
                  onValueChange={(val) =>
                    setForm((prev) => ({ ...prev, budgetRange: val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_RANGES.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
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

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={createCustomOrderMutation.isPending}
            >
              {createCustomOrderMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {uploadProgress !== null
                    ? `Uploading… ${uploadProgress}%`
                    : "Submitting…"}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit Custom Order Request
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
