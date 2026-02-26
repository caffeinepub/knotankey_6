import { useGetCustomOrderRequests } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Inbox } from 'lucide-react';
import type { CustomOrderRequest } from '../../backend';

interface AdminCustomOrdersViewerProps {
  passcode: string;
}

export default function AdminCustomOrdersViewer({ passcode }: AdminCustomOrdersViewerProps) {
  const { data: requests = [], isLoading } = useGetCustomOrderRequests(passcode);

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-warm-brown">Custom Order Requests ({requests.length})</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-cream-50 rounded-3xl border border-cream-300">
          <Inbox className="w-12 h-12 text-cream-300 mx-auto mb-3" />
          <p className="font-serif text-xl text-warm-tan">No custom order requests yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requests.map((req: CustomOrderRequest) => {
            const imageUrl = req.inspirationImage.getDirectURL();
            return (
              <div key={req.id} className="bg-card rounded-2xl border border-cream-300 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-sans text-xs text-warm-tan">{req.id}</p>
                    <p className="font-sans text-xs text-warm-tan/70">{formatDate(req.createdAt)}</p>
                  </div>
                  <span className="bg-cream-200 text-warm-brown text-xs font-sans px-2 py-0.5 rounded-full capitalize">
                    {req.productType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-wider text-warm-tan">Color</p>
                    <p className="font-sans text-sm text-warm-brown">{req.colorPreference}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-wider text-warm-tan">Size</p>
                    <p className="font-sans text-sm text-warm-brown">{req.size}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-wider text-warm-tan">Budget</p>
                    <p className="font-sans text-sm text-warm-brown">{req.budgetRange}</p>
                  </div>
                  <div>
                    <p className="font-sans text-xs uppercase tracking-wider text-warm-tan">Email</p>
                    <p className="font-sans text-sm text-warm-brown truncate">{req.email}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-sans text-xs uppercase tracking-wider text-warm-tan mb-1">Description</p>
                  <p className="font-sans text-sm text-warm-tan leading-relaxed line-clamp-3">{req.description}</p>
                </div>

                {imageUrl && (
                  <div className="mt-3">
                    <p className="font-sans text-xs uppercase tracking-wider text-warm-tan mb-1">Inspiration Image</p>
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-cream-200">
                      <img
                        src={imageUrl}
                        alt="Inspiration"
                        className="w-full h-full object-cover"
                        onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
