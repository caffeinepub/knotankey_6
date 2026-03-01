import { useGetCustomOrders } from "@/hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface Props {
  passcode: string;
}

export default function AdminCustomOrdersViewer({ passcode }: Props) {
  const { data: customOrders, isLoading, isError } = useGetCustomOrders(passcode);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Custom Order Requests ({customOrders?.length ?? 0})
        </h2>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-muted-foreground">
          Failed to load custom orders. Please refresh.
        </div>
      )}

      {!isLoading && !isError && customOrders && customOrders.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No custom order requests yet.
        </div>
      )}

      {!isLoading && !isError && customOrders && customOrders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...customOrders]
            .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
            .map((order) => {
              const imageUrl = order.inspirationImage.getDirectURL();
              const hasImage = imageUrl && imageUrl.length > 0;

              return (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground text-sm">
                        {order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          Number(order.createdAt) / 1_000_000
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Custom
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Type</p>
                      <p className="font-medium text-foreground">
                        {order.productType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="font-medium text-foreground">{order.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Color</p>
                      <p className="font-medium text-foreground">
                        {order.colorPreference || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-medium text-foreground">
                        {order.budgetRange}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Email</p>
                    <p className="text-sm font-medium text-foreground">
                      {order.email}
                    </p>
                  </div>

                  {order.description && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Description
                      </p>
                      <p className="text-sm text-foreground leading-relaxed line-clamp-3">
                        {order.description}
                      </p>
                    </div>
                  )}

                  {hasImage && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Inspiration Image
                      </p>
                      <img
                        src={imageUrl}
                        alt="Inspiration"
                        className="w-full h-32 object-cover rounded-lg border border-border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
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
