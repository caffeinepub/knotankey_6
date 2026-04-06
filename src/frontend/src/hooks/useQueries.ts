import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CustomOrderRequest,
  ExternalBlob,
  Order,
  Product,
  ReturnRequest,
  Review,
} from "../backend";
import { useActor } from "./useActor";

// ─── Products ────────────────────────────────────────────────────────────────

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGetBestSellers() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ["bestSellers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBestSellers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGetProductById(productId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor || !productId) return null;
      try {
        return await actor.getProductById(productId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!productId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useGetCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<string[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
    // Shorter stale time so new categories appear quickly after admin adds products
    staleTime: 1000 * 30,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      passcode,
      product,
    }: {
      passcode: string;
      product: Product;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createProduct(passcode, product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["bestSellers"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      passcode,
      product,
    }: {
      passcode: string;
      product: Product;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateProduct(passcode, product);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["bestSellers"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({
        queryKey: ["product", variables.product.id],
      });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      passcode,
      productId,
    }: {
      passcode: string;
      productId: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteProduct(passcode, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["bestSellers"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useGetOrders(passcode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders", passcode],
    queryFn: async () => {
      if (!actor || !passcode) return [];
      return actor.getOrders(passcode);
    },
    enabled: !!actor && !isFetching && !!passcode,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
}

export function useGetOrderById(orderId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order | null>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor || !orderId) return null;
      try {
        return await actor.getOrderById(orderId);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!orderId,
    staleTime: 1000 * 60,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createOrder(order);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"], exact: false });
    },
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      passcode,
      orderId,
      status,
    }: {
      passcode: string;
      orderId: string;
      status: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateOrderStatus(passcode, orderId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"], exact: false });
    },
  });
}

// ─── Custom Orders ────────────────────────────────────────────────────────────

export function useGetCustomOrders(passcode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<CustomOrderRequest[]>({
    queryKey: ["customOrders", passcode],
    queryFn: async () => {
      if (!actor || !passcode) return [];
      return actor.getCustomOrderRequests(passcode);
    },
    enabled: !!actor && !isFetching && !!passcode,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
}

export function useCreateCustomOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: CustomOrderRequest) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createCustomOrderRequest(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customOrders"],
        exact: false,
      });
    },
  });
}

// ─── Return Requests ──────────────────────────────────────────────────────────

export function useGetReturnRequests(passcode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ReturnRequest[]>({
    queryKey: ["returnRequests", passcode],
    queryFn: async () => {
      if (!actor || !passcode) return [];
      return actor.getReturnRequests(passcode);
    },
    enabled: !!actor && !isFetching && !!passcode,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
}

export function useCreateReturnRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderNumber,
      customerName,
      email,
      reason,
      message,
      video,
    }: {
      orderNumber: string;
      customerName: string;
      email: string;
      reason: string;
      message: string;
      video: ExternalBlob;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.createReturnRequest(
        orderNumber,
        customerName,
        email,
        reason,
        message,
        video,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["returnRequests"],
        exact: false,
      });
    },
  });
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export function useGetApprovedReviews() {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["approvedReviews"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getApprovedReviews();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60,
  });
}

export function useGetApprovedReviewsByProduct(productId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["approvedReviews", productId],
    queryFn: async () => {
      if (!actor || !productId) return [];
      return actor.getApprovedReviewsByProduct(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
    staleTime: 1000 * 60,
  });
}

export function useGetAllReviews(passcode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Review[]>({
    queryKey: ["allReviews", passcode],
    queryFn: async () => {
      if (!actor || !passcode) return [];
      return actor.getAllReviews(passcode);
    },
    enabled: !!actor && !isFetching && !!passcode,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
  });
}

export function useSubmitReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (review: Review) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.submitReview(review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["approvedReviews"],
        exact: false,
      });
    },
  });
}

export function useApproveReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ passcode, id }: { passcode: string; id: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.approveReview(passcode, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReviews"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["approvedReviews"],
        exact: false,
      });
    },
  });
}

export function useRejectReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ passcode, id }: { passcode: string; id: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.rejectReview(passcode, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReviews"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["approvedReviews"],
        exact: false,
      });
    },
  });
}

export function useDeleteReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ passcode, id }: { passcode: string; id: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.deleteReview(passcode, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReviews"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["approvedReviews"],
        exact: false,
      });
    },
  });
}

export function useUpdateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      passcode,
      review,
    }: { passcode: string; review: Review }) => {
      if (!actor) throw new Error("Actor not initialized");
      return actor.updateReview(passcode, review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allReviews"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["approvedReviews"],
        exact: false,
      });
    },
  });
}
