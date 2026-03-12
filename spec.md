# knotankey

## Current State
The site has basic meta tags in `index.html` (title, description, OG tags, Twitter card). No sitemap, no robots.txt, no per-page dynamic meta tags, no structured data, and product images use generic alt text.

## Requested Changes (Diff)

### Add
- `public/sitemap.xml` — valid XML sitemap with all static pages
- `public/robots.txt` — with User-agent: *, Allow: /, Sitemap directive
- `src/utils/seo.ts` — helper to dynamically update document title + meta tags
- `src/hooks/useSEO.ts` — React hook wrapping the seo helper, called on every page
- JSON-LD structured data component for product pages (Product schema)
- Per-page SEO: HomePage, ProductsPage, ProductDetailPage, ReturnsPage, CustomOrderPage, CartPage, CheckoutPage
- Descriptive alt text on all product images in ProductCard and ProductDetailPage

### Modify
- `ProductDetailPage.tsx` — call useSEO with product name/description/image, add JSON-LD, improve alt text
- `ProductCard.tsx` — descriptive alt text for product images
- `HomePage.tsx` — call useSEO with homepage meta
- `ProductsPage.tsx` — call useSEO
- `ReturnsPage.tsx` — call useSEO
- `CustomOrderPage.tsx` — call useSEO
- `CartPage.tsx` — call useSEO
- `CheckoutPage.tsx` — call useSEO

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/public/robots.txt`
2. Create `src/frontend/public/sitemap.xml` with all static page URLs
3. Create `src/frontend/src/utils/seo.ts` — function to set document.title and update/create meta tags (description, OG title/desc/image/url, twitter tags, canonical)
4. Create `src/frontend/src/components/StructuredData.tsx` — renders JSON-LD script tag for Product schema
5. Update ProductDetailPage: call useSEO, render StructuredData, fix alt text
6. Update ProductCard: descriptive alt text using product.title
7. Update all other pages with appropriate useSEO calls
