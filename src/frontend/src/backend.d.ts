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
export interface CustomerInfo {
    country: string;
    city: string;
    postalCode: string;
    fullName: string;
    email: string;
    address: string;
    phone: string;
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
    customerInfo: CustomerInfo;
    status: string;
    total: bigint;
    shippingAmount: bigint;
    createdAt: Time;
    items: Array<OrderItem>;
    subtotal: bigint;
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
export interface backendInterface {
    addCategory(passcode: string, category: string): Promise<void>;
    addToWishlist(email: string, productId: string): Promise<void>;
    createCustomOrderRequest(request: CustomOrderRequest): Promise<void>;
    createOrder(order: Order): Promise<string>;
    createProduct(passcode: string, product: Product): Promise<void>;
    createReturnRequest(orderNumber: string, customerName: string, email: string, reason: string, message: string, video: ExternalBlob): Promise<void>;
    deleteProduct(passcode: string, productId: string): Promise<void>;
    filterProductsByCategory(category: string): Promise<Array<Product>>;
    getBestSellers(): Promise<Array<Product>>;
    getCategories(): Promise<Array<string>>;
    getCustomOrderRequests(passcode: string): Promise<Array<CustomOrderRequest>>;
    getOrderById(orderId: string): Promise<Order>;
    getOrders(passcode: string): Promise<Array<Order>>;
    getProductById(productId: string): Promise<Product>;
    getProducts(): Promise<Array<Product>>;
    getReturnRequests(passcode: string): Promise<Array<ReturnRequest>>;
    getWishlist(email: string): Promise<Array<WishlistItem>>;
    removeCategory(passcode: string, category: string): Promise<void>;
    removeFromWishlist(email: string, productId: string): Promise<void>;
    updateOrderStatus(passcode: string, orderId: string, status: string): Promise<void>;
    updateProduct(passcode: string, product: Product): Promise<void>;
}
