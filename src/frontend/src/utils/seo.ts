export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const BASE_TITLE = "Knotankey";
const BASE_URL = "https://knotankey-6kt.caffeine.xyz";
const DEFAULT_IMAGE = "/assets/uploads/IMG-20250808-WA0006-1.jpg";
const DEFAULT_DESC =
  "Handcrafted Crocheted Products — Soft luxury crochet pieces crafted stitch by stitch.";

function setMeta(name: string, content: string, attr = "name") {
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(url: string) {
  let el = document.querySelector(
    'link[rel="canonical"]',
  ) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function applySEO({
  title,
  description,
  image,
  url,
  type = "website",
}: SEOProps) {
  const fullTitle = title ? `${title} | ${BASE_TITLE}` : BASE_TITLE;
  const desc = description || DEFAULT_DESC;
  const img = image || DEFAULT_IMAGE;
  const pageUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  document.title = fullTitle;
  setMeta("description", desc);
  setMeta("og:title", fullTitle, "property");
  setMeta("og:description", desc, "property");
  setMeta("og:image", img, "property");
  setMeta("og:url", pageUrl, "property");
  setMeta("og:type", type, "property");
  setMeta("twitter:title", fullTitle);
  setMeta("twitter:description", desc);
  setMeta("twitter:image", img);
  setCanonical(pageUrl);
}
