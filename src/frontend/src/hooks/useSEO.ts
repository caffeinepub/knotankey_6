import { useEffect } from "react";
import { type SEOProps, applySEO } from "../utils/seo";

export function useSEO({ title, description, image, url, type }: SEOProps) {
  useEffect(() => {
    applySEO({ title, description, image, url, type });
  }, [title, description, image, url, type]);
}
