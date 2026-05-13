"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Lock, Truck, ChevronLeft, Check, CreditCard } from "lucide-react";
import { useCartStore, useUIStore } from "@/store/useStore";
import { useAdminStore, useProductStore } from "@/store/useAdminStore";
import { formatPrice } from "@/lib/utils";
import { saveOrder, updateProductStock, saveUserProfile, getUserProfile } from "@/lib/db";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter, usePathname } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { items, totalPrice, clearCart } = useCartStore();
  const { showToast } = useUIStore();
  const { addOrder } = useAdminStore();
  const { decreaseStock } = useProductStore();
  const [step, setStep] = useState<"info" | "success">("info");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [saveAddress, setSaveAddress] = useState(false);
  
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    landmark: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setCurrentUser(u);
        setForm(prev => ({ ...prev, email: u.email || "" }));
        // Auto-load saved address
        const unsubProfile = getUserProfile(u.uid, (profile: any) => {
          if (profile?.savedAddress) {
            setForm(prev => ({ ...prev, ...profile.savedAddress }));
          }
        });
        return () => unsubProfile();
      } else {
        // Redirect to login if not authenticated
        router.push(`/account?redirect=${pathname}`);
      }
    });
    return () => unsubscribe();
  }, [router, pathname]);

  if (items.length === 0 && step !== "success") {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-headline-lg text-primary mb-4">Your bag is empty</h1>
          <Link href="/collections" className="font-sans text-ui-button uppercase tracking-[0.05em] text-secondary underline">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", duration: 0.8 }} className="text-center max-w-md mx-auto px-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }} className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-8">
            <Check size={36} />
          </motion.div>
          <h1 className="font-serif text-headline-lg text-primary mb-4">Order Confirmed</h1>
          <p className="font-sans text-body-lg text-on-surface-variant mb-2">Thank you for your purchase.</p>
          <p className="font-sans text-body-md text-on-surface-variant/60 mb-8">You will receive a confirmation email shortly.</p>
          <Link href="/" className="font-sans text-ui-button uppercase tracking-[0.05em] bg-primary text-on-primary px-8 py-3 inline-block hover:bg-primary/90 transition-colors">Continue Shopping</Link>
        </motion.div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip'];
    const missing = requiredFields.filter(f => !form[f as keyof typeof form]);
    if (missing.length > 0) {
      alert(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }

    const hp = (document.getElementById("honeypot") as HTMLInputElement)?.value;
    if (hp) return; 

    try {
      // Save profile if requested
      if (saveAddress && currentUser) {
        await saveUserProfile(currentUser.uid, { savedAddress: form });
      }

      await saveOrder({
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          color: i.selectedColor,
          size: i.selectedSize
        })),
        total: totalPrice(),
        customer: { ...form, customerId: currentUser?.uid || null },
        status: "Processing",
      } as any);

      try {
        for (const item of items) {
          await updateProductStock(item.product.id, item.quantity);
        }
      } catch (err) {}

      clearCart();
      showToast("Order placed successfully!");
      setStep("success");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      alert("Error placing order. Please try again.");
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <Link href="/collections" className="inline-flex items-center gap-2 font-sans text-body-sm text-on-surface-variant/60 hover:text-primary mb-8 transition-colors">
          <ChevronLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="font-serif text-headline-lg text-primary mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-8">
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h2 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-2">Contact Information</h2>
              <div className="hidden" aria-hidden="true">
                <input id="honeypot" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <input value={form.email} onChange={(e)=>setForm({...form, email: e.target.value})} placeholder="Email address" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
            </div>

            <div className="glass-card rounded-xl p-6 space-y-4">
              <h2 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-2">Shipping Address</h2>
              <div className="grid grid-cols-2 gap-4">
                <input required value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} placeholder="First Name *" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
                <input required value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} placeholder="Last Name *" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
              </div>
              <input required type="tel" value={form.phone} onChange={(e)=>setForm({...form, phone: e.target.value})} placeholder="Mobile Number *" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
              <input required value={form.address} onChange={(e)=>setForm({...form, address: e.target.value})} placeholder="Street Address *" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
              <input value={form.landmark} onChange={(e)=>setForm({...form, landmark: e.target.value})} placeholder="Landmark (Optional)" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
              <div className="grid grid-cols-3 gap-4">
                <input required value={form.city} onChange={(e)=>setForm({...form, city: e.target.value})} placeholder="City *" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
                <input required value={form.state} onChange={(e)=>setForm({...form, state: e.target.value})} placeholder="State *" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
                <input required value={form.zip} onChange={(e)=>setForm({...form, zip: e.target.value})} placeholder="ZIP *" className="w-full bg-transparent border border-outline-variant/30 rounded px-4 py-3 text-body-md text-primary outline-none focus:border-primary transition-colors" />
              </div>
              
              {currentUser && (
                <label className="flex items-center gap-3 cursor-pointer pt-2 group">
                  <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="w-4 h-4 rounded border-outline-variant/30" />
                  <span className="text-body-sm text-on-surface-variant/70 group-hover:text-primary">Save address for future use</span>
                </label>
              )}
            </div>

            <div className="glass-card rounded-xl p-6 space-y-4">
              <h2 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-2">Payment</h2>
              <div className="p-4 bg-surface-container-low rounded border border-outline-variant/20">
                <p className="text-body-sm text-on-surface-variant">Cash on Delivery (COD)</p>
              </div>
            </div>

            <button onClick={handlePlaceOrder} className="w-full bg-primary text-on-primary font-sans text-ui-button uppercase tracking-[0.05em] py-4 hover:bg-primary/90 transition-colors">
              Place Order — {formatPrice(totalPrice())}
            </button>
          </div>

          <aside className="w-full lg:w-96 shrink-0">
            <div className="glass-card rounded-xl p-6 sticky top-28">
              <h2 className="font-sans text-label-caps uppercase tracking-[0.15em] text-on-surface mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-surface-container-low flex-shrink-0 relative">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif text-body-md text-primary truncate">{item.product.name}</h3>
                      <p className="text-body-sm text-on-surface-variant/50">{item.selectedSize} · x{item.quantity}</p>
                      <p className="text-body-md text-primary font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-outline-variant/20 pt-4 flex justify-between items-center">
                <span className="font-sans text-body-lg text-on-surface">Total</span>
                <span className="font-serif text-headline-sm text-primary">{formatPrice(totalPrice())}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
