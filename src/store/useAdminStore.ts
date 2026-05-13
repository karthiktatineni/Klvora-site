import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS, Product } from "@/lib/products";

// --- Stock Management ---
interface ProductStore {
  stocks: Record<string, number>;
  updateStock: (productId: string, quantity: number) => void;
  decreaseStock: (productId: string, amount: number) => void;
  getStock: (productId: string) => number;
}

// Initialize with default 100 stock for all products
const initialStocks = PRODUCTS.reduce((acc, p) => {
  acc[p.id] = 100;
  return acc;
}, {} as Record<string, number>);

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      stocks: initialStocks,
      updateStock: (productId, quantity) =>
        set((state) => ({
          stocks: { ...state.stocks, [productId]: quantity },
        })),
      decreaseStock: (productId, amount) =>
        set((state) => ({
          stocks: {
            ...state.stocks,
            [productId]: Math.max(0, (state.stocks[productId] || 0) - amount),
          },
        })),
      getStock: (productId) => get().stocks[productId] ?? 0,
    }),
    { name: "aura-stock" }
  )
);

// --- Admin & Orders Management ---
export type OrderStatus = "Processing" | "Packing" | "Shipping" | "Delivered";

export interface Order {
  id: string;
  date: string;
  customerName: string;
  email: string;
  total: number;
  status: OrderStatus;
  items: { productId: string; name: string; quantity: number; price: number }[];
}

interface AdminStore {
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      orders: [
        {
          id: "KLVORA-8F92A1",
          date: new Date().toISOString(),
          customerName: "Emma Stone",
          email: "emma@example.com",
          total: 1250,
          status: "Processing",
          items: [{ productId: "obsidian-tote", name: "The Obsidian Tote", quantity: 1, price: 1250 }],
        }
      ],
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        })),
    }),
    { name: "aura-admin-orders" }
  )
);
