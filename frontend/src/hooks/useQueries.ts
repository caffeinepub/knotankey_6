import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Order, CustomOrderRequest, ReturnRequest } from '../backend';

export function useGetProducts() {
  const { actor, isFetching } = useActor();
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProductById(productId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getProductById(productId);
    },
    enabled: !!actor && !isFetching && !!productId,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ passcode, product }: { passcode: string; product: Product }) => {
      if (!actor) throw new Error('No actor');
      return actor.createProduct(passcode, product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ passcode, product }: { passcode: string; product: Product }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateProduct(passcode, product);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ passcode, productId }: { passcode: string; productId: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteProduct(passcode, productId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error('No actor');
      return actor.createOrder(order);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useGetOrders(passcode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ['orders', passcode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders(passcode);
    },
    enabled: !!actor && !isFetching && !!passcode,
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ passcode, orderId, status }: { passcode: string; orderId: string; status: string }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateOrderStatus(passcode, orderId, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useCreateCustomOrderRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (request: CustomOrderRequest) => {
      if (!actor) throw new Error('No actor');
      return actor.createCustomOrderRequest(request);
    },
  });
}

export function useGetCustomOrderRequests(passcode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<CustomOrderRequest[]>({
    queryKey: ['customOrders', passcode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCustomOrderRequests(passcode);
    },
    enabled: !!actor && !isFetching && !!passcode,
  });
}

export function useCreateReturnRequest() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (request: ReturnRequest) => {
      if (!actor) throw new Error('No actor');
      return actor.createReturnRequest(request);
    },
  });
}

export function useGetReturnRequests(passcode: string) {
  const { actor, isFetching } = useActor();
  return useQuery<ReturnRequest[]>({
    queryKey: ['returnRequests', passcode],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReturnRequests(passcode);
    },
    enabled: !!actor && !isFetching && !!passcode,
  });
}

export function useSubscribeToNewsletter() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('No actor');
      return actor.subscribeToNewsletter(email);
    },
  });
}
