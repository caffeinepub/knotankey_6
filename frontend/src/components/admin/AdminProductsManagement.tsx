import { useState } from "react";
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useQueries";
import { ExternalBlob } from "@/backend";
import type { Product } from "@/backend";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { formatINR } from "@/utils/currency";
import { Plus, Pencil, Trash2, Loader2, Upload, Star } from "lucide-react";
import { toast } from "sonner";

interface Props {
  passcode: string;
}

const emptyForm = {
  title: "",
  description: "",
  price: "",
  category: "",
  bestseller: false,
};

export default function AdminProductsManagement({ passcode }: Props) {
  const { data: products, isLoading, isError } = useGetProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const openAddDialog = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setForm({
      title: product.title,
      description: product.description,
      price: String(Number(product.price)),
      category: product.category,
      bestseller: product.bestseller,
    });
    setImageFile(null);
    setImagePreview(product.image.getDirectURL());
    setDialogOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let image: ExternalBlob;

    if (imageFile) {
      const arrayBuffer = await imageFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      image = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setUploadProgress(pct)
      );
    } else if (editingProduct) {
      image = editingProduct.image;
    } else {
      toast.error("Please upload a product image.");
      return;
    }

    const product: Product = {
      id: editingProduct?.id ?? `PROD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      title: form.title,
      description: form.description,
      price: BigInt(Math.round(Number(form.price))),
      image,
      category: form.category.trim(),
      bestseller: form.bestseller,
      createdAt: editingProduct?.createdAt ?? BigInt(Date.now()) * BigInt(1_000_000),
    };

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ passcode, product });
        toast.success("Product updated successfully!");
      } else {
        await createProduct.mutateAsync({ passcode, product });
        toast.success("Product added successfully!");
      }
      setDialogOpen(false);
      setUploadProgress(null);
    } catch (err) {
      console.error(err);
      setUploadProgress(null);
      toast.error("Failed to save product. Please try again.");
    }
  };

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct.mutateAsync({ passcode, productId });
      toast.success("Product deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product.");
    }
  };

  const isSaving = createProduct.isPending || updateProduct.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Products ({products?.length ?? 0})
        </h2>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-10 text-muted-foreground">
          Failed to load products. Please refresh.
        </div>
      )}

      {!isLoading && !isError && products && products.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No products yet. Add your first product!
        </div>
      )}

      {!isLoading && !isError && products && products.length > 0 && (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 bg-card border border-border rounded-xl p-4"
            >
              <img
                src={product.image.getDirectURL()}
                alt={product.title}
                className="w-16 h-16 object-cover rounded-lg shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-foreground truncate">
                    {product.title}
                  </p>
                  {product.bestseller && (
                    <Badge variant="default" className="gap-1 text-xs">
                      <Star className="w-3 h-3 fill-current" />
                      Best Seller
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {product.category} · {formatINR(Number(product.price))}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEditDialog(product)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{product.title}". This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(product.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {deleteProduct.isPending ? (
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
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                required
                placeholder="Handcrafted Crochet Blanket"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                rows={3}
                placeholder="Describe the product…"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  Price (₹) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1"
                  value={form.price}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, price: e.target.value }))
                  }
                  required
                  placeholder="999"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  required
                  placeholder="e.g. keychains, plushies…"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="bestseller"
                checked={form.bestseller}
                onCheckedChange={(checked) =>
                  setForm((p) => ({ ...p, bestseller: checked }))
                }
              />
              <Label htmlFor="bestseller" className="cursor-pointer">
                Mark as Best Seller
              </Label>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>
                Product Image{" "}
                {!editingProduct && <span className="text-destructive">*</span>}
              </Label>
              {imagePreview ? (
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(
                        editingProduct
                          ? editingProduct.image.getDirectURL()
                          : null
                      );
                    }}
                    className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary transition-colors bg-secondary/20">
                  <Upload className="w-5 h-5 text-muted-foreground mb-1" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadProgress !== null
                      ? `Uploading ${uploadProgress}%`
                      : "Saving…"}
                  </>
                ) : editingProduct ? (
                  "Save Changes"
                ) : (
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
