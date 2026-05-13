"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Package, Clock, Truck, CheckCircle, Search, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { subscribeToCustomerOrders } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default function OrdersPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setOrders([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    // We don't check 'loading' here because it starts true and we WANT to trigger the fetch
    const unsub = subscribeToCustomerOrders(user.uid, user.email || "", (data) => {
      setOrders(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user?.uid]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing": return <Clock size={16} className="text-orange-500" />;
      case "Packing": return <Package size={16} className="text-blue-500" />;
      case "Shipping": return <Truck size={16} className="text-purple-500" />;
      case "Delivered": return <CheckCircle size={16} className="text-green-500" />;
      default: return <Clock size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="font-serif text-headline-lg text-primary mb-4">Please Sign In</h1>
          <p className="font-sans text-body-lg text-on-surface-variant mb-8">You need to be logged in to track your orders.</p>
          <Link href="/account" className="bg-primary text-on-primary px-8 py-3 font-sans text-ui-button uppercase tracking-[0.05em]">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen max-w-[1440px] mx-auto px-6 md:px-16">
      <Link href="/account" className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-primary mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to Account
      </Link>

      <div className="flex flex-col md:row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="font-serif text-display-sm text-primary mb-2">Track Your Orders</h1>
          <p className="font-sans text-body-lg text-on-surface-variant">Real-time progress for your KLVORA selections.</p>
        </div>
        <div className="glass-card rounded-full px-6 py-2 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">Live Tracking Active</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card rounded-2xl p-20 text-center">
          <ShoppingBag size={48} className="mx-auto mb-6 text-on-surface-variant/20" />
          <h2 className="font-serif text-headline-md text-primary mb-2">No orders yet</h2>
          <p className="font-sans text-body-md text-on-surface-variant mb-8">Your journey with KLVORA is just beginning.</p>
          <Link href="/collections" className="bg-primary text-on-primary px-8 py-3 font-sans text-ui-button uppercase tracking-[0.05em]">Explore Collections</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl overflow-hidden border border-outline-variant/10"
            >
              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[10px] font-bold tracking-widest uppercase bg-surface-container-low px-3 py-1 rounded text-on-surface-variant">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
                      {getStatusIcon(order.status)}
                      <span className="font-sans text-[10px] font-bold tracking-widest uppercase text-primary">
                        {order.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-1">Date</p>
                      <p className="text-body-sm font-medium">{order.createdAt?.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) || "Just now"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-1">Total</p>
                      <p className="text-body-sm font-medium">{formatPrice(order.total)}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-1">Shipping To</p>
                      <p className="text-body-sm font-medium truncate">
                        {order.customer?.address || order.address || "Digital Order"}, {order.customer?.city || order.city || ""}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-64 space-y-3">
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-2">Items</p>
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-body-sm">
                      <span className="truncate flex-1">{item.name} <span className="text-on-surface-variant/40">x{item.quantity}</span></span>
                      <span className="font-medium ml-4">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="bg-surface-container-low px-8 py-6 border-t border-outline-variant/10">
                <div className="relative h-1 bg-outline-variant/20 rounded-full mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ 
                      width: order.status === "Processing" ? "25%" : 
                             order.status === "Packing" ? "50%" : 
                             order.status === "Shipping" ? "75%" : "100%" 
                    }}
                    className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000"
                  />
                  <div className="absolute inset-0 flex justify-between -top-2">
                    {["Processing", "Packing", "Shipping", "Delivered"].map((s, i) => (
                      <div key={s} className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        ["Processing", "Packing", "Shipping", "Delivered"].indexOf(order.status) >= i 
                        ? "bg-primary border-primary text-on-primary" 
                        : "bg-surface-container-low border-outline-variant/30 text-on-surface-variant/20"
                      }`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-[9px] font-bold tracking-widest uppercase text-on-surface-variant/40">
                  <span>Processing</span>
                  <span>Packing</span>
                  <span>Shipping</span>
                  <span>Delivered</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
