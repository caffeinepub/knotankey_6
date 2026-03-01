import { useGetOrders, useUpdateOrderStatus } from '../../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Package } from 'lucide-react';
import type { Order } from '../../backend';
import { formatINR } from '../../utils/currency';

interface AdminOrdersManagementProps {
  passcode: string;
}

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-cream-300 text-warm-brown',
  processing: 'bg-warm-sand/30 text-warm-brown',
  shipped: 'bg-warm-tan/20 text-warm-brown',
  delivered: 'bg-warm-brown/20 text-warm-brown',
  cancelled: 'bg-destructive/10 text-destructive',
};

export default function AdminOrdersManagement({ passcode }: AdminOrdersManagementProps) {
  const { data: orders = [], isLoading } = useGetOrders(passcode);
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

  const handleStatusChange = (orderId: string, status: string) => {
    updateStatus({ passcode, orderId, status }, {
      onSuccess: () => toast.success('Order status updated!'),
      onError: () => toast.error('Failed to update status.'),
    });
  };

  const formatDate = (ts: bigint) => {
    return new Date(Number(ts) / 1_000_000).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-warm-brown">Orders ({orders.length})</h2>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-2xl" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-cream-50 rounded-3xl border border-cream-300">
          <Package className="w-12 h-12 text-cream-300 mx-auto mb-3" />
          <p className="font-serif text-xl text-warm-tan">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: Order) => (
            <div key={order.id} className="bg-card rounded-2xl border border-cream-300 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-sans text-sm font-medium text-warm-brown">{order.id}</p>
                    <span className={`text-xs font-sans px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-cream-200 text-warm-tan'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-warm-tan">
                    {order.customerInfo.fullName} · {order.customerInfo.email}
                  </p>
                  <p className="font-sans text-xs text-warm-tan/70">
                    {order.customerInfo.city}, {order.customerInfo.country} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-xl text-warm-brown">
                    {formatINR(Number(order.total) / 100)}
                  </p>
                  <p className="font-sans text-xs text-warm-tan">{order.items.length} item(s)</p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4 space-y-1">
                {order.items.map((item, i) => (
                  <p key={i} className="font-sans text-xs text-warm-tan">
                    {item.title} × {Number(item.quantity)} — {formatINR(Number(item.price) / 100)} each
                  </p>
                ))}
              </div>

              {/* Status update */}
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs uppercase tracking-wider text-warm-tan">Update Status:</span>
                <Select
                  value={order.status}
                  onValueChange={v => handleStatusChange(order.id, v)}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-40 bg-cream-50 border-cream-300 rounded-xl font-sans text-xs text-warm-brown h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(s => (
                      <SelectItem key={s} value={s} className="font-sans text-sm capitalize">{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
