import { useState } from 'react';
import { useCreateReturnRequest } from '../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Clock, Package, AlertCircle, Mail } from 'lucide-react';
import type { ReturnRequest } from '../backend';

interface FormState {
  orderId: string;
  email: string;
  reason: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  orderId: '',
  email: '',
  reason: '',
  description: '',
};

const POLICY_ITEMS = [
  {
    icon: Clock,
    title: '7-Day Return Window',
    text: 'Returns are accepted within 7 days of delivery. Please contact us as soon as possible to initiate a return. An unboxing video is required to process any return request.',
  },
  {
    icon: Package,
    title: 'Unused & Original Condition',
    text: 'All handmade items must be returned unused, unwashed, and in their original packaging with tags attached.',
  },
  {
    icon: AlertCircle,
    title: 'Custom Orders Are Final',
    text: 'Custom-made pieces are crafted specifically for you and are non-refundable. We do not accept returns on custom orders.',
  },
  {
    icon: Mail,
    title: 'Contact Us First',
    text: 'Before returning any item, please reach out to us at knotankey@gmail.com so we can guide you through the process.',
  },
];

export default function ReturnsPage() {
  const { mutate, isPending } = useCreateReturnRequest();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.orderId.trim()) newErrors.orderId = 'Required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!form.reason) newErrors.reason = 'Required';
    if (!form.description.trim()) newErrors.description = 'Required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const request: ReturnRequest = {
      id: `RET-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      orderId: form.orderId,
      email: form.email,
      reason: form.reason,
      description: form.description,
      createdAt: BigInt(Date.now()) * BigInt(1_000_000),
    };

    mutate(request, {
      onSuccess: () => {
        setSubmitted(true);
        setForm(EMPTY_FORM);
      },
      onError: () => toast.error('Failed to submit. Please try again.'),
    });
  };

  const update = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="bg-cream-200 py-16 px-4 text-center border-b border-cream-300">
        <p className="font-sans text-xs tracking-[0.3em] uppercase text-warm-tan mb-3">We're here to help</p>
        <h1 className="font-serif text-4xl md:text-5xl text-warm-brown">Returns & Exchanges</h1>
        <div className="w-16 h-px bg-warm-tan mx-auto mt-4" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Policy Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl text-warm-brown mb-2">Our Return Policy</h2>
            <p className="font-sans text-warm-tan">
              We want you to love every piece. Here's what you need to know.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {POLICY_ITEMS.map(item => (
              <div
                key={item.title}
                className="bg-card rounded-3xl p-6 border border-cream-300 shadow-soft flex gap-4"
              >
                <div className="w-10 h-10 rounded-2xl bg-cream-200 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-warm-brown" />
                </div>
                <div>
                  <h3 className="font-serif text-base text-warm-brown mb-1">{item.title}</h3>
                  <p className="font-sans text-sm text-warm-tan leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-cream-200 rounded-3xl p-5 border border-cream-300 text-center">
            <p className="font-sans text-sm text-warm-tan">
              Questions? Email us at{' '}
              <a
                href="mailto:knotankey@gmail.com"
                className="text-warm-brown hover:underline underline-offset-4 font-medium"
              >
                knotankey@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* Return Request Form */}
        <section>
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl text-warm-brown mb-2">Submit a Return Request</h2>
            <p className="font-sans text-warm-tan">
              Fill out the form below and we'll get back to you within 1–2 business days.
            </p>
          </div>

          {submitted ? (
            <div className="bg-card rounded-3xl shadow-soft border border-cream-300 p-12 text-center animate-scale-in">
              <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-5 shadow-soft">
                <CheckCircle className="w-8 h-8 text-warm-brown" />
              </div>
              <h3 className="font-serif text-2xl text-warm-brown mb-3">Request Submitted!</h3>
              <p className="font-sans text-warm-tan mb-6">
                We've received your return request and will be in touch shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="inline-block bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase px-8 py-3 rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl shadow-soft border border-cream-300 p-8 space-y-6"
            >
              {/* Order ID & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                    Order ID *
                  </Label>
                  <Input
                    value={form.orderId}
                    onChange={e => update('orderId', e.target.value)}
                    placeholder="e.g. ORD-1234567890"
                    className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown ${
                      errors.orderId ? 'border-destructive' : ''
                    }`}
                  />
                  {errors.orderId && (
                    <p className="font-sans text-xs text-destructive mt-1">{errors.orderId}</p>
                  )}
                </div>
                <div>
                  <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                    Email Address *
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
              </div>

              {/* Reason */}
              <div>
                <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                  Reason for Return *
                </Label>
                <Select value={form.reason} onValueChange={v => update('reason', v)}>
                  <SelectTrigger
                    className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown ${
                      errors.reason ? 'border-destructive' : ''
                    }`}
                  >
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wrong-item">Received wrong item</SelectItem>
                    <SelectItem value="damaged">Item arrived damaged</SelectItem>
                    <SelectItem value="not-as-described">Not as described</SelectItem>
                    <SelectItem value="size-issue">Size issue</SelectItem>
                    <SelectItem value="changed-mind">Changed my mind</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.reason && (
                  <p className="font-sans text-xs text-destructive mt-1">{errors.reason}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-2 block">
                  Additional Details *
                </Label>
                <Textarea
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  placeholder="Please describe the issue in detail…"
                  rows={4}
                  className={`bg-cream-50 border-cream-300 rounded-xl font-sans text-sm text-warm-brown resize-none ${
                    errors.description ? 'border-destructive' : ''
                  }`}
                />
                {errors.description && (
                  <p className="font-sans text-xs text-destructive mt-1">{errors.description}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-4 bg-warm-brown text-cream-50 font-sans text-sm tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                ) : (
                  'Submit Return Request'
                )}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
