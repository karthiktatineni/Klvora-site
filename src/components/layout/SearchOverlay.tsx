"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Mic, Camera, TrendingUp, Clock } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING = ["Obsidian Tote", "Lumen Collection", "Silk Scarves", "Gold Jewelry", "Minimalist Shoes"];

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length > 1
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (!isOpen) onClose(); // toggle
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-2xl"
          id="search-overlay"
        >
          <div className="max-w-3xl mx-auto px-6 pt-24">
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Close search"
            >
              <X size={24} />
            </button>

            {/* Search Input */}
            <div className="relative mb-12">
              <Search size={22} className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search collections, products, styles..."
                className="w-full bg-transparent border-none outline-none pl-10 pr-20 py-4 font-serif text-headline-lg text-primary placeholder:text-on-surface-variant/30 border-b border-outline-variant/30 focus:border-primary transition-colors"
                id="search-input"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-2">
                <button className="p-2 text-on-surface-variant/50 hover:text-primary transition-colors" aria-label="Voice search">
                  <Mic size={18} />
                </button>
                <button className="p-2 text-on-surface-variant/50 hover:text-primary transition-colors" aria-label="Image search">
                  <Camera size={18} />
                </button>
              </div>
            </div>

            {/* Results */}
            {query.length > 1 && filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface-variant/60 mb-4">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </p>
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-6 p-4 rounded-xl hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface-variant/50 mb-1">
                        {product.category}
                      </p>
                      <h3 className="font-serif text-headline-sm text-primary truncate">{product.name}</h3>
                      <p className="font-sans text-body-md text-on-surface-variant">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}

            {/* Empty state */}
            {query.length > 1 && filtered.length === 0 && (
              <p className="text-center text-on-surface-variant/50 font-sans text-body-lg py-12">
                No results found for &ldquo;{query}&rdquo;
              </p>
            )}

            {/* Trending when no query */}
            {query.length <= 1 && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={16} className="text-secondary" />
                    <p className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface-variant/60">
                      Trending Searches
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {TRENDING.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-5 py-2.5 rounded-full border border-outline-variant/30 font-sans text-body-sm text-on-surface-variant hover:bg-surface-container-low hover:border-primary/20 transition-all"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} className="text-on-surface-variant/40" />
                    <p className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface-variant/60">
                      Keyboard Shortcut
                    </p>
                  </div>
                  <p className="text-on-surface-variant/40 text-body-sm">
                    Press <kbd className="px-2 py-0.5 rounded border border-outline-variant/30 text-[11px] font-mono">⌘K</kbd> to search anytime
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
