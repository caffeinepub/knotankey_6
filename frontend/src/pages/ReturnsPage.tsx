import { useState, useRef } from "react";
import { useCreateReturnRequest } from "@/hooks/useQueries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, RotateCcw, Package, Clock, Mail, Video, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ExternalBlob } from "@/backend";

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
      "Returns must be initiated within 7 days of delivery. So initiate the return as soon as possible.",
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

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/webm"];
const ALLOWED_EXTENSIONS = [".mp4", ".mov", ".webm"];
const MAX_VIDEO_SIZE_MB = 50;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

interface FormErrors {
  orderNumber?: string;
  customerName?: string;
  email?: string;
  reason?: string;
  message?: string;
  video?: string;
}

export default function ReturnsPage() {
  const createReturnMutation = useCreateReturnRequest();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    orderNumber: "",
    customerName: "",
    email: "",
    reason: "",
    message: "",
  });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleReasonChange = (val: string) => {
    setForm((prev) => ({ ...prev, reason: val }));
    if (errors.reason) {
      setErrors((prev) => ({ ...prev, reason: undefined }));
    }
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const isValidType = ALLOWED_VIDEO_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValidType) {
      setErrors((prev) => ({
        ...prev,
        video: "Invalid file format. Only MP4, MOV, and WEBM are allowed.",
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate size
    if (file.size > MAX_VIDEO_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        video: `File is too large. Maximum size is ${MAX_VIDEO_SIZE_MB}MB.`,
      }));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Clear previous preview URL
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoPreviewUrl(previewUrl);
    setUploadProgress(0);
    setErrors((prev) => ({ ...prev, video: undefined }));
  };

  const handleRemoveVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    setVideoFile(null);
    setVideoPreviewUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.orderNumber.trim()) {
      newErrors.orderNumber = "Order number is required.";
    }
    if (!form.customerName.trim()) {
      newErrors.customerName = "Customer name is required.";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
    }
    if (!form.reason) {
      newErrors.reason = "Reason for return is required.";
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required.";
    }
    if (!videoFile) {
      newErrors.video = "A product condition video is required to submit a return request.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileBytes = new Uint8Array(await videoFile!.arrayBuffer());
      const videoBlob = ExternalBlob.fromBytes(fileBytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      await createReturnMutation.mutateAsync({
        orderNumber: form.orderNumber.trim(),
        customerName: form.customerName.trim(),
        email: form.email.trim(),
        reason: form.reason,
        message: form.message.trim(),
        video: videoBlob,
      });

      toast.success("Return request submitted successfully!");

      // Reset form
      setForm({ orderNumber: "", customerName: "", email: "", reason: "", message: "" });
      handleRemoveVideo();
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit return request. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const isPending = createReturnMutation.isPending || isUploading;

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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Order Number + Customer Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="orderNumber">
                  Order Number <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orderNumber"
                  name="orderNumber"
                  value={form.orderNumber}
                  onChange={handleChange}
                  placeholder="ORD-1234567890-ABCDE"
                  aria-invalid={!!errors.orderNumber}
                />
                {errors.orderNumber && (
                  <p className="text-sm text-red-500">{errors.orderNumber}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  aria-invalid={!!errors.customerName}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500">{errors.customerName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Reason for Return */}
            <div className="space-y-2">
              <Label htmlFor="reason">
                Reason for Return <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.reason}
                onValueChange={handleReasonChange}
              >
                <SelectTrigger id="reason" aria-invalid={!!errors.reason}>
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
              {errors.reason && (
                <p className="text-sm text-red-500">{errors.reason}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder="Please describe the issue in detail…"
                aria-invalid={!!errors.message}
              />
              {errors.message && (
                <p className="text-sm text-red-500">{errors.message}</p>
              )}
            </div>

            {/* Video Upload Section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Upload Unboxing / Condition Video <span className="text-red-500">*</span>
                </h3>
                <p className="text-sm text-muted-foreground">
                  To process a return request, please upload a video showing the condition of the product.
                </p>
              </div>

              {!videoFile ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    errors.video
                      ? "border-red-400 bg-red-50/30"
                      : "border-border hover:border-primary/50 hover:bg-primary/5"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Click to upload a video
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP4, MOV, WEBM — max {MAX_VIDEO_SIZE_MB}MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".mp4,.mov,.webm,video/mp4,video/quicktime,video/webm"
                    className="hidden"
                    onChange={handleVideoSelect}
                  />
                </div>
              ) : (
                <div className="border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <Video className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground truncate">
                        {videoFile.name}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        ({(videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveVideo}
                      className="shrink-0 ml-2 text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label="Remove video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Video Preview */}
                  {videoPreviewUrl && (
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full rounded-lg max-h-48 bg-black"
                    />
                  )}

                  {/* Upload Progress */}
                  {isUploading && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uploading…</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}
                </div>
              )}

              {errors.video && (
                <p className="text-sm text-red-500">{errors.video}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isUploading ? `Uploading… ${uploadProgress}%` : "Submitting…"}
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
