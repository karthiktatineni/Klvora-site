"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, Grid3X3, LayoutList, X } from "lucide-react";
import { PRODUCTS, CATEGORIES, COLLECTIONS } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Bestsellers", value: "bestseller" },
  { label: "Top Rated", value: "rating" },
];

export default function CollectionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [gridCols, setGridCols] = useState(3);

  const filtered = useMemo(() => {
    let items = [...PRODUCTS];
    if (selectedCategory !== "All") items = items.filter((p) => p.category === selectedCategory);
    items = items.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case "price-asc": items.sort((a, b) => a.price - b.price); break;
      case "price-desc": items.sort((a, b) => b.price - a.price); break;
      case "bestseller": items.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0)); break;
      case "rating": items.sort((a, b) => b.rating - a.rating); break;
      default: items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    return items;
  }, [selectedCategory, sortBy, priceRange]);

  return (
    <div className="pt-28 pb-20 min-h-screen">
      {/* Hero */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 mb-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="font-sans text-label-caps uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 block">Discover</span>
          <h1 className="font-serif text-display-sm md:text-display-md text-primary mb-4">Collections</h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-xl mx-auto">Every piece tells a story of intention. Browse our curated selection of premium fashion.</p>
        </motion.div>

        {/* Category Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {["All", ...CATEGORIES].map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2 rounded-full font-sans text-body-sm transition-all ${selectedCategory === cat ? "bg-primary text-on-primary" : "border border-outline-variant/30 text-on-surface-variant hover:border-primary hover:text-primary"}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <p className="font-sans text-body-sm text-on-surface-variant/60">{filtered.length} pieces</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 font-sans text-body-sm text-on-surface-variant hover:text-primary transition-colors">
              <SlidersHorizontal size={16} /> Filters
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent border border-outline-variant/30 rounded px-3 py-1.5 font-sans text-body-sm text-on-surface-variant outline-none focus:border-primary">
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <div className="hidden md:flex gap-1">
              {[2, 3, 4].map((n) => (
                <button key={n} onClick={() => setGridCols(n)} className={`p-1.5 rounded ${gridCols === n ? "text-primary" : "text-on-surface-variant/40"}`}>
                  {n === 2 ? <LayoutList size={16} /> : <Grid3X3 size={16} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="max-w-[1440px] mx-auto px-6 md:px-16 mb-8">
          <div className="glass-card rounded-xl p-6 flex flex-wrap gap-8">
            <div>
              <h3 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-3">Price Range</h3>
              <div className="flex items-center gap-3">
                <input type="range" min={0} max={5000} step={100} value={priceRange[1]} onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-40 accent-primary" />
                <span className="text-body-sm text-on-surface-variant">{formatPrice(priceRange[0])} — {formatPrice(priceRange[1])}</span>
              </div>
            </div>
            <div>
              <h3 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-3">Collection</h3>
              <div className="flex flex-wrap gap-2">
                {COLLECTIONS.slice(0, 5).map((c) => (
                  <span key={c.name} className="px-3 py-1 border border-outline-variant/30 rounded-full text-body-sm text-on-surface-variant hover:border-primary cursor-pointer transition-colors">{c.name}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setShowFilters(false)} className="ml-auto self-start text-on-surface-variant/50 hover:text-primary"><X size={18} /></button>
          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className={`grid gap-6 md:gap-8 ${gridCols === 2 ? "grid-cols-2" : gridCols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} variant="editorial" />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-headline-sm text-on-surface-variant/50 mb-4">No pieces found</p>
            <button onClick={() => { setSelectedCategory("All"); setPriceRange([0, 5000]); }} className="font-sans text-ui-button uppercase tracking-[0.05em] text-secondary underline">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
