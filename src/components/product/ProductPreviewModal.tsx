"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, Heart, Star, Minus, Plus, ArrowRight, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { useCartStore, useWishlistStore, useUIStore } from "@/store/useStore";
import { formatPrice } from "@/lib/utils";

export default function ProductPreviewModal() {
  const activeProduct = useUIStore((s) => s.activePreviewProduct);
  const setPreviewProduct = useUIStore((s) => s.setPreviewProduct);

  const { toggle, isWished } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUIStore((s) => s.setCartOpen);
  const showToast = useUIStore((s) => s.showToast);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Initialize selections when product changes
  useEffect(() => {
    if (activeProduct) {
      setActiveImageIndex(0);
      setSelectedColor(activeProduct.colors[0]?.name || "");
      setSelectedSize(activeProduct.sizes[0] || "");
      setQuantity(1);
      setIsAutoplay(true);
    }
  }, [activeProduct]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (activeProduct) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [activeProduct]);

  // Autoplay slideshow effect
  useEffect(() => {
    if (!activeProduct || !isAutoplay || activeProduct.images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImageIndex((prev) => (prev < activeProduct.images.length - 1 ? prev + 1 : 0));
    }, 3000);

    return () => clearInterval(interval);
  }, [activeProduct, isAutoplay]);

  if (!activeProduct) return null;

  const wished = isWished(activeProduct.id);

  const handleAddToCart = () => {
    addItem({
      product: activeProduct,
      quantity,
      selectedColor,
      selectedSize: selectedSize || "One Size",
    });
    setPreviewProduct(null);
    setCartOpen(true);
    showToast(`Added ${quantity}x ${activeProduct.name} to cart.`);
  };

  const handleToggleWishlist = () => {
    toggle(activeProduct);
    showToast(wished ? `Removed ${activeProduct.name} from wishlist.` : `Added ${activeProduct.name} to wishlist.`);
  };

  const handlePreviousImage = () => {
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : activeProduct.images.length - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev < activeProduct.images.length - 1 ? prev + 1 : 0));
  };

  const handlePlayPause = () => {
    setIsAutoplay(!isAutoplay);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setPreviewProduct(null)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md cursor-zoom-out"
        />

        {/* Modal Content container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#14181f] text-primary dark:text-frost rounded-2xl shadow-cinematic overflow-hidden flex flex-col md:flex-row border border-outline-variant/20 max-h-[90vh] md:max-h-[85vh] z-10"
        >
          {/* Close button */}
          <button
            onClick={() => setPreviewProduct(null)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-outline-variant/10 text-primary dark:text-frost flex items-center justify-center hover:bg-primary hover:text-on-primary dark:hover:bg-frost dark:hover:text-black transition-colors"
            aria-label="Close preview"
          >
            <X size={18} />
          </button>

          {/* Left Side: Product Gallery */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-outline-variant/15">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-surface-container-low mb-4 group">
              <Image
                src={activeProduct.images[activeImageIndex] || activeProduct.images[0]}
                alt={activeProduct.name}
                fill
                className="object-cover animate-fade-in"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
               
              {/* Navigation Buttons */}
              {activeProduct.images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      handlePreviousImage();
                      setIsAutoplay(false);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-outline-variant/30 text-primary dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => {
                      handleNextImage();
                      setIsAutoplay(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-outline-variant/30 text-primary dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} />
                  </button>
                    
                  {/* Play/Pause Button */}
                  <button
                    onClick={handlePlayPause}
                    className="absolute top-3 left-3 z-10 w-10 h-10 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-md border border-outline-variant/30 text-primary dark:text-white flex items-center justify-center hover:bg-white dark:hover:bg-black transition-all opacity-0 group-hover:opacity-100"
                    aria-label={isAutoplay ? "Pause slideshow" : "Play slideshow"}
                    title={isAutoplay ? "Pause" : "Play"}
                  >
                    {isAutoplay ? <Pause size={18} /> : <Play size={18} />}
                  </button>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 dark:bg-white/10 z-10">
                    <motion.div
                      className="h-full bg-primary dark:bg-accent-gold"
                      initial={{ width: "0%" }}
                      animate={{ width: isAutoplay ? "100%" : `${(activeImageIndex / activeProduct.images.length) * 100}%` }}
                      transition={isAutoplay ? { duration: 3, ease: "linear" } : { duration: 0.3 }}
                    />
                  </div>

                  {/* Image Counter */}
                  <div className="absolute bottom-3 right-3 z-10 bg-black/60 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <span className="font-sans text-xs text-white/90 dark:text-white font-semibold">
                      {activeImageIndex + 1} / {activeProduct.images.length}
                    </span>
                  </div>
                </>
              )}
            </div>
            {/* Thumbnail Selectors */}
            {activeProduct.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {activeProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`relative w-16 h-20 rounded-md overflow-hidden bg-surface-container-low flex-shrink-0 border-2 transition-all ${
                      activeImageIndex === i ? "border-primary dark:border-accent-gold scale-[1.03]" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${activeProduct.name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Side: Product Details */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-full">
            <div className="space-y-6">
              {/* Product Meta */}
              <div>
                <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase text-on-surface-variant/50 dark:text-silver-chrome/40 mb-1">
                  {activeProduct.brand}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl text-primary dark:text-white leading-tight">
                  {activeProduct.name}
                </h2>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex text-accent-gold text-xs">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < Math.floor(activeProduct.rating) ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-on-surface-variant/50 dark:text-silver-chrome/40 font-mono">
                    ({activeProduct.reviewCount} Reviews)
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="flex items-baseline gap-3">
                <span className="font-sans text-xl md:text-2xl text-primary dark:text-white font-medium">
                  {formatPrice(activeProduct.price)}
                </span>
                {activeProduct.originalPrice && (
                  <span className="text-body-md text-on-surface-variant/40 dark:text-silver-chrome/30 line-through">
                    {formatPrice(activeProduct.originalPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="font-sans text-sm text-on-surface-variant dark:text-silver-chrome/70 leading-relaxed">
                {activeProduct.description}
              </p>

              {/* Color Selector */}
              {activeProduct.colors.length > 0 && (
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 dark:text-silver-chrome/50 block mb-3">
                    Color: <span className="text-primary dark:text-white font-semibold">{selectedColor}</span>
                  </span>
                  <div className="flex gap-3">
                    {activeProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border border-outline-variant/30 flex items-center justify-center transition-all ${
                          selectedColor === c.name ? "ring-2 ring-primary dark:ring-accent-gold scale-110" : "hover:scale-[1.05]"
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {activeProduct.sizes.length > 0 && (
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 dark:text-silver-chrome/50 block mb-3">
                    Size: <span className="text-primary dark:text-white font-semibold">{selectedSize}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeProduct.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 border rounded font-sans text-xs uppercase transition-all ${
                          selectedSize === s
                            ? "bg-primary text-on-primary border-primary dark:bg-frost dark:text-black dark:border-frost font-bold"
                            : "border-outline-variant/30 text-on-surface-variant hover:border-primary dark:hover:border-frost"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 dark:text-silver-chrome/50 block mb-3">
                  Quantity
                </span>
                <div className="flex items-center w-max border border-outline-variant/30 rounded bg-black/5 dark:bg-white/5">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-on-surface-variant hover:text-primary dark:hover:text-white transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 py-2 text-sm font-semibold font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2 text-on-surface-variant hover:text-primary dark:hover:text-white transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="border-t border-outline-variant/10 pt-6 mt-8 space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary text-on-primary dark:bg-frost dark:text-black font-sans font-bold text-xs uppercase tracking-widest py-4 rounded hover:bg-secondary dark:hover:bg-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-primary dark:border-frost"
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
                <button
                  onClick={handleToggleWishlist}
                  className={`w-12 h-12 border rounded flex items-center justify-center transition-colors ${
                    wished
                      ? "border-red-500 bg-red-500/10 text-red-500"
                      : "border-outline-variant/30 text-on-surface-variant hover:text-primary dark:hover:text-white"
                  }`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={16} fill={wished ? "currentColor" : "none"} />
                </button>
              </div>

              {/* Link to Full Page */}
              <Link
                href={`/product/${activeProduct.id}`}
                onClick={() => setPreviewProduct(null)}
                className="w-full flex items-center justify-center gap-2 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant/60 hover:text-primary dark:hover:text-white transition-colors py-2 group"
              >
                View Full Product Details
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
