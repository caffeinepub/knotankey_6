import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrders, useUpdateOrderStatus } from "@/hooks/useQueries";
import { formatINR } from "@/utils/currency";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

const _STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrdersManagement({ passcode }: Props) {
  const { data: orders, isLoading, isError } = useGetOrders(passcode);
  const updateStatus = useUpdateOrderStatus();
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateStatus.mutateAsync({ passcode, orderId, status });
      toast.success("Order status updated.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Orders ({orders?.length ?? 0})
        </h2>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {(["s0", "s1", "s2", "s3"] as const).map((k) => (
            <Skeleton key={k} className="h-28 w-full rounded-xl" />
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

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="space-y-4">
          {[...orders]
            .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
            .map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {order.id}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customerInfo.fullName} · {order.customerInfo.email}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(
                        Number(order.createdAt) / 1_000_000,
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-foreground">
                      {formatINR(Number(order.total))}
                    </span>
                    <div className="relative">
                      {updatingOrderId === order.id ? (
                        <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-md text-sm">
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Updating…
                        </div>
                      ) : (
                        <Select
                          value={order.status}
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
                      key={`${item.productId}-${idx}`}
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
                    📦 {order.customerInfo.address}, {order.customerInfo.city},{" "}
                    {order.customerInfo.postalCode},{" "}
                    {order.customerInfo.country} · 📞 {order.customerInfo.phone}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
