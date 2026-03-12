import { useEffect } from "react";

interface ProductStructuredDataProps {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  availability?: string;
  url: string;
}

export default function ProductStructuredData({
  name,
  description,
  image,
  price,
  currency = "INR",
  availability = "InStock",
  url,
}: ProductStructuredDataProps) {
  useEffect(() => {
    const existing = document.getElementById("product-structured-data");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.id = "product-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      image: [image],
      offers: {
        "@type": "Offer",
        price: price.toString(),
        priceCurrency: currency,
        availability: `https://schema.org/${availability}`,
        url,
      },
      brand: {
        "@type": "Brand",
        name: "Knotankey",
      },
    });
    document.head.appendChild(script);

    return () => {
      document.getElementById("product-structured-data")?.remove();
    };
  }, [name, description, image, price, currency, availability, url]);

  return null;
}
