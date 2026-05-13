"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProductStore, OrderStatus } from "@/store/useAdminStore";
import { PRODUCTS } from "@/lib/products";
import { Package, TrendingUp, Users, DollarSign, Search, Edit2, Box, LogOut } from "lucide-react";
import { formatPrice } from "@/lib/utils";

import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { subscribeToOrders, updateOrderStatusInDb } from "@/lib/db";

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const { stocks, updateStock } = useProductStore();
  const [activeTab, setActiveTab] = useState<"orders" | "inventory">("orders");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (user) {
      console.log("Admin sub starting for:", user.email);
      const unsubscribeOrders = subscribeToOrders((data) => {
        console.log("Admin data received:", data.length, "orders");
        setOrders(data);
      });
      return () => unsubscribeOrders();
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Invalid admin credentials");
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <div className="pt-28 text-center">Loading...</div>;

  if (!user) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl w-full max-w-md">
          <h1 className="font-serif text-headline-lg text-primary mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Admin Email" 
              className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 outline-none focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 outline-none focus:border-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-primary text-on-primary py-4 font-sans uppercase tracking-widest hover:bg-primary/90 transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

  const STATUS_COLORS: Record<OrderStatus, string> = {
    Processing: "bg-blue-100 text-blue-700 border-blue-200",
    Packing: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Shipping: "bg-purple-100 text-purple-700 border-purple-200",
    Delivered: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="pt-28 pb-20 min-h-screen bg-surface-container-low/30">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="font-serif text-headline-lg text-primary">Admin Control Center</h1>
            <p className="font-sans text-body-md text-on-surface-variant mt-2">Manage orders, inventory, and platform performance.</p>
            <p className="text-[10px] text-on-surface-variant/40 mt-1">Authorized Access: admin@klvora.in</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-body-sm text-on-surface-variant/60 hover:text-red-500 transition-colors mb-2"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Revenue", value: formatPrice(totalRevenue), icon: DollarSign },
            { label: "Active Orders", value: orders.filter(o => o.status !== "Delivered").length, icon: Package },
            { label: "Total Customers", value: new Set(orders.map(o => o.customer?.email)).size, icon: Users },
            { label: "Avg. Order Value", value: orders.length ? formatPrice(totalRevenue / orders.length) : formatPrice(0), icon: TrendingUp },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-6 bg-surface">
              <div className="flex items-center justify-between mb-4">
                <span className="font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/70">{stat.label}</span>
                <stat.icon size={18} className="text-secondary" />
              </div>
              <p className="font-serif text-headline-md text-primary">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-outline-variant/20">
          <button onClick={() => setActiveTab("orders")} className={`pb-4 font-sans text-ui-button uppercase tracking-[0.05em] transition-all border-b-2 ${activeTab === "orders" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}>
            Orders Management
          </button>
          <button onClick={() => setActiveTab("inventory")} className={`pb-4 font-sans text-ui-button uppercase tracking-[0.05em] transition-all border-b-2 ${activeTab === "inventory" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"}`}>
            Real-time Inventory
          </button>
        </div>

        {/* Content */}
        {activeTab === "orders" && (
          <div className="glass-card bg-surface rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
              <h2 className="font-sans text-headline-sm text-primary">Recent Orders</h2>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
                <input 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders..." 
                  className="pl-9 pr-4 py-2 rounded-lg border border-outline-variant/30 bg-surface text-body-sm outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/20 bg-surface-container-low/30">
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Order ID</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Date</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Customer</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Amount</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Status</th>
                    <th className="p-4 font-sans text-label-caps uppercase tracking-[0.1em] text-on-surface-variant/60">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.filter(o => 
                    o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                    `${o.customer?.firstName} ${o.customer?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    o.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((order) => (
                    <tr key={order.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low/20 transition-colors">
                      <td className="p-4 font-medium text-body-sm text-primary">{order.id.slice(-8).toUpperCase()}</td>
                      <td className="p-4 text-body-sm text-on-surface-variant">
                        {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString() : "Just now"}
                      </td>
                      <td className="p-4 text-body-sm text-on-surface-variant">
                        {order.customer?.firstName} {order.customer?.lastName}<br/>
                        <span className="text-[12px] opacity-60">{order.customer?.email}</span>
                      </td>
                      <td className="p-4 font-medium text-body-sm text-primary">{formatPrice(order.total)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase border ${STATUS_COLORS[order.status as OrderStatus] || "bg-gray-100"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatusInDb(order.id, e.target.value)}
                          className="bg-surface border border-outline-variant/30 rounded p-1.5 text-body-sm outline-none cursor-pointer focus:border-primary"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipping">Shipping</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-on-surface-variant">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "inventory" && (
          <div className="glass-card bg-surface rounded-xl overflow-hidden border border-outline-variant/20">
            <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface-container-low/50">
              <h2 className="font-sans text-headline-sm text-primary">Real-time Stock Management</h2>
              <div className="text-body-sm flex items-center gap-2 text-on-surface-variant/70">
                <Box size={16} /> Auto-updates on orders
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-surface-container-low/10">
              {PRODUCTS.map((product) => (
                <div key={product.id} className="border border-outline-variant/20 rounded-xl p-4 bg-surface flex items-center gap-4 hover:border-primary/30 transition-colors">
                  <div className="w-16 h-20 rounded bg-surface-container-low shrink-0 overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-body-md text-primary mb-1 truncate">{product.name}</h3>
                    <p className="text-label-caps text-on-surface-variant/50 uppercase tracking-widest mb-3">{product.category}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-body-sm font-medium">Stock:</span>
                      <input 
                        type="number"
                        min="0"
                        value={stocks[product.id] ?? 0}
                        onChange={(e) => updateStock(product.id, parseInt(e.target.value) || 0)}
                        className={`w-20 px-2 py-1 rounded border outline-none transition-colors ${
                          (stocks[product.id] ?? 0) < 10 ? "border-red-300 text-red-600 bg-red-50" : "border-outline-variant/30 focus:border-primary"
                        }`}
                      />
                      {(stocks[product.id] ?? 0) < 10 && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Low</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
