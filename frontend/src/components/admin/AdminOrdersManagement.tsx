import { useState } from "react";
import { useGetOrders, useUpdateOrderStatus } from "@/hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatINR } from "@/utils/currency";
import { Loader2, MapPin, Phone, Mail, User, Package, Calendar } from "lucide-react";
import { toast } from "sonner";
import type { Order } from "@/backend";

interface Props {
  passcode: string;
}

const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatOrderDate(orderDate: bigint): string {
  return new Date(Number(orderDate) / 1_000_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function buildFullAddress(order: Order): string {
  const parts = [
    order.shippingAddress,
    order.city,
    order.state,
    order.postalCode,
    order.country,
  ].filter(Boolean);
  return parts.join(", ");
}

interface OrderDetailModalProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
  passcode: string;
  onStatusChange: (orderId: string, status: string) => void;
  updatingOrderId: string | null;
}

function OrderDetailModal({
  order,
  open,
  onClose,
  onStatusChange,
  updatingOrderId,
}: OrderDetailModalProps) {
  if (!order) return null;

  const statusColor = STATUS_COLORS[order.orderStatus] ?? "bg-gray-100 text-gray-800";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">
            Order Details — {order.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Status + Date */}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
            >
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatOrderDate(order.orderDate)}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-foreground mb-3">Customer Information</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4 shrink-0" />
              <span>{order.customerName || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <span>{order.email || "—"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{order.phone || "—"}</span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-muted/40 rounded-lg p-4 space-y-1">
            <h3 className="text-sm font-semibold text-foreground mb-3">Shipping Address</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                {order.shippingAddress && <p>{order.shippingAddress}</p>}
                <p>
                  {[order.city, order.state].filter(Boolean).join(", ")}
                  {order.postalCode ? ` — ${order.postalCode}` : ""}
                </p>
                {order.country && <p>{order.country}</p>}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-muted/40 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products Ordered
            </h3>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-sm"
                >
                  <div>
                    <span className="text-foreground">{item.title}</span>
                    <span className="text-muted-foreground ml-2">
                      × {String(item.quantity)}
                    </span>
                  </div>
                  <span className="text-foreground font-medium">
                    {formatINR(Number(item.price) * Number(item.quantity))}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span>{formatINR(Number(order.totalPrice))}</span>
            </div>
          </div>

          {/* Update Status */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Update Status:</span>
            {updatingOrderId === order.id ? (
              <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm">
                <Loader2 className="w-3 h-3 animate-spin" />
                Updating…
              </div>
            ) : (
              <Select
                value={order.orderStatus}
                onValueChange={(val) => onStatusChange(order.id, val)}
              >
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminOrdersManagement({ passcode }: Props) {
  const { data: orders, isLoading, isError } = useGetOrders(passcode);
  const updateStatus = useUpdateOrderStatus();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateStatus.mutateAsync({ passcode, orderId, status });
      // Update selected order in modal if open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => prev ? { ...prev, orderStatus: status } : prev);
      }
      toast.success("Order status updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const sortedOrders = orders
    ? [...orders].sort((a, b) => Number(b.orderDate) - Number(a.orderDate))
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Orders ({orders?.length ?? 0})
        </h2>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-muted-foreground">
          Failed to load orders. Please refresh.
        </div>
      )}

      {!isLoading && !isError && orders && orders.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No orders yet.
        </div>
      )}

      {!isLoading && !isError && sortedOrders.length > 0 && (
        <div className="space-y-4">
          {sortedOrders.map((order) => {
            const statusColor =
              STATUS_COLORS[order.orderStatus] ?? "bg-gray-100 text-gray-800";
            return (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => setSelectedOrder(order)}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerName || "—"} · {order.email || "—"}
                    </p>
                    {order.phone && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📞 {order.phone}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatOrderDate(order.orderDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <span className="font-bold text-foreground">
                      {formatINR(Number(order.totalPrice))}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}
                    >
                      {order.orderStatus.charAt(0).toUpperCase() +
                        order.orderStatus.slice(1)}
                    </span>
                    <div className="relative">
                      {updatingOrderId === order.id ? (
                        <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Updating…
                        </div>
                      ) : (
                        <Select
                          value={order.orderStatus}
                          onValueChange={(val) =>
                            handleStatusChange(order.id, val)
                          }
                        >
                          <SelectTrigger className="w-36 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-xs">
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="border-t border-border pt-3 space-y-1">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm text-muted-foreground"
                    >
                      <span>
                        {item.title} × {String(item.quantity)}
                      </span>
                      <span>
                        {formatINR(Number(item.price) * Number(item.quantity))}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <div className="border-t border-border pt-3 mt-3">
                  <p className="text-xs text-muted-foreground">
                    📦 {buildFullAddress(order)}
                  </p>
                </div>

                <p className="text-xs text-primary mt-2 font-medium">
                  Click to view full details →
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      <OrderDetailModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        passcode={passcode}
        onStatusChange={handleStatusChange}
        updatingOrderId={updatingOrderId}
      />
    </div>
  );
}
