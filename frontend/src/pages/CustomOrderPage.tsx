import { useState, useRef } from 'react';
import { useCreateCustomOrderRequest } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Upload, X, CheckCircle, ImageIcon } from 'lucide-react';
import { ExternalBlob } from '../backend';
import type { CustomOrderRequest } from '../backend';

interface FormState {
  productType: string;
  colorPreference: string;
  size: string;
  description: string;
  budgetRange: string;
  email: string;
}

const EMPTY_FORM: FormState = {
  productType: '',
  colorPreference: '',
  size: '',
  description: '',
  budgetRange: '',
  email: '',
};

export default function CustomOrderPage() {
  const { mutate, isPending } = useCreateCustomOrderRequest();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.productType) newErrors.productType = 'Required';
    if (!form.colorPreference.trim()) newErrors.colorPreference = 'Required';
    if (!form.size.trim()) newErrors.size = 'Required';
    if (!form.description.trim()) newErrors.description = 'Required';
    if (!form.budgetRange) newErrors.budgetRange = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let inspirationImage: ExternalBlob;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      inspirationImage = ExternalBlob.fromBytes(new Uint8Array(arrayBuffer));
    } else {
      // Minimal 1x1 transparent PNG as placeholder when no image is uploaded
      const placeholder = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222,
        0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 207, 192, 0, 0, 0,
        2, 0, 1, 226, 33, 188, 51, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
      ]);
      inspirationImage = ExternalBlob.fromBytes(placeholder);
    }

    const request: CustomOrderRequest = {
      id: `COR-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      productType: form.productType,
      colorPreference: form.colorPreference,
      size: form.size,
      description: form.description,
      inspirationImage,
      budgetRange: form.budgetRange,
      email: form.email,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    mutate(request, {
      onSuccess: () => {
        setSubmitted(true);
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview(null);
      },
      onError: () => toast.error('Failed to submit. Please try again.'),
    });
  };

  const update = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-6 shadow-soft">
            <CheckCircle className="w-10 h-10 text-warm-brown" />
          </div>
          <h2 className="font-serif text-3xl text-warm-brown mb-3">Request Received!</h2>
          <p className="font-sans text-warm-tan mb-8 leading-relaxed">
            We've received your custom order request and will be in touch within 2–3 business days at{' '}
            <span className="text-warm-brown font-medium">{form.email || 'your email'}</span>.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="inline-block bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
          >
            Submit Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-cream-200 py-16 px-4 text-center border-b border-cream-300">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-3">Made just for you</p>
        <h1 className="font-serif text-4xl md:text-5xl text-warm-brown">Design Your Own Crochet Piece</h1>
        <div className="w-16 h-px bg-warm-tan mx-auto mt-4" />
        <p className="font-sans text-warm-tan mt-4 max-w-xl mx-auto">
          Tell us your vision and we'll bring it to life, stitch by stitch.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <form onSubmit={handleSubmit} className="bg-card rounded-3xl shadow-soft border border-cream-300 p-8 space-y-6">

          {/* Product Type */}
          <div>
            <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
              Product Type *
            </Label>
            <Select value={form.productType} onValueChange={v => update('productType', v)}>
              <SelectTrigger
                className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown ${
                  errors.productType ? 'border-destructive' : ''
                }`}
              >
                <SelectValue placeholder="Select a product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bag">Bag</SelectItem>
                <SelectItem value="blanket">Blanket</SelectItem>
                <SelectItem value="sweater">Sweater</SelectItem>
                <SelectItem value="decor">Home Decor</SelectItem>
              </SelectContent>
            </Select>
            {errors.productType && (
              <p className="font-sans text-xs text-destructive mt-1">{errors.productType}</p>
            )}
          </div>

          {/* Color & Size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                Color Preference *
              </Label>
              <Input
                value={form.colorPreference}
                onChange={e => update('colorPreference', e.target.value)}
                placeholder="e.g. Ivory, Blush, Sage"
                className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown ${
                  errors.colorPreference ? 'border-destructive' : ''
                }`}
              />
              {errors.colorPreference && (
                <p className="font-sans text-xs text-destructive mt-1">{errors.colorPreference}</p>
              )}
            </div>
            <div>
              <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                Size *
              </Label>
              <Input
                value={form.size}
                onChange={e => update('size', e.target.value)}
                placeholder="e.g. Small, Medium, 50×60cm"
                className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown ${
                  errors.size ? 'border-destructive' : ''
                }`}
              />
              {errors.size && (
                <p className="font-sans text-xs text-destructive mt-1">{errors.size}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
              Description *
            </Label>
            <Textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Describe your dream piece in detail — stitch pattern, texture, intended use…"
              rows={4}
              className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown resize-none ${
                errors.description ? 'border-destructive' : ''
              }`}
            />
            {errors.description && (
              <p className="font-sans text-xs text-destructive mt-1">{errors.description}</p>
            )}
          </div>

          {/* Inspiration Image */}
          <div>
            <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
              Inspiration Image (optional)
            </Label>
            {imagePreview ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-cream-200 border border-cream-300">
                <img src={imagePreview} alt="Inspiration" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-3 right-3 w-8 h-8 bg-warm-brown/80 text-cream-50 rounded-full flex items-center justify-center hover:bg-warm-brown transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-cream-300 rounded-2xl p-8 flex flex-col items-center gap-3 hover:border-warm-tan hover:bg-cream-200 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-cream-200 flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-warm-tan" />
                </div>
                <div className="text-center">
                  <p className="font-sans text-sm text-warm-brown">Click to upload an image</p>
                  <p className="font-sans text-xs text-warm-tan mt-1">PNG, JPG up to 10MB</p>
                </div>
                <div className="flex items-center gap-2 text-warm-tan">
                  <Upload className="w-4 h-4" />
                  <span className="font-sans text-xs">Browse files</span>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Budget Range */}
          <div>
            <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
              Budget Range *
            </Label>
            <Select value={form.budgetRange} onValueChange={v => update('budgetRange', v)}>
              <SelectTrigger
                className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown ${
                  errors.budgetRange ? 'border-destructive' : ''
                }`}
              >
                <SelectValue placeholder="Select your budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50">Under $50</SelectItem>
                <SelectItem value="50-100">$50 – $100</SelectItem>
                <SelectItem value="100-200">$100 – $200</SelectItem>
                <SelectItem value="200-500">$200 – $500</SelectItem>
                <SelectItem value="500-plus">$500+</SelectItem>
              </SelectContent>
            </Select>
            {errors.budgetRange && (
              <p className="font-sans text-xs text-destructive mt-1">{errors.budgetRange}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
              Your Email *
            </Label>
            <Input
              type="email"
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="hello@example.com"
              className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown ${
                errors.email ? 'border-destructive' : ''
              }`}
            />
            {errors.email && (
              <p className="font-sans text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center gap-2 py-4 bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            ) : (
              'Request Custom Piece'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
