"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, Suspense } from "react";
import { useCatalogStore } from "@/store/useStore";
import ProductCard from "@/components/product/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const products = useCatalogStore((s) => s.products);

  const filteredProducts = useMemo(() => {
    if (!query) return [];
    return products.filter((p) => 
      p.name.toLowerCase().includes(query) || 
      p.category.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }, [query, products]);

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-[1440px] mx-auto px-6 md:px-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="font-serif text-display-sm text-primary mb-2">
          {query ? `Search results for "${query}"` : "Search Our Collection"}
        </h1>
        <p className="font-sans text-body-lg text-on-surface-variant">
          {filteredProducts.length} pieces found
        </p>
      </motion.div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="font-serif text-headline-sm text-on-surface-variant/50 mb-6">
            We couldn&apos;t find any matches for your search.
          </p>
          <Link href="/collections" className="font-sans text-ui-button uppercase tracking-[0.05em] bg-primary text-on-primary px-8 py-3 inline-block hover:bg-primary/90 transition-colors">
            Browse All Collections
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center font-serif text-display-sm">Searching...</div>}>
      <SearchResults />
    </Suspense>
  );
}
