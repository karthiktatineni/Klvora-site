"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full max-w-md bg-background border-l border-outline-variant/20 shadow-cinematic flex flex-col"
            id="cart-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-serif text-headline-sm text-primary">Your Bag</h2>
                <span className="text-on-surface-variant/50 text-body-sm">
                  ({items.length} {items.length === 1 ? "item" : "items"})
                </span>
              </div>
              <div className="flex items-center gap-4">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="text-xs uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors font-bold font-sans"
                    title="Clear shopping bag"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                  aria-label="Close cart"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <ShoppingBag size={48} className="text-outline-variant mb-4" />
                  <p className="font-serif text-headline-sm text-on-surface-variant/50 mb-2">Your bag is empty</p>
                  <p className="text-body-sm text-on-surface-variant/40 mb-8">Discover our curated collections</p>
                  <Link
                    href="/collections"
                    onClick={onClose}
                    className="font-sans text-ui-button uppercase tracking-[0.05em] bg-primary text-on-primary px-8 py-3 hover:bg-primary/90 transition-colors"
                  >
                    Explore Collections
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.product.id + item.selectedColor + item.selectedSize}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-4 group"
                  >
                    <div className="w-20 h-28 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={80}
                        height={112}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif text-body-lg text-primary truncate">{item.product.name}</h3>
                      <p className="text-body-sm text-on-surface-variant/60 mt-0.5">
                        {item.selectedColor} · {item.selectedSize}
                      </p>
                      <p className="font-sans text-body-md text-primary mt-1 font-medium">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                          className="w-7 h-7 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:border-primary transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-body-sm text-primary font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                          className="w-7 h-7 rounded-full border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:border-primary transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.product.id, item.selectedColor, item.selectedSize)}
                          className="ml-auto text-body-sm text-on-surface-variant/40 hover:text-red-500 transition-colors underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-outline-variant/20 space-y-4 bg-surface-container-low/50">
                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    placeholder="Promo code"
                    className="flex-1 bg-transparent border border-outline-variant/30 rounded px-4 py-2 text-body-sm text-primary placeholder:text-on-surface-variant/30 outline-none focus:border-primary transition-colors"
                  />
                  <button className="px-4 py-2 border border-primary text-primary text-ui-button uppercase tracking-[0.05em] hover:bg-primary hover:text-on-primary transition-colors">
                    Apply
                  </button>
                </div>
                {/* Totals */}
                <div className="flex justify-between items-center">
                  <span className="text-body-md text-on-surface-variant">Subtotal</span>
                  <span className="font-serif text-headline-sm text-primary">{formatPrice(totalPrice())}</span>
                </div>
                <p className="text-body-sm text-on-surface-variant/50">Shipping calculated at checkout</p>
                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="block w-full bg-primary text-on-primary text-center font-sans text-ui-button uppercase tracking-[0.05em] py-4 hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="block w-full text-center text-body-sm text-on-surface-variant/60 hover:text-primary transition-colors underline"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
