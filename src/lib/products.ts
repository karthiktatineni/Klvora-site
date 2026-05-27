export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  category: string;
  subcategory: string;
  tags: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  material: string;
  images: string[];
  modelUrl?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew: boolean;
  isBestseller: boolean;
  isTrending: boolean;
  collection: string;
  gender: "men" | "women" | "unisex";
}

export const PRODUCTS: Product[] = [];

export const COLLECTIONS = [
  { name: "Archive", description: "Heritage pieces reimagined", count: 24 },
  { name: "Lumen", description: "Captured in stillness", count: 18 },
  { name: "Sculpture", description: "Form as function", count: 12 },
  { name: "Geometry", description: "Precision in every line", count: 15 },
  { name: "Atelier", description: "The art of craft", count: 20 },
  { name: "Ethereal", description: "Light as breath", count: 10 },
  { name: "Foundation", description: "Timeless essentials", count: 30 },
];

export const CATEGORIES = [
  "Bags", "Outerwear", "Shoes", "Jewelry", "Accessories", "Dresses", "Tops", "Bottoms",
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function getTrendingProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isTrending);
}

export function getNewArrivals(): Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}

export function getBestsellers(): Product[] {
  return PRODUCTS.filter((p) => p.isBestseller);
}
