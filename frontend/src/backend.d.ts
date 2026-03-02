import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: string;
    title: string;
    createdAt: Time;
    description: string;
    category: string;
    image: ExternalBlob;
    price: bigint;
    bestseller: boolean;
}
export interface CustomOrderRequest {
    id: string;
    inspirationImage: ExternalBlob;
    createdAt: Time;
    size: string;
    description: string;
    productType: string;
    email: string;
    colorPreference: string;
    budgetRange: string;
}
export type Time = bigint;
export interface WishlistItem {
    productId: string;
    email: string;
    addedAt: Time;
}
export interface OrderItem {
    title: string;
    productId: string;
    quantity: bigint;
    price: bigint;
}
export interface ReturnRequest {
    customerName: string;
    video: ExternalBlob;
    createdAt: Time;
    email: string;
    message: string;
    orderNumber: string;
    reason: string;
}
export interface Order {
    id: string;
    customerName: string;
    country: string;
    orderStatus: string;
    city: string;
    postalCode: string;
    orderDate: Time;
    email: string;
    state: string;
    shippingAddress: string;
    phone: string;
    items: Array<OrderItem>;
    totalPrice: bigint;
}
export interface UserProfile {
    name: string;
    email: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCategory(category: string): Promise<void>;
    addToWishlist(productId: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCustomOrderRequest(request: CustomOrderRequest): Promise<void>;
    createOrder(order: Order): Promise<string>;
    createProduct(product: Product): Promise<void>;
    createReturnRequest(orderNumber: string, customerName: string, email: string, reason: string, message: string, video: ExternalBlob): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<string>>;
    getCustomOrderRequests(): Promise<Array<CustomOrderRequest>>;
    getOrderById(orderId: string): Promise<Order>;
    getOrders(): Promise<Array<Order>>;
    getProductById(productId: string): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getReturnRequests(): Promise<Array<ReturnRequest>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWishlist(): Promise<Array<WishlistItem>>;
    isCallerAdmin(): Promise<boolean>;
    removeCategory(category: string): Promise<void>;
    removeFromWishlist(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateOrderStatus(orderId: string, status: string): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
