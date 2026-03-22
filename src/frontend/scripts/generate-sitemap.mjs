/**
 * Dynamic sitemap generator — runs before every Vite build.
 *
 * Uses @dfinity/agent to query getProducts() from the deployed backend canister,
 * then writes public/sitemap.xml with all static pages + every product URL.
 *
 * Falls back to a static-only sitemap if the canister is unreachable or
 * CANISTER_ID_BACKEND is not available (e.g., first-time deploy).
 */

import { Actor, HttpAgent } from "@dfinity/agent";
import { writeFile, readFile } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = "https://knotankey-6kt.caffeine.xyz";
const TODAY = new Date().toISOString().split("T")[0];

const STATIC_PAGES = [
  { loc: `${BASE_URL}/`,             changefreq: "weekly",  priority: "1.0" },
  { loc: `${BASE_URL}/products`,     changefreq: "weekly",  priority: "0.9" },
  { loc: `${BASE_URL}/custom-order`, changefreq: "monthly", priority: "0.8" },
  { loc: `${BASE_URL}/returns`,      changefreq: "monthly", priority: "0.6" },
];

function buildXml(urls) {
  const entries = urls
    .map(
      ({ loc, changefreq, priority }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
    )
    .join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    "</urlset>",
  ].join("\n");
}

/**
 * Calls getProducts() on the deployed canister and returns an array of product IDs.
 * Defines a minimal Candid IDL — only the fields we actually need.
 */
async function fetchProductIds(canisterId, host) {
  const idlFactory = ({ IDL }) => {
    // ExternalBlob is stored as Vec Nat8 in the canister
    const ProductType = IDL.Record({
      id: IDL.Text,
      title: IDL.Text,
      description: IDL.Text,
      price: IDL.Nat,
      image: IDL.Vec(IDL.Nat8),
      category: IDL.Text,
      bestseller: IDL.Bool,
      createdAt: IDL.Int,
    });
    return IDL.Service({
      getProducts: IDL.Func([], [IDL.Vec(ProductType)], ["query"]),
    });
  };

  const agentOptions = host ? { host } : {};
  const agent = new HttpAgent(agentOptions);
  const actor = Actor.createActor(idlFactory, { agent, canisterId });
  const products = await actor.getProducts();
  return products.map((p) => p.id);
}

async function main() {
  const allUrls = [...STATIC_PAGES];

  // Resolve canister ID — prefer the env var set by Caffeine's deploy pipeline
  const canisterId = process.env.CANISTER_ID_BACKEND;

  // Optionally read backend_host from env.json (Caffeine injects this at deploy time)
  let backendHost = null;
  try {
    const envJson = JSON.parse(
      await readFile(path.join(__dirname, "../env.json"), "utf-8"),
    );
    if (envJson.backend_host && envJson.backend_host !== "undefined") {
      backendHost = envJson.backend_host;
    }
  } catch {
    // env.json missing or unreadable — use @dfinity/agent's default IC host
  }

  if (canisterId && canisterId !== "undefined") {
    try {
      const productIds = await fetchProductIds(canisterId, backendHost);

      for (const id of productIds) {
        allUrls.push({
          loc: `${BASE_URL}/products/${id}`,
          changefreq: "weekly",
          priority: "0.8",
        });
      }

      console.log(
        `[sitemap] ✓ ${productIds.length} product pages added (canister: ${canisterId})`,
      );
    } catch (err) {
      console.warn(
        `[sitemap] Could not fetch products from canister: ${err.message}`,
      );
      console.warn("[sitemap] Falling back to static pages only.");
    }
  } else {
    console.log(
      "[sitemap] CANISTER_ID_BACKEND not set — generating static-only sitemap.",
    );
  }

  const xml = buildXml(allUrls);
  const outputPath = path.join(__dirname, "../public/sitemap.xml");
  await writeFile(outputPath, xml, "utf-8");
  console.log(`[sitemap] ✓ Written to ${outputPath} (${allUrls.length} URLs)`);
}

main().catch((err) => {
  // Never fail the build — just warn
  console.error("[sitemap] Unexpected error:", err.message);
  process.exit(0);
});
