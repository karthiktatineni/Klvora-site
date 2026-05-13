"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Package, Heart, MapPin, Bell, Settings, LogOut, Mail, Lock, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from "firebase/auth";
import { useUIStore } from "@/store/useStore";

export default function AccountPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { showToast } = useUIStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuth = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields");
      return;
    }
    setAuthLoading(true);
    try {
      if (tab === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        showToast("Account created successfully!");
      }
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      showToast("Please enter your email address first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      showToast("Password reset email sent!");
    } catch (error: any) {
      showToast(error.message);
    }
  };

  const handleSignOut = () => signOut(auth);

  if (loading) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-28 pb-20 min-h-screen flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="font-serif text-headline-lg text-primary mb-2">Welcome to KLVORA</h1>
            <p className="font-sans text-body-md text-on-surface-variant">Sign in to access your account</p>
          </div>

          {/* Tabs */}
          <div className="flex mb-8 border-b border-outline-variant/20">
            <button onClick={() => setTab("login")} className={`flex-1 py-3 font-sans text-ui-button uppercase tracking-[0.05em] transition-colors border-b-2 ${tab === "login" ? "border-primary text-primary" : "border-transparent text-on-surface-variant/50"}`}>Sign In</button>
            <button onClick={() => setTab("register")} className={`flex-1 py-3 font-sans text-ui-button uppercase tracking-[0.05em] transition-colors border-b-2 ${tab === "register" ? "border-primary text-primary" : "border-transparent text-on-surface-variant/50"}`}>Create Account</button>
          </div>

          <div className="glass-card rounded-2xl p-8 space-y-5">
            {tab === "register" && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
                <input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name" 
                  className="w-full bg-transparent border border-outline-variant/30 rounded pl-12 pr-4 py-3 text-body-md text-primary placeholder:text-on-surface-variant/30 outline-none focus:border-primary transition-colors" 
                />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                className="w-full bg-transparent border border-outline-variant/30 rounded pl-12 pr-4 py-3 text-body-md text-primary placeholder:text-on-surface-variant/30 outline-none focus:border-primary transition-colors" 
              />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" 
                className="w-full bg-transparent border border-outline-variant/30 rounded pl-12 pr-4 py-3 text-body-md text-primary placeholder:text-on-surface-variant/30 outline-none focus:border-primary transition-colors" 
              />
            </div>

            {tab === "login" && (
              <div className="flex justify-end -mt-2">
                <button 
                  onClick={handleResetPassword}
                  className="text-[10px] uppercase tracking-[0.1em] text-on-surface-variant/50 hover:text-primary transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              onClick={handleAuth} 
              disabled={authLoading}
              className="w-full bg-primary text-on-primary font-sans text-ui-button uppercase tracking-[0.05em] py-4 hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              {authLoading && <Loader2 size={16} className="animate-spin" />}
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>

            <p className="text-center text-[10px] text-on-surface-variant/40 uppercase tracking-widest mt-6">
              Premium Identity Protection Enabled
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Logged in dashboard
  const menuItems = [
    { icon: Package, label: "Orders", count: 3 },
    { icon: Heart, label: "Wishlist", href: "/wishlist" },
    { icon: MapPin, label: "Addresses" },
    { icon: Bell, label: "Notifications", count: 2 },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <div className="pt-28 pb-20 min-h-screen max-w-[1440px] mx-auto px-6 md:px-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-serif text-headline-lg text-primary mb-1">Welcome back, {user.email?.split('@')[0]}</h1>
            <p className="font-sans text-body-md text-on-surface-variant">Manage your KLVORA experience</p>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-body-sm text-on-surface-variant/60 hover:text-red-500 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/orders" className="glass-card rounded-xl p-6 flex items-center gap-4 hover:shadow-float transition-all group">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <Package size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-body-lg text-primary font-medium">Track Orders</h3>
              <p className="text-[10px] text-on-surface-variant/40 uppercase tracking-widest mt-1">Real-time status</p>
            </div>
          </Link>
          <Link href="/wishlist" className="glass-card rounded-xl p-6 flex items-center gap-4 hover:shadow-float transition-all group">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <Heart size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-body-lg text-primary font-medium">Wishlist</h3>
            </div>
          </Link>
          <div className="glass-card rounded-xl p-6 flex items-center gap-4 hover:shadow-float transition-all group opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center">
              <Settings size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-body-lg text-primary font-medium">Settings</h3>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
