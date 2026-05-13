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

export const PRODUCTS: Product[] = [
  {
    id: "obsidian-tote",
    name: "The Obsidian Tote",
    brand: "KLVORA",
    price: 1850,
    originalPrice: 2200,
    description: "Sculpted from a single piece of heritage leather, this tote represents the pinnacle of minimalist architecture. The spacious interior is lined with suede, featuring seamless champagne gold hardware.",
    shortDescription: "Italian Full-Grain Leather",
    category: "Bags",
    subcategory: "Totes",
    tags: ["luxury", "leather", "structured", "everyday"],
    colors: [
      { name: "Obsidian Black", hex: "#1b1c1b" },
      { name: "Pearl Gray", hex: "#dbdad8" },
      { name: "Cognac", hex: "#785a1a" },
    ],
    sizes: ["One Size"],
    material: "Italian Full-Grain Calfskin",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDFlcn_lCCJ6lQNo2qZ9eGXBUeyTisLDpnbqIi0sgjTFLE_H8pCeTb-Q6ALQY-mYPH7sSt1vIbuik8M1-gufgSbAmyOEJGYZXX0Kdo5r_IAozI3mZGlsnpb2CHqF9vhFuzMBVD6WHlUe0pc87OZTnKnbwZUhflyKLWlQzLi5A0ET76HdlwrRT8SVhDGkVbz_YRzdhEtF_0o8Fmad9usC0-yndjCoJdAfrXOUGppkoHMEBFBsIullNwoMY7HpCv9WCq0s4bIRdlFPgg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLuCukDqOiAoEgS1g-tNHCHz-3wmhHaSAQmfywdl8yUnIchJuACAHyfYanuG3na2U4YMhU1yfdQ1e6DOb6WFHitP4vFh2dmqsyYO9WdE2VI30lyIPVmmaczakIzjfSzidqLCOtUiVRVVrPb4SfQNU8aIuWaumXp8FbEt0FR3tHxmAR2X3e9TQ1h4s2iLIFJdxqtZvuydj3Hczqk16W25V1sEmno93eDTskCtN9yr-xnuT91MwP4OE6Bt2AR6R4HPyc1aIhMLCEK08",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrP6a05-ESpVtjEf_bpqipB6rafyKoKUXJx6fGB3paMxm7_2hLxAjnUjWqqK8OxK8UcPEH0m758wS9wJY2wDN3mvmj2U7Fe_0uRaDgDSwP34lJuAjsqPTtPivDRn00ewi0nkDksIWerdqn1aQIyzZgx4iL7PnAXLnBKuhpQMHFLyk030y4ISo1fnHsYCZ_7fNV1tWYaBvmBtNdZk7bYKg9owNC-jyhsT5gHKEvqxG6Xh0w3uM2YoV1JtKDmdcYBAi_DsjszoVN4Ec",
    ],
    rating: 4.9,
    reviewCount: 128,
    inStock: true,
    isNew: true,
    isBestseller: true,
    isTrending: true,
    collection: "Archive",
    gender: "women",
  },
  {
    id: "lumen-coat",
    name: "Lumen Coat",
    brand: "KLVORA",
    price: 2800,
    description: "Captured in the stillness between moments. A silhouette defined by what it omits as much as what it includes. Tailored from premium virgin wool blend.",
    shortDescription: "Virgin Wool Blend",
    category: "Outerwear",
    subcategory: "Coats",
    tags: ["luxury", "wool", "structured", "editorial"],
    colors: [
      { name: "Ivory", hex: "#f5f3f1" },
      { name: "Charcoal", hex: "#303130" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Virgin Wool / Cashmere Blend",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCfUaAETtjyJc1c7xIdrniE4LQiaP03LH057GRh-VB9_jEi0FRTQGw3QNoztN-HHEfN_pnP18EVDDB8QVS2OonKhYfVSrZ-Hwy2q8KTO2MHu4I3CrFWRb3BS1MVGiDQ3577qOVbemPIODr2oP-hhjoYeRIbaQyMZ-j7Faeqs4NeKFn673o8TmczqwJO0lkqDY7ymyMnSXxmY5v9XZdWduYBdxoOV7gykywQ81tjBXoFaYdmHf-HP6df-c0NkueTj9T_ek-UU9G26AQ",
    ],
    rating: 4.8,
    reviewCount: 85,
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: true,
    collection: "Lumen",
    gender: "women",
  },
  {
    id: "sculptural-clutch",
    name: "Sculptural Clutch",
    brand: "KLVORA",
    price: 890,
    description: "A minimalist sculptural form elevated by architectural gold hardware. Crafted from matte ivory leather with an impossibly smooth finish.",
    shortDescription: "Matte Ivory Leather",
    category: "Bags",
    subcategory: "Clutches",
    tags: ["luxury", "evening", "sculptural", "minimal"],
    colors: [
      { name: "Ivory", hex: "#f5f3f1" },
      { name: "Black", hex: "#1b1c1b" },
    ],
    sizes: ["One Size"],
    material: "Italian Lambskin",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdHJqIiie0VCMmHGbjHnZwVjnk_32H56x52PE1fhmTa23E4w4aRJ5PTKLdVIlMvlWuAXtoD8yDi-MF6zGEYi86zfLsY0WgH9Z-TS1a0Rd_78AgreK_YvYoxbTqNvyav8rHdfOGw_b3EDj6HlAOkGmQFDulmgEsiNq9shtiLkcujS7XL4Z1LjDi7qabGT0L-Zu0jTp-f4X6bzaWXMdj-3Ln9SEf2elWJKEAzNdCwzxe6sdy_akZN7zEXD6KTd_EDcyWFhf1ApkDPDU",
    ],
    rating: 4.7,
    reviewCount: 62,
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: true,
    collection: "Sculpture",
    gender: "women",
  },
  {
    id: "arc-earrings",
    name: "Arc Drop Earrings",
    brand: "KLVORA",
    price: 420,
    description: "Delicate architectural gold earrings that catch light from every angle. Handcrafted from 18k gold-plated sterling silver.",
    shortDescription: "18K Gold-Plated Silver",
    category: "Jewelry",
    subcategory: "Earrings",
    tags: ["luxury", "gold", "delicate", "everyday"],
    colors: [
      { name: "Gold", hex: "#C9A96E" },
      { name: "Silver", hex: "#BFC9D9" },
    ],
    sizes: ["One Size"],
    material: "18K Gold-Plated Sterling Silver",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBSho5NCgxw1COAyFjmTO5Efg-6IGlQ-E7AWdB02ysONX8FZe2AcOe4B3fxLGxeaM3gv7ikFJUt4lM0inHntRV6uOhuH4HL1mFbcHJs6VDe5hrJ3Ct4Br2B8PrNoO6FKufILkBomQdjeqrfd_fX5oQArvNahac-RsoP9jRgfQFwB-e3nDFeEbnRoqrnIgrQ73sXAyEZcmliUI64sD4c8SSCssDZmW8AhioPEoH3CtgJl3T1GYNKdyKVoDHqSq6Tr51dMoU5vQlhdIU",
    ],
    rating: 4.9,
    reviewCount: 203,
    inStock: true,
    isNew: false,
    isBestseller: true,
    isTrending: false,
    collection: "Geometry",
    gender: "women",
  },
  {
    id: "minimalist-shoe",
    name: "Atelier Loafer",
    brand: "KLVORA",
    price: 680,
    description: "A sleek, minimalist leather loafer crafted from the finest Italian calfskin. The clean silhouette speaks to architectural precision.",
    shortDescription: "Italian Calfskin Leather",
    category: "Shoes",
    subcategory: "Loafers",
    tags: ["luxury", "leather", "minimal", "classic"],
    colors: [
      { name: "Black", hex: "#1b1c1b" },
      { name: "Tan", hex: "#a0845c" },
    ],
    sizes: ["36", "37", "38", "39", "40", "41", "42"],
    material: "Italian Calfskin",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0Y0rNRSqvrSlg_KaGfAEqnZLy-vPI_xjAg5XJT1Bi4dWGmPWDBfcaz7DAU6j2ghZV-99MpqGAOCUdMeorrcovsI1QXMZs8Dl2KFz7u-tfsDNT4P1rAPbnj5TsDssJ7vLMv6g_adrhyS8YHAxXARkSuqbJ3PC8rv7mqLytRaakmay1Hpw5Wf6LS-ATaBCJSzHxMYzwuIs4QlcF7Uc74QzfvyPKdD8BWOqbAkHt2ctGaXGwd5oJO7T2Vfdg8Hh53rqR-RTYb2SLq3g",
    ],
    rating: 4.8,
    reviewCount: 94,
    inStock: true,
    isNew: false,
    isBestseller: false,
    isTrending: true,
    collection: "Atelier",
    gender: "unisex",
  },
  {
    id: "wool-blazer",
    name: "Structured Wool Crepe Blazer",
    brand: "KLVORA",
    price: 1250,
    description: "A pristine white, structured oversized blazer draped with precision. The luxurious wool-silk blend fabric and precise tailoring create an ultra-modern silhouette.",
    shortDescription: "Wool-Silk Blend",
    category: "Outerwear",
    subcategory: "Blazers",
    tags: ["luxury", "wool", "structured", "editorial", "oversized"],
    colors: [
      { name: "White", hex: "#faf9f7" },
      { name: "Black", hex: "#1b1c1b" },
      { name: "Navy", hex: "#1B2430" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    material: "Wool-Silk Blend",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA9VZkaOJTjK333hl-qPZUNA_zumEgtBVlZxePRf72miUe0VIidt2T46-lw8Gw6aKAqwTvtw5540qHESgsw1bdBcViz01rL-FfeY89GmTEvAppAizsQ7xynS6wqx0mXB1V5cPCVhbezyRFsOIHspQ4do905sRbriG3985Y3Gi6hDgfpFaHQUWwv4vsey3o33XM1xkC1HqDIU22ByF0-C0oPBi-T6_vZCA_qMnNN4uGKxYoj_SUcTiFJbtrmckEcl0BEArWu7C84r8w",
    ],
    rating: 4.7,
    reviewCount: 76,
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: true,
    collection: "Archive",
    gender: "women",
  },
  {
    id: "silk-scarf",
    name: "Ethereal Silk Scarf",
    brand: "KLVORA",
    price: 340,
    description: "Hand-painted abstract motifs on the finest mulberry silk. Each scarf is a unique work of art, flowing with effortless grace.",
    shortDescription: "100% Mulberry Silk",
    category: "Accessories",
    subcategory: "Scarves",
    tags: ["luxury", "silk", "artisan", "print"],
    colors: [
      { name: "Pearl", hex: "#e5e2e1" },
      { name: "Blush", hex: "#E8C4C4" },
    ],
    sizes: ["One Size"],
    material: "100% Mulberry Silk",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ4AYdxHWVwiAobCzxk51qSSw18Rl4oGF5cJcfujTMNLpP-l-P8DlRehVhMxczckdRzhrVx4RB7XQ4_-juSUbk_3rUlqJJ-12P1fgGImmSZj_gIe7dm7Ol3CnC3X_Zoch_HOV5Vc4Gjr01F96cdkeYtNPsyrz1vI-QaVC5_YtM9h73vK98OzdBiiaEFuI-W2sLbqaSnHfdt9PV8JSzh312X-9JGOVq79Z9aITUWvpRjWyQPdwiDqptUCUz8OSi01zDKi-HuJ-aK6g",
    ],
    rating: 4.6,
    reviewCount: 45,
    inStock: true,
    isNew: true,
    isBestseller: false,
    isTrending: false,
    collection: "Ethereal",
    gender: "women",
  },
  {
    id: "leather-belt",
    name: "Monolith Belt",
    brand: "KLVORA",
    price: 290,
    description: "A statement belt carved from a single piece of premium leather. The oversized buckle is hand-finished in brushed silver.",
    shortDescription: "Premium Leather / Brushed Silver",
    category: "Accessories",
    subcategory: "Belts",
    tags: ["luxury", "leather", "statement", "metal"],
    colors: [
      { name: "Black", hex: "#1b1c1b" },
      { name: "Brown", hex: "#5d4201" },
    ],
    sizes: ["S", "M", "L"],
    material: "Full-Grain Leather / Brushed Silver",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAD7w0vR88kuCasnnI6MkPwN1x8ZObkZZ62Qi3OuejRwcVkaYSGEz6bHZcjO00nC8pS-2wSG-5JPIPyQmCxpyqyaiGrdf3eREEu2zUGyihMZU_uANPVBoUOg1Z6LcUeVFFci2oi0tppQo8Sjn3dURNrlgXz3LEL6O0ssp9nZfEXHyVq_i9O2jlkFzVe0E2GgUEJR54vENiHJ-K5n2oXADJKzpDvJ093c7BOt5whvqptoKv0DfrzX1jOnoz6VlNzH2fVexxkXgMSRMk",
    ],
    rating: 4.5,
    reviewCount: 38,
    inStock: true,
    isNew: false,
    isBestseller: false,
    isTrending: false,
    collection: "Foundation",
    gender: "unisex",
  },
];

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
