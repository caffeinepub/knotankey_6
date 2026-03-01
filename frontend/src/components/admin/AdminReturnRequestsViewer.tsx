import { useGetReturnRequests } from "@/hooks/useQueries";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

interface Props {
  passcode: string;
}

const REASON_COLORS: Record<string, string> = {
  "Damaged / Defective Item": "destructive",
  "Wrong Item Received": "destructive",
  "Item Not as Described": "secondary",
  "Changed My Mind": "outline",
  Other: "outline",
};

export default function AdminReturnRequestsViewer({ passcode }: Props) {
  const { data: returnRequests, isLoading, isError } = useGetReturnRequests(passcode);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Return Requests ({returnRequests?.length ?? 0})
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
          Failed to load return requests. Please refresh.
        </div>
      )}

      {!isLoading && !isError && returnRequests && returnRequests.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No return requests yet.
        </div>
      )}

      {!isLoading && !isError && returnRequests && returnRequests.length > 0 && (
        <div className="space-y-4">
          {[...returnRequests]
            .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
            .map((req) => (
              <div
                key={req.id}
                className="bg-card border border-border rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <RotateCcw className="w-4 h-4 text-muted-foreground" />
                      <p className="font-semibold text-foreground text-sm">
                        {req.id}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Order: <span className="font-medium text-foreground">{req.orderId}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Email: <span className="font-medium text-foreground">{req.email}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant={
                        (REASON_COLORS[req.reason] as "destructive" | "secondary" | "outline" | "default") ?? "outline"
                      }
                      className="text-xs"
                    >
                      {req.reason}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        Number(req.createdAt) / 1_000_000
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {req.description && (
                  <div className="border-t border-border pt-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {req.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
