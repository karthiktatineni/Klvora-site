import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://aura-fashion.vercel.app";
  const products = [
    "obsidian-tote", "lumen-coat", "sculptural-clutch", "arc-earrings",
    "minimalist-shoe", "wool-blazer", "silk-scarf", "leather-belt",
  ];
  const collections = ["archive", "lumen", "sculpture", "geometry", "atelier", "ethereal", "foundation"];

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/collections`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/editorial`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/archives`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    ...products.map((id) => ({
      url: `${baseUrl}/product/${id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...collections.map((c) => ({
      url: `${baseUrl}/collections/${c}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
