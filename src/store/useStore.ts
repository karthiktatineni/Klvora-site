import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, type Product } from "@/lib/products";
import { getProducts, createProduct, updateProductDB, deleteProductDB } from "@/lib/supabase";

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
  removeItem: (productId: string, color?: string, size?: string) => void;
  updateQuantity: (productId: string, qty: number, color?: string, size?: string) => void;
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
      removeItem: (id, color, size) =>
        set((s) => ({
          items: s.items.filter(
            (i) =>
              !(
                i.product.id === id &&
                (!color || i.selectedColor === color) &&
                (!size || i.selectedSize === size)
              )
          ),
        })),
      updateQuantity: (id, qty, color, size) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.product.id === id &&
            (!color || i.selectedColor === color) &&
            (!size || i.selectedSize === size)
              ? { ...i, quantity: Math.max(1, qty) }
              : i
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
  activePreviewProduct: Product | null;
  isChatOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setSearchOpen: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  toggleDarkMode: () => void;
  showToast: (message: string) => void;
  setPreviewProduct: (product: Product | null) => void;
  setChatOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isCartOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      isDarkMode: false,
      toast: null,
      activePreviewProduct: null,
      isChatOpen: false,
      setCartOpen: (v) => set({ isCartOpen: v }),
      setSearchOpen: (v) => set({ isSearchOpen: v }),
      setMobileMenuOpen: (v) => set({ isMobileMenuOpen: v }),
      toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
      showToast: (message) => {
        set({ toast: { message, visible: true } });
        setTimeout(() => set({ toast: null }), 3000);
      },
      setPreviewProduct: (product) => set({ activePreviewProduct: product }),
      setChatOpen: (v) => set({ isChatOpen: v }),
    }),
    { 
      name: "klvora-ui",
      partialize: (state) => ({ 
        isDarkMode: state.isDarkMode 
      }),
    }
  )
);

/* ─── Product Catalog Store ─── */
interface CatalogState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (p: Omit<Product, "created_at" | "updated_at">) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (p: Partial<Product> & { id: string }) => Promise<void>;
}

export const useCatalogStore = create<CatalogState>()(
  (set) => ({
    // Initialize with local static products as fallback to prevent layout shift during SSR/hydration
    products: PRODUCTS,
    isLoading: false,
    fetchProducts: async () => {
      set({ isLoading: true });
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          set({ products: data, isLoading: false });
        } else {
          // Keep fallback products if database is empty
          set({ isLoading: false });
        }
      } catch (err) {
        console.error("Failed to load products from DB", err);
        set({ isLoading: false });
      }
    },
    addProduct: async (p) => {
      const newP = await createProduct(p);
      set((s) => ({ products: [newP, ...s.products] }));
    },
    removeProduct: async (id) => {
      await deleteProductDB(id);
      set((s) => ({ products: s.products.filter((item) => item.id !== id) }));
    },
    updateProduct: async (p) => {
      const updatedP = await updateProductDB(p.id, p);
      set((s) => ({
        products: s.products.map((item) => (item.id === p.id ? { ...item, ...updatedP } : item)),
      }));
    },
  })
);
