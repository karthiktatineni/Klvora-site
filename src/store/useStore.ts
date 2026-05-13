import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/products";

/* ─── Cart ─── */
export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) =>
              i.product.id === item.product.id &&
              i.selectedColor === item.selectedColor &&
              i.selectedSize === item.selectedSize
          );
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.product.id === item.product.id &&
                i.selectedColor === item.selectedColor &&
                i.selectedSize === item.selectedSize
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
      updateQuantity: (id, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === id ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: "aura-cart" }
  )
);

/* ─── Wishlist ─── */
interface WishlistState {
  items: Product[];
  addItem: (p: Product) => void;
  removeItem: (id: string) => void;
  isWished: (id: string) => boolean;
  toggle: (p: Product) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (p) =>
        set((s) =>
          s.items.find((i) => i.id === p.id)
            ? s
            : { items: [...s.items, p] }
        ),
      removeItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      isWished: (id) => get().items.some((i) => i.id === id),
      toggle: (p) => {
        if (get().isWished(p.id)) {
          get().removeItem(p.id);
        } else {
          get().addItem(p);
        }
      },
    }),
    { name: "aura-wishlist" }
  )
);

/* ─── Recently Viewed ─── */
interface RecentlyViewedState {
  items: Product[];
  addItem: (p: Product) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (p) =>
        set((s) => ({
          items: [p, ...s.items.filter((i) => i.id !== p.id)].slice(0, 20),
        })),
    }),
    { name: "aura-recent" }
  )
);

/* ─── UI State ─── */
interface UIState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  isDarkMode: boolean;
  toast: { message: string; visible: boolean } | null;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  toggleDarkMode: () => void;
  showToast: (message: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      isDarkMode: false,
      toast: null,
      setCartOpen: (v) => set({ isCartOpen: v }),
      setSearchOpen: (v) => set({ isSearchOpen: v }),
      setMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      showToast: (message) => {
        set({ toast: { message, visible: true } });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    { 
      name: "klvora-ui",
      partialize: (state) => ({ 
        isDarkMode: state.isDarkMode 
      }),
    }
  )
);
