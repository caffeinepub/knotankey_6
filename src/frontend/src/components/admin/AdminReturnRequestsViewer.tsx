import type { ReturnRequest } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetReturnRequests } from "@/hooks/useQueries";
import { Download, RefreshCw, RotateCcw } from "lucide-react";

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

function ReturnRequestCard({ req }: { req: ReturnRequest }) {
  const videoUrl = req.video?.getDirectURL?.() ?? null;

  const handleDownload = async () => {
    try {
      // Prefer direct URL download — avoids loading large video bytes into memory
      const directUrl = req.video?.getDirectURL?.();
      if (directUrl) {
        const a = document.createElement("a");
        a.href = directUrl;
        a.download = `return-${req.orderNumber}-video.mp4`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
      // Fallback: fetch raw bytes and create a blob URL
      const bytes = await req.video.getBytes();
      const blob = new Blob([bytes], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `return-${req.orderNumber}-video.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download video:", err);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
            <p className="font-semibold text-foreground text-sm">
              Order: {req.orderNumber}
            </p>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Customer:{" "}
            <span className="font-medium text-foreground">
              {req.customerName}
            </span>
          </p>
          <p className="text-sm text-muted-foreground">
            Email:{" "}
            <span className="font-medium text-foreground">{req.email}</span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={
              (REASON_COLORS[req.reason] as
                | "destructive"
                | "secondary"
                | "outline"
                | "default") ?? "outline"
            }
            className="text-xs"
          >
            {req.reason}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {new Date(Number(req.createdAt) / 1_000_000).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
              },
            )}
          </p>
        </div>
      </div>

      {req.message && (
        <div className="border-t border-border pt-3 mb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Message
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {req.message}
          </p>
        </div>
      )}

      {videoUrl && (
        <div className="border-t border-border pt-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Condition Video
          </p>
          <video
            src={videoUrl}
            controls
            crossOrigin="anonymous"
            className="w-full rounded-lg max-h-56 bg-black"
          >
            <track kind="captions" />
          </video>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download Video
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AdminReturnRequestsViewer({ passcode }: Props) {
  const {
    data: returnRequests,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetReturnRequests(passcode);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Return Requests ({returnRequests?.length ?? 0})
        </h2>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => refetch()}
          disabled={isFetching}
          data-ocid="returns.secondary_button"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
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
          Failed to load return requests. Please refresh.
        </div>
      )}

      {!isLoading &&
        !isError &&
        returnRequests &&
        returnRequests.length === 0 && (
          <div className="text-center py-10 text-muted-foreground">
            No return requests yet.
          </div>
        )}

      {!isLoading &&
        !isError &&
        returnRequests &&
        returnRequests.length > 0 && (
          <div className="space-y-4">
            {[...returnRequests]
              .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
              .map((req) => (
                <ReturnRequestCard key={req.orderNumber} req={req} />
              ))}
          </div>
        )}
    </div>
  );
}
