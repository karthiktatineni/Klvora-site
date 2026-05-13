"use client";

import { motion } from "framer-motion";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useWishlistStore, useCartStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (product: typeof items[0]) => {
    addItem({
      product,
      quantity: 1,
      selectedColor: product.colors[0]?.name || "Default",
      selectedSize: product.sizes[0] || "One Size",
    });
    removeItem(product.id);
  };

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-[1440px] mx-auto px-6 md:px-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <span className="font-sans text-label-caps uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 block">Your Archives</span>
        <h1 className="font-serif text-display-sm text-primary mb-2">Wishlist</h1>
        <p className="font-sans text-body-lg text-on-surface-variant">{items.length} saved {items.length === 1 ? "piece" : "pieces"}</p>
      </motion.div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto text-outline-variant mb-4" />
          <p className="font-serif text-headline-sm text-on-surface-variant/50 mb-6">Your wishlist is empty</p>
          <Link href="/collections" className="font-sans text-ui-button uppercase tracking-[0.05em] bg-primary text-on-primary px-8 py-3 inline-block hover:bg-primary/90 transition-colors">
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group"
            >
              <Link href={`/product/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-surface-container-low rounded-xl mb-3 shadow-ambient">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.preventDefault(); handleAddToCart(product); }} className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors" title="Move to bag">
                      <ShoppingBag size={14} />
                    </button>
                    <button onClick={(e) => { e.preventDefault(); removeItem(product.id); }} className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Remove">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-0.5 px-1">
                  <p className="font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant/50">{product.brand}</p>
                  <h3 className="font-serif text-body-lg text-primary">{product.name}</h3>
                  <span className="font-sans text-body-md text-primary font-medium">{formatPrice(product.price)}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
