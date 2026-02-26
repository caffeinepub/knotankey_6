# Specification

## Summary
**Goal:** Build "knotankey," a full-stack soft luxury crochet e-commerce website with a Motoko backend and a React + TypeScript frontend.

**Planned changes:**

### Backend (Motoko — single actor)
- Store and persist: products, orders, custom order requests, return requests, and newsletter subscribers in stable variables
- Seed 8 sample products on initialization
- Expose CRUD for products, order creation/status update, custom order submission (with base64 image), return request submission, and newsletter subscription
- Protect all admin write operations with hardcoded passcode `knotankey_admin_2026`

### Frontend (React + TypeScript + React Router)
- Global loading screen with spinning yarn animation on initial app load
- **Navbar:** sticky frosted-glass bar with knotankey wordmark, nav links (Home, Products, Custom Order, Returns), cart icon with item count badge, and music toggle button
- **Footer:** Instagram/Pinterest links, contact info, Returns policy link, newsletter signup form (saves email to backend)
- **Background music toggle:** mute/unmute button wired to `/assets/music/background.mp3` placeholder — no autoplay, icon transitions between states
- **Homepage (`/`):** full-viewport parallax hero with warm crochet background image, brand heading, tagline, Shop Now CTA, and subtle floating yarn/orb particle animation; Best Sellers section (4 products from backend); About section with scroll fade-in; CTA banner
- **All Products (`/products`):** responsive grid, client-side filtering (category, price range, bestseller toggle) and sorting (price asc/desc, newest)
- **Product Detail (`/products/:id`):** large image with hover zoom, title, price, description, quantity selector, Add to Cart (with confirmation animation), Buy Now
- **Cart system:** React Context + localStorage persistence; cart page with image, title, price, quantity selector, remove button, subtotals, total, Proceed to Checkout; slide-in drawer from the right accessible via navbar icon
- **Checkout (`/checkout`):** two-column layout — customer info form (with validation) + order summary; mocked payment with clearly commented Stripe placeholder; submits order to backend, clears cart, redirects to thank-you
- **Thank You (`/checkout/thank-you`):** order confirmation with elegant animation
- **Custom Order (`/custom-order`):** form with product type, color, size, description, inspiration image upload (base64), budget range, email; submits to backend with success confirmation
- **Returns (`/returns`):** policy section (7-day, unused only, custom orders non-refundable) + return request form (Order ID, Email, Reason, Description) saving to backend
- **Admin Panel (`/admin`):** passcode gate (session state only); dashboard tabs for Products (full CRUD, bestseller toggle), Orders (list + status update), Custom Order Requests (with image previews), Return Requests
- **Visual theme:** beige/cream palette (`#FAF7F2`, `#F5EFE6`), linen texture background, Playfair Display headings + DM Sans/Lato body, rounded corners, soft shadow cards, slow hover animations (lift, zoom, glow), no harsh transitions
- Use curated warm crochet-aesthetic Unsplash image URLs for all 8 seeded products, hero, and about section backgrounds

**User-visible outcome:** A fully functional soft luxury crochet storefront where visitors can browse and purchase products, submit custom orders, and request returns; admins can manage the entire catalog and order pipeline via a passcode-protected panel.
