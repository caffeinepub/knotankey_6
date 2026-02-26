import { useGetReturnRequests } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { RotateCcw } from 'lucide-react';
import type { ReturnRequest } from '../../backend';

interface AdminReturnRequestsViewerProps {
  passcode: string;
}

export default function AdminReturnRequestsViewer({ passcode }: AdminReturnRequestsViewerProps) {
  const { data: requests = [], isLoading } = useGetReturnRequests(passcode);

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-warm-brown">Return Requests ({requests.length})</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 bg-cream-50 rounded-3xl border border-cream-300">
          <RotateCcw className="w-12 h-12 text-cream-300 mx-auto mb-3" />
          <p className="font-serif text-xl text-warm-tan">No return requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req: ReturnRequest) => (
            <div key={req.id} className="bg-card rounded-2xl border border-cream-300 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-sans text-xs text-warm-tan">{req.id}</p>
                  <p className="font-sans text-xs text-warm-tan/70">{formatDate(req.createdAt)}</p>
                </div>
                <span className="bg-cream-200 text-warm-brown text-xs font-sans px-2 py-0.5 rounded-full">
                  {req.reason.replace(/-/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-warm-tan">Order ID</p>
                  <p className="font-sans text-sm text-warm-brown font-medium">{req.orderId}</p>
                </div>
                <div>
                  <p className="font-sans text-xs uppercase tracking-wider text-warm-tan">Email</p>
                  <p className="font-sans text-sm text-warm-brown">{req.email}</p>
                </div>
              </div>

              <div>
                <p className="font-sans text-xs uppercase tracking-wider text-warm-tan mb-1">Description</p>
                <p className="font-sans text-sm text-warm-tan leading-relaxed">{req.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
