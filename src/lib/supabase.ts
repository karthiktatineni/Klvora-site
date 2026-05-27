import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bibnyipgyzretvuxyunc.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

const BUCKET = "product-images";

/**
 * Upload a product image file to Supabase Storage.
 * Returns the public URL on success, or throws on failure.
 */
export async function uploadProductImage(
  file: File
): Promise<string> {
  // Create a unique path
  const timestamp = Date.now();

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");

  const filePath = `${timestamp}-${safeName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(data.path);

  return publicUrl;
}

/**
 * Delete a product image from Supabase Storage
 */
export async function deleteProductImage(
  publicUrl: string
): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;

  const idx = publicUrl.indexOf(marker);

  if (idx === -1) {
    return;
  }

  const filePath = decodeURIComponent(
    publicUrl.substring(idx + marker.length)
  );

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([filePath]);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error(`Delete failed: ${error.message}`);
  }
}

/**
 * Check if URL is from Supabase storage
 */
export function isSupabaseUrl(
  url: string
): boolean {
  return url.includes(
    "bibnyipgyzretvuxyunc.supabase.co/storage/v1/object/public/"
  );
}

// --- Database CRUD Operations for Products ---

import type { Product } from "./products";

/**
 * Fetch all products
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Supabase fetch error:", error);
    throw new Error(
      `Failed to fetch products: ${error.message}`
    );
  }

  return (data || []) as Product[];
}

/**
 * Create product
 */
export async function createProduct(
  product: Omit<Product, "created_at" | "updated_at">
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([product])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(
      `Failed to create product: ${error.message}`
    );
  }

  return data as Product;
}

/**
 * Update product
 */
export async function updateProductDB(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    throw new Error(
      `Failed to update product: ${error.message}`
    );
  }

  return data as Product;
}

/**
 * Delete product
 */
export async function deleteProductDB(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error);
    throw new Error(
      `Failed to delete product: ${error.message}`
    );
  }
}