import { useState } from 'react';
import { useGetProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../hooks/useQueries';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Star, StarOff, Loader2, X, Check } from 'lucide-react';
import { ExternalBlob } from '../../backend';
import type { Product } from '../../backend';
import { formatINR } from '../../utils/currency';

interface AdminProductsManagementProps {
  passcode: string;
}

interface ProductFormState {
  title: string;
  description: string;
  price: string;
  category: string;
  bestseller: boolean;
}

const EMPTY_FORM: ProductFormState = {
  title: '',
  description: '',
  price: '',
  category: '',
  bestseller: false,
};

function ProductForm({
  initial,
  onSubmit,
  onCancel,
  isPending,
  submitLabel,
}: {
  initial: ProductFormState;
  onSubmit: (data: ProductFormState, imageFile: File | null) => void;
  onCancel: () => void;
  isPending: boolean;
  submitLabel: string;
}) {
  const [form, setForm] = useState<ProductFormState>(initial);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = ev => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const update = (field: keyof ProductFormState, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-cream-50 rounded-2xl border border-cream-300 p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-1 block">Title *</Label>
          <Input
            value={form.title}
            onChange={e => update('title', e.target.value)}
            placeholder="Product title"
            className="bg-white border-cream-300 rounded-xl font-sans text-sm text-warm-brown"
          />
        </div>
        <div>
          <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-1 block">Category *</Label>
          <Input
            value={form.category}
            onChange={e => update('category', e.target.value)}
            placeholder="e.g. blanket, bag, shawl"
            className="bg-white border-cream-300 rounded-xl font-sans text-sm text-warm-brown"
          />
        </div>
        <div>
          <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-1 block">Price (₹) *</Label>
          <Input
            type="number"
            min="0"
            step="1"
            value={form.price}
            onChange={e => update('price', e.target.value)}
            placeholder="e.g. 899"
            className="bg-white border-cream-300 rounded-xl font-sans text-sm text-warm-brown"
          />
        </div>
        <div className="flex items-center gap-3 pt-5">
          <input
            type="checkbox"
            id="bestseller-check"
            checked={form.bestseller}
            onChange={e => update('bestseller', e.target.checked)}
            className="w-4 h-4 accent-warm-brown"
          />
          <Label htmlFor="bestseller-check" className="font-sans text-sm text-warm-brown cursor-pointer">
            Mark as Bestseller
          </Label>
        </div>
      </div>

      <div>
        <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-1 block">Description *</Label>
        <Textarea
          value={form.description}
          onChange={e => update('description', e.target.value)}
          placeholder="Product description"
          rows={3}
          className="bg-white border-cream-300 rounded-xl font-sans text-sm text-warm-brown resize-none"
        />
      </div>

      <div>
        <Label className="font-sans text-xs tracking-wider uppercase text-warm-tan mb-1 block">Product Image</Label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="font-sans text-sm text-warm-tan file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-cream-200 file:text-warm-brown file:font-sans file:text-xs file:cursor-pointer"
          />
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="w-12 h-12 rounded-xl object-cover border border-cream-300" />
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => onSubmit(form, imageFile)}
          disabled={isPending}
          className="flex items-center gap-2 py-2.5 px-5 bg-warm-brown text-cream-50 font-sans text-xs tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300 disabled:opacity-60"
        >
          {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 py-2.5 px-5 border border-cream-300 text-warm-tan font-sans text-xs tracking-wider uppercase rounded-full hover:bg-cream-200 transition-all duration-300"
        >
          <X className="w-3.5 h-3.5" />
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminProductsManagement({ passcode }: AdminProductsManagementProps) {
  const { data: products = [], isLoading } = useGetProducts();
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const buildProductFromForm = async (
    form: ProductFormState,
    imageFile: File | null,
    existingProduct?: Product
  ): Promise<Product> => {
    let image: ExternalBlob;
    if (imageFile) {
      const buf = await imageFile.arrayBuffer();
      image = ExternalBlob.fromBytes(new Uint8Array(buf));
    } else if (existingProduct) {
      image = existingProduct.image;
    } else {
      // Minimal 1x1 transparent PNG as placeholder
      const placeholder = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82,
        0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222,
        0, 0, 0, 12, 73, 68, 65, 84, 8, 215, 99, 248, 207, 192, 0, 0, 0,
        2, 0, 1, 226, 33, 188, 51, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
      ]);
      image = ExternalBlob.fromBytes(placeholder);
    }

    return {
      id: existingProduct?.id ?? `PROD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      title: form.title,
      description: form.description,
      price: BigInt(Math.round(parseFloat(form.price) * 100)),
      category: form.category,
      bestseller: form.bestseller,
      image,
      createdAt: existingProduct?.createdAt ?? BigInt(Date.now()) * BigInt(1_000_000),
    };
  };

  const handleCreate = async (form: ProductFormState, imageFile: File | null) => {
    if (!form.title || !form.description || !form.price || !form.category) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const priceVal = parseFloat(form.price);
    if (isNaN(priceVal) || priceVal < 0) {
      toast.error('Please enter a valid price.');
      return;
    }
    try {
      const product = await buildProductFromForm(form, imageFile);
      await createProduct({ passcode, product });
      toast.success('Product created successfully!');
      setShowAddForm(false);
    } catch (err) {
      console.error('Create product error:', err);
      toast.error('Failed to create product. Please try again.');
    }
  };

  const handleUpdate = async (form: ProductFormState, imageFile: File | null, existing: Product) => {
    if (!form.title || !form.description || !form.price || !form.category) {
      toast.error('Please fill in all required fields.');
      return;
    }
    try {
      const product = await buildProductFromForm(form, imageFile, existing);
      await updateProduct({ passcode, product });
      toast.success('Product updated!');
      setEditingId(null);
    } catch (err) {
      console.error('Update product error:', err);
      toast.error('Failed to update product.');
    }
  };

  const handleDelete = (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    deleteProduct({ passcode, productId }, {
      onSuccess: () => toast.success('Product deleted.'),
      onError: () => toast.error('Failed to delete product.'),
    });
  };

  const handleToggleBestseller = (product: Product) => {
    updateProduct(
      { passcode, product: { ...product, bestseller: !product.bestseller } },
    ).then(() => {
      toast.success(`Bestseller ${product.bestseller ? 'removed' : 'marked'}!`);
    }).catch(() => {
      toast.error('Failed to update product.');
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-warm-brown">Products ({products.length})</h2>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 py-2.5 px-5 bg-warm-brown text-cream-50 font-sans text-xs tracking-wider uppercase rounded-full btn-luxury hover:bg-warm-tan transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-6">
          <h3 className="font-serif text-lg text-warm-brown mb-3">New Product</h3>
          <ProductForm
            initial={EMPTY_FORM}
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
            isPending={isCreating}
            submitLabel="Create Product"
          />
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-sans text-warm-tan text-sm tracking-wider">No products yet. Add your first product above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => {
            const isEditing = editingId === product.id;
            const imageUrl = product.image?.getDirectURL?.();

            return (
              <div key={product.id} className="bg-cream-50 rounded-2xl border border-cream-300 overflow-hidden">
                {isEditing ? (
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-warm-brown mb-3">Edit Product</h3>
                    <ProductForm
                      initial={{
                        title: product.title,
                        description: product.description,
                        price: (Number(product.price) / 100).toFixed(0),
                        category: product.category,
                        bestseller: product.bestseller,
                      }}
                      onSubmit={(form, imageFile) => handleUpdate(form, imageFile, product)}
                      onCancel={() => setEditingId(null)}
                      isPending={isUpdating}
                      submitLabel="Save Changes"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 p-4">
                    {/* Product image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-cream-200 shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-warm-tan/40">
                          <span className="text-xs font-sans">No img</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-serif text-warm-brown text-base truncate">{product.title}</p>
                        {product.bestseller && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-warm-brown/10 text-warm-brown font-sans text-xs rounded-full">
                            <Star className="w-3 h-3 fill-warm-brown" /> Bestseller
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-xs text-warm-tan mt-0.5 capitalize">{product.category}</p>
                      <p className="font-sans text-sm text-warm-brown font-medium mt-0.5">
                        {formatINR(Number(product.price) / 100)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleBestseller(product)}
                        disabled={isUpdating}
                        title={product.bestseller ? 'Remove bestseller' : 'Mark as bestseller'}
                        className="p-2 rounded-full hover:bg-cream-200 text-warm-tan hover:text-warm-brown transition-colors disabled:opacity-50"
                      >
                        {product.bestseller
                          ? <StarOff className="w-4 h-4" />
                          : <Star className="w-4 h-4" />
                        }
                      </button>
                      <button
                        onClick={() => setEditingId(product.id)}
                        title="Edit product"
                        className="p-2 rounded-full hover:bg-cream-200 text-warm-tan hover:text-warm-brown transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={isDeleting}
                        title="Delete product"
                        className="p-2 rounded-full hover:bg-red-50 text-warm-tan hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
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
