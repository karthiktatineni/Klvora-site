"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Share2, Star, ChevronDown, Truck, RotateCcw, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore, useWishlistStore, useRecentlyViewedStore, useCatalogStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import { useEffect } from "react";

export default function ProductPage() {
  const params = useParams();
  const products = useCatalogStore((s) => s.products);
  const product = products.find((p) => p.id === params.id as string);
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
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    addItem({
      product,
      quantity: 1,
      selectedColor: product.colors[selectedColor]?.name || "Default",
      selectedSize: product.sizes[selectedSize] || "One Size",
    });
  };

  const handlePreviousImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : product.images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev < product.images.length - 1 ? prev + 1 : 0));
  };

  const accordionItems = [
    { id: "dimensions", title: "Dimensions & Fit", content: "Height: 28cm, Width: 38cm, Depth: 14cm. Adjustable shoulder strap. Interior zip pocket with suede lining." },
    { id: "materials", title: "Materials & Care", content: `Crafted from ${product.material}. Clean with a soft, dry cloth. Store in the provided dust bag. Avoid prolonged exposure to direct sunlight.` },
    { id: "shipping", title: "Shipping & Returns", content: "Complimentary express shipping on all orders. Free returns within 30 days. Items must be unworn with original tags attached." },
  ];

  return (
    <div className="pt-12 pb-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 mb-4">
        <nav className="flex items-center gap-2 font-sans text-xs text-on-surface-variant/50">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href="/collections" className="hover:text-primary transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-primary truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Image Gallery - Compact */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.8 }} 
          className="lg:col-span-5"
        >
          <div className="bg-surface-container-low rounded-lg overflow-hidden cursor-grab active:cursor-grabbing group sticky top-24">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden bg-surface-container-low">
              <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x < -swipeThreshold && selectedImage < product.images.length - 1) {
                    setSelectedImage(selectedImage + 1);
                  } else if (info.offset.x > swipeThreshold && selectedImage > 0) {
                    setSelectedImage(selectedImage - 1);
                  }
                }}
                className="w-full h-full relative flex items-center justify-center"
              >
                <Image 
                  src={product.images[selectedImage]} 
                  alt={product.name} 
                  fill 
                  className="object-cover" 
                  priority 
                  sizes="(max-width: 1024px) 100vw, 35vw" 
                />
              </motion.div>
              
              {/* Navigation Buttons */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-outline-variant/30 text-primary dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-outline-variant/30 text-primary dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={16} />
                  </button>
                   
                  {/* Image Counter */}
                  <div className="absolute bottom-2 right-2 z-10 bg-black/60 dark:bg-white/10 backdrop-blur-md px-1.5 py-0.5 rounded text-xs">
                    <span className="font-sans text-white/90 dark:text-white font-semibold">
                      {selectedImage + 1}/{product.images.length}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails - Horizontal strip */}
            {product.images.length > 1 && (
              <div className="flex gap-1.5 p-2 overflow-x-auto bg-surface-container-low/30">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`w-12 h-12 rounded flex-shrink-0 overflow-hidden border transition-all ${i === selectedImage ? "border-2 border-primary" : "border border-outline-variant/30 opacity-50 hover:opacity-75"}`}>
                    <Image src={img} alt={`${product.name} view ${i + 1}`} width={48} height={48} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Product Details - Compact */}
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-7">
          <div className="space-y-4">
            {product.isNew && <span className="inline-block px-2 py-0.5 bg-primary text-on-primary text-[9px] font-bold tracking-widest uppercase">New Arrival</span>}
            
            {/* Title & Description */}
            <div>
              <h1 className="font-serif text-lg md:text-2xl text-primary leading-tight mb-2">{product.name}</h1>
              <p className="font-sans text-sm text-on-surface-variant leading-snug">{product.shortDescription}</p>
            </div>

            {/* Price - Big & Bold */}
            <div className="border-y border-outline-variant/20 py-3">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl md:text-4xl text-primary font-bold">{formatPrice(product.price)}</span>
                {product.originalPrice && <span className="text-sm text-on-surface-variant/40 line-through">{formatPrice(product.originalPrice)}</span>}
              </div>
            </div>

           {/* Color Options */}
           {product.colors.length > 0 && (
             <div>
               <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface mb-2">Color: {product.colors[selectedColor]?.name}</h3>
               <div className="flex gap-2">
                 {product.colors.map((c, i) => (
                   <button key={c.hex} onClick={() => setSelectedColor(i)} className={`w-8 h-8 rounded-full transition-all ${i === selectedColor ? "ring-2 ring-offset-1 ring-primary" : "border border-outline-variant/30 hover:border-primary"}`} style={{ backgroundColor: c.hex }} aria-label={c.name} />
                 ))}
               </div>
             </div>
           )}

           {/* Size Options */}
           {product.sizes.length > 0 && (
             <div>
               <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-on-surface mb-2">Size: {product.sizes[selectedSize]}</h3>
               <div className="flex gap-2 flex-wrap">
                 {product.sizes.map((s, i) => (
                   <button key={s} onClick={() => setSelectedSize(i)} className={`px-3 py-1.5 border text-xs font-semibold transition-colors ${i === selectedSize ? "bg-primary text-on-primary border-primary" : "border-outline-variant/30 text-on-surface-variant hover:border-primary"}`}>{s}</button>
                 ))}
               </div>
             </div>
           )}

           {/* Description */}
           <p className="font-sans text-sm text-on-surface-variant leading-relaxed pt-2">{product.description}</p>

           {/* Action Buttons */}
           <div className="space-y-2 pt-4">
             <button onClick={handleAddToCart} className="w-full bg-primary text-on-primary font-sans text-sm font-bold uppercase tracking-widest py-3 rounded hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
               <ShoppingBag size={16} /> Add to Bag
             </button>
             <div className="flex gap-2">
               <button onClick={() => toggle(product)} className={`flex-1 border py-2.5 font-sans text-xs font-bold uppercase tracking-widest transition-colors rounded ${wished ? "border-red-400 text-red-500 bg-red-50" : "border-outline-variant text-primary hover:bg-surface-container-low"}`}>
                 <Heart size={13} className="inline mr-1" fill={wished ? "currentColor" : "none"} /> {wished ? "Saved" : "Save"}
               </button>
               <button className="w-12 border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded">
                 <Share2 size={14} />
               </button>
             </div>
           </div>

           {/* Info rows */}
           <div className="grid grid-cols-3 gap-2 pt-4 border-t border-outline-variant/20 text-center">
             {[{ icon: Truck, text: "Free\nShipping" }, { icon: RotateCcw, text: "30-Day\nReturns" }, { icon: Shield, text: "Authentic" }].map(({ icon: Icon, text }) => (
               <div key={text} className="flex flex-col items-center gap-1">
                 <Icon size={14} className="text-on-surface-variant/60" />
                 <span className="text-[10px] text-on-surface-variant/60 leading-snug">{text}</span>
               </div>
             ))}
           </div>
         </div>

         {/* Accordions - Below all details */}
         <div className="mt-6 border-t border-outline-variant/20 pt-4">
           {accordionItems.map((item) => (
             <div key={item.id} className="border-b border-outline-variant/20">
               <button onClick={() => setOpenAccordion(openAccordion === item.id ? null : item.id)} className="w-full flex justify-between items-center py-3 group">
                 <span className="font-sans text-xs font-semibold uppercase tracking-wider text-on-surface group-hover:text-secondary transition-colors">{item.title}</span>
                 <ChevronDown size={16} className={`text-outline transition-transform ${openAccordion === item.id ? "rotate-180" : ""}`} />
               </button>
               {openAccordion === item.id && (
                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="pb-3">
                   <p className="text-xs text-on-surface-variant/70 leading-relaxed">{item.content}</p>
                 </motion.div>
               )}
             </div>
           ))}
         </div>
        </motion.div>
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
