import type { Review } from "@/backend";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useApproveReview,
  useDeleteReview,
  useGetAllReviews,
  useRejectReview,
  useUpdateReview,
} from "@/hooks/useQueries";
import {
  Check,
  Loader2,
  Pencil,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  passcode: string;
}

type StatusFilter = "all" | "pending" | "approved" | "rejected";

function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved")
    return (
      <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
        Approved
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
      Pending
    </Badge>
  );
}

export default function AdminReviewsManagement({ passcode }: Props) {
  const {
    data: reviews,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetAllReviews(passcode);
  const approveReview = useApproveReview();
  const rejectReview = useRejectReview();
  const deleteReview = useDeleteReview();
  const updateReview = useUpdateReview();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [productFilter, setProductFilter] = useState("all");

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    message: "",
    rating: 0,
  });

  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      name: review.name,
      message: review.message,
      rating: Number(review.rating),
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingReview) return;
    try {
      await updateReview.mutateAsync({
        passcode,
        review: {
          ...editingReview,
          name: editForm.name,
          message: editForm.message,
          rating: BigInt(editForm.rating),
        },
      });
      toast.success("Review updated.");
      setEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update review.");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await approveReview.mutateAsync({ passcode, id });
      toast.success("Review approved.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve review.");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview.mutateAsync({ passcode, id });
      toast.success("Review rejected.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject review.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview.mutateAsync({ passcode, id });
      toast.success("Review deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete review.");
    }
  };

  // Unique product names from loaded reviews
  const productNames = reviews
    ? [...new Set(reviews.map((r) => r.productName).filter(Boolean))].sort()
    : [];

  const filtered = (reviews ?? []).filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (productFilter !== "all" && r.productName !== productFilter)
      return false;
    return true;
  });

  return (
    <div>
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Reviews ({filtered.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-2 self-start sm:self-auto"
          data-ocid="reviews.secondary_button"
        >
          {isFetching ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Status filter tabs */}
        <div
          className="flex gap-1 bg-secondary/50 rounded-lg p-1"
          data-ocid="reviews.panel"
        >
          {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map(
            (s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize ${
                  statusFilter === s
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid={"reviews.tab"}
              >
                {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ),
          )}
        </div>

        {/* Product filter */}
        {productNames.length > 0 && (
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger className="w-52" data-ocid="reviews.select">
              <SelectValue placeholder="All Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              {productNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3" data-ocid="reviews.loading_state">
          {["s0", "s1", "s2"].map((k) => (
            <Skeleton key={k} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div
          className="text-center py-10 text-muted-foreground"
          data-ocid="reviews.error_state"
        >
          Failed to load reviews. Click Refresh to try again.
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="reviews.empty_state"
        >
          {reviews?.length === 0
            ? "No reviews yet."
            : "No reviews match the selected filter."}
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="space-y-3" data-ocid="reviews.table">
          {filtered.map((review, idx) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-xl p-4"
              data-ocid={`reviews.item.${idx + 1}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Left: info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">
                      {review.productName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      · {review.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-muted-foreground">
                      by {review.name}
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= Number(review.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <StatusBadge status={review.status} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {review.message.length > 60
                      ? `${review.message.slice(0, 60)}…`
                      : review.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(
                      Number(review.createdAt / BigInt(1_000_000)),
                    ).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {review.status !== "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-green-700 border-green-300 hover:bg-green-50 text-xs"
                      onClick={() => handleApprove(review.id)}
                      disabled={approveReview.isPending}
                      data-ocid="reviews.confirm_button"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                  )}
                  {review.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-700 border-red-300 hover:bg-red-50 text-xs"
                      onClick={() => handleReject(review.id)}
                      disabled={rejectReview.isPending}
                      data-ocid="reviews.cancel_button"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditDialog(review)}
                    data-ocid="reviews.edit_button"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        data-ocid="reviews.delete_button"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent data-ocid="reviews.dialog">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Review?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently remove this review. This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel data-ocid="reviews.cancel_button">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(review.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          data-ocid="reviews.confirm_button"
                        >
                          {deleteReview.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md" data-ocid="reviews.dialog">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Customer Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="reviews.input"
              />
            </div>
            <div className="space-y-2">
              <Label>Rating</Label>
              <StarSelector
                value={editForm.rating}
                onChange={(v) => setEditForm((p) => ({ ...p, rating: v }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-message">Review Message</Label>
              <Textarea
                id="edit-message"
                value={editForm.message}
                onChange={(e) =>
                  setEditForm((p) => ({ ...p, message: e.target.value }))
                }
                rows={4}
                data-ocid="reviews.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              data-ocid="reviews.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateReview.isPending}
              className="gap-2"
              data-ocid="reviews.save_button"
            >
              {updateReview.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
