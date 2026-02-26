import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSubscribeToNewsletter } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const { mutate, isPending } = useSubscribeToNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    mutate(email, {
      onSuccess: () => {
        toast.success('You\'re subscribed! Welcome to the knotankey family 🧶');
        setEmail('');
      },
      onError: () => toast.error('Something went wrong. Please try again.'),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="bg-cream-50 border-cream-300 text-warm-brown placeholder:text-warm-sand text-sm h-9 rounded-xl"
      />
      <Button
        type="submit"
        disabled={isPending}
        size="sm"
        className="bg-warm-brown hover:bg-warm-tan text-cream-50 font-sans text-xs tracking-wider rounded-xl btn-luxury whitespace-nowrap"
      >
        {isPending ? '…' : 'Subscribe'}
      </Button>
    </form>
  );
}
