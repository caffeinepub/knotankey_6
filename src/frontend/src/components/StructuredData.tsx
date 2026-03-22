import { useEffect } from "react";

interface ProductStructuredDataProps {
  name: string;
  description: string;
  /** One or more image URLs for this product */
  images: string[];
  price: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock";
  url: string;
  /** Optional product SKU / ID (used as @id and sku field) */
  sku?: string;
}

/**
 * Injects a Schema.org Product JSON-LD script tag into <head>.
 * Removed and recreated whenever product data changes.
 * Returns null — renders nothing visible.
 */
export default function ProductStructuredData({
  name,
  description,
  images,
  price,
  currency = "INR",
  availability = "InStock",
  url,
  sku,
}: ProductStructuredDataProps) {
  useEffect(() => {
    const existing = document.getElementById("product-structured-data");
    if (existing) existing.remove();

    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      ...(sku ? { "@id": url, sku } : {}),
      name,
      description,
      image: images,
      brand: {
        "@type": "Brand",
        name: "Knotankey",
      },
      offers: {
        "@type": "Offer",
        url,
        price: price.toFixed(2),
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
        itemCondition: "https://schema.org/NewCondition",
        seller: {
          "@type": "Organization",
          name: "Knotankey",
        },
      },
    };

    const script = document.createElement("script");
    script.id = "product-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      document.getElementById("product-structured-data")?.remove();
    };
  }, [name, description, images, price, currency, availability, url, sku]);

  return null;
}
