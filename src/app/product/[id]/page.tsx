"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Share2, Star, ChevronDown, Truck, RotateCcw, Shield } from "lucide-react";
import { getProductById, PRODUCTS } from "@/lib/products";
import { useCartStore, useWishlistStore, useRecentlyViewedStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import { useEffect } from "react";

export default function ProductPage() {
  const params = useParams();
  const product = getProductById(params.id as string);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWished } = useWishlistStore();
  const addRecent = useRecentlyViewedStore((s) => s.addItem);

  useEffect(() => {
    if (product) addRecent(product);
  }, [product, addRecent]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="font-serif text-headline-lg text-primary mb-4">Product Not Found</h1>
          <Link href="/collections" className="font-sans text-ui-button uppercase tracking-[0.05em] text-secondary underline">Browse Collections</Link>
        </div>
      </div>
    );
  }

  const wished = isWished(product.id);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      selectedColor: product.colors[selectedColor]?.name || "Default",
      selectedSize: product.sizes[selectedSize] || "One Size",
    });
  };

  const accordionItems = [
    { id: "dimensions", title: "Dimensions & Fit", content: "Height: 28cm, Width: 38cm, Depth: 14cm. Adjustable shoulder strap. Interior zip pocket with suede lining." },
    { id: "materials", title: "Materials & Care", content: `Crafted from ${product.material}. Clean with a soft, dry cloth. Store in the provided dust bag. Avoid prolonged exposure to direct sunlight.` },
    { id: "shipping", title: "Shipping & Returns", content: "Complimentary express shipping on all orders. Free returns within 30 days. Items must be unworn with original tags attached." },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 mb-8">
        <nav className="flex items-center gap-2 font-sans text-body-sm text-on-surface-variant/50">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-primary transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-primary">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 flex flex-col lg:flex-row gap-8 lg:gap-16">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          className="flex-1 lg:max-w-[500px]"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low rounded-xl shadow-ambient mb-4 cursor-grab active:cursor-grabbing">
            <motion.div
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              style={{ x: 0 }}
              onDrag={(e, info) => {
                // Simple visual rotation effect based on drag
                const rotation = info.offset.x / 5;
                const img = document.getElementById('product-main-image');
                if (img) img.style.transform = `rotateY(${rotation}deg)`;
              }}
              onDragEnd={() => {
                const img = document.getElementById('product-main-image');
                if (img) img.style.transform = `rotateY(0deg)`;
              }}
              className="w-full h-full relative"
            >
              <Image 
                id="product-main-image"
                src={product.images[selectedImage]} 
                alt={product.name} 
                fill 
                className="object-cover transition-transform duration-300 ease-out" 
                priority 
                sizes="(max-width: 1024px) 100vw, 40vw" 
              />
            </motion.div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-outline-variant/20 shadow-sm pointer-events-none">
              <span className="text-[16px]">🔄</span>
              <span className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface text-[10px]">Drag to rotate</span>
            </div>
          </div>
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-primary" : "border-outline-variant/30 opacity-60 hover:opacity-100"}`}>
                  <Image src={img} alt={`${product.name} view ${i + 1}`} width={80} height={96} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.aside initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="w-full lg:w-[480px] shrink-0">
          <div className="glass-card rounded-2xl p-8 space-y-6 mb-6">
            {product.isNew && <span className="inline-block px-3 py-1 bg-primary text-on-primary text-[10px] font-semibold tracking-[0.15em] uppercase">New Arrival</span>}
            <div>
              <h1 className="font-serif text-headline-lg text-primary mb-2">{product.name}</h1>
              <p className="font-sans text-body-lg text-on-surface-variant mb-4">{product.shortDescription}</p>
              <div className="flex items-center gap-3">
                <span className="font-serif text-headline-sm text-primary">{formatPrice(product.price)}</span>
                {product.originalPrice && <span className="font-sans text-body-md text-on-surface-variant/40 line-through">{formatPrice(product.originalPrice)}</span>}
              </div>
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.round(product.rating) ? "text-accent-gold fill-accent-gold" : "text-outline-variant"} />)}</div>
                <span className="text-body-sm text-on-surface-variant/60">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            </div>
            <hr className="border-outline-variant/20" />
            {/* Color Options */}
            <div>
              <h3 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-3">Color — {product.colors[selectedColor]?.name}</h3>
              <div className="flex gap-3">
                {product.colors.map((c, i) => (
                  <button key={c.hex} onClick={() => setSelectedColor(i)} className={`w-10 h-10 rounded-full transition-all ${i === selectedColor ? "ring-2 ring-offset-2 ring-primary" : "border border-outline-variant/30 hover:border-primary"}`} style={{ backgroundColor: c.hex }} aria-label={c.name} />
                ))}
              </div>
            </div>
            {/* Size Options */}
            {product.sizes.length > 1 && (
              <div>
                <h3 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s, i) => (
                    <button key={s} onClick={() => setSelectedSize(i)} className={`px-5 py-2.5 border text-body-sm font-medium transition-colors ${i === selectedSize ? "border-primary bg-primary text-on-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary"}`}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {/* Description */}
            <p className="font-sans text-body-md text-on-surface-variant leading-relaxed">{product.description}</p>
            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              <button onClick={handleAddToCart} className="w-full bg-primary text-on-primary font-sans text-ui-button uppercase tracking-[0.05em] py-4 flex justify-center items-center gap-2 hover:bg-primary/90 transition-colors magnetic-btn">
                <ShoppingBag size={16} /> Add to Bag — {formatPrice(product.price)}
              </button>
              <div className="flex gap-3">
                <button onClick={() => toggle(product)} className={`flex-1 border py-3.5 flex justify-center items-center gap-2 font-sans text-ui-button uppercase tracking-[0.05em] transition-colors ${wished ? "border-red-400 text-red-500 bg-red-50" : "border-outline-variant text-primary hover:bg-surface-container-low"}`}>
                  <Heart size={16} fill={wished ? "currentColor" : "none"} /> {wished ? "Saved" : "Save"}
                </button>
                <button className="w-12 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>
          {/* Info rows */}
          <div className="flex gap-4 mb-6 px-2">
            {[{ icon: Truck, text: "Free Shipping" }, { icon: RotateCcw, text: "30-Day Returns" }, { icon: Shield, text: "Authenticity" }].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-on-surface-variant/60">
                <Icon size={16} />
                <span className="text-body-sm">{text}</span>
              </div>
            ))}
          </div>
          {/* Accordions */}
          <div className="border-t border-outline-variant/20">
            {accordionItems.map((item) => (
              <div key={item.id} className="border-b border-outline-variant/20">
                <button onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)} className="w-full flex justify-between items-center py-5 group">
                  <span className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface group-hover:text-secondary transition-colors">{item.title}</span>
                  <ChevronDown size={18} className={`text-outline transition-transform ${openAccordion === item.id ? "rotate-180" : ""}`} />
                </button>
                {openAccordion === item.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="pb-5">
                    <p className="text-body-sm text-on-surface-variant/70 leading-relaxed">{item.content}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.aside>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-16 mt-24">
          <h2 className="font-serif text-headline-lg text-primary mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
