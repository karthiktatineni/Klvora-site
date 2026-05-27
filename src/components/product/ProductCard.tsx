"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import type { Product } from "@/lib/products";
import { useWishlistStore, useCartStore, useUIStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";

interface Props {
  product: Product;
  index?: number;
  variant?: "default" | "editorial";
}

export default function ProductCard({ product, index = 0, variant = "default" }: Props) {
  const { toggle, isWished } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const setPreviewProduct = useUIStore((s) => s.setPreviewProduct);
  const wished = isWished(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ product, quantity: 1, selectedColor: product.colors[0]?.name || "Default", selectedSize: product.sizes[0] || "One Size" });
  };

  const handleToggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewProduct(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link href={`/product/${product.id}`} className="group block" id={`product-card-${product.id}`}>
        <div className={`relative overflow-hidden bg-surface-container-low mb-3 shadow-ambient ${variant === "editorial" ? "aspect-[3/4]" : "aspect-[3/4] rounded-xl"}`}>
          <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 33vw" />
          {product.isNew && <span className="absolute top-3 left-3 px-3 py-1 bg-primary text-on-primary text-[10px] font-semibold tracking-[0.15em] uppercase">{product.originalPrice ? "Sale" : "New"}</span>}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {/* Quick actions on hover */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
            <button onClick={handleAddToCart} className="bg-white/90 backdrop-blur-md text-primary px-4 py-2 font-sans text-[11px] font-medium tracking-[0.05em] uppercase hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-1.5">
              <ShoppingBag size={13} /> Add
            </button>
            <div className="flex gap-1.5">
              <button onClick={handleToggleWish} className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors ${wished ? "bg-red-500 text-white" : "bg-white/90 text-primary"}`}>
                <Heart size={13} fill={wished ? "currentColor" : "none"} />
              </button>
              <button onClick={handleQuickView} className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors" title="Quick View">
                <Eye size={13} />
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-0.5 px-1">
          <p className="font-sans text-[10px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant/50">{product.brand}</p>
          <h3 className="font-serif text-body-lg text-primary">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="font-sans text-body-md text-primary font-medium">{formatPrice(product.price)}</span>
            {product.originalPrice && <span className="text-body-sm text-on-surface-variant/40 line-through">{formatPrice(product.originalPrice)}</span>}
          </div>
          <div className="flex gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((c) => <span key={c.hex} className="w-3.5 h-3.5 rounded-full border border-outline-variant/30" style={{ backgroundColor: c.hex }} title={c.name} />)}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
