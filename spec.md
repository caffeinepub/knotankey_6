# Specification

## Summary
**Goal:** Capture complete order data at checkout and display full order details in the admin orders management view.

**Planned changes:**
- Update the backend `Order` type in `main.mo` to include all fields: `customerName`, `email`, `phone`, `shippingAddress`, `city`, `state`, `postalCode`, `country`, `items`, `totalPrice`, `orderDate`, and `orderStatus`; update `createOrder` to accept and persist all fields
- Create a migration to upgrade existing stored orders to the new schema with safe defaults for missing fields
- Update the `CheckoutPage` form to collect and submit all new fields (name, email, phone, address, city, state, postal code, country) with basic validation
- Update `useCreateOrder` and `useGetOrders` hooks and TypeScript types to reflect the new Order schema
- Update `AdminOrdersManagement` to display all order fields (Order ID, customer name, email, phone, full address, products with quantities, total, status, date) and make each order row/card clickable to open a detail modal or expanded panel showing complete order information

**User-visible outcome:** Customers fill in a complete shipping and contact form at checkout. Admins can view all order details in the orders list and click any order to see a full detail view including shipping address, items, and contact information.
