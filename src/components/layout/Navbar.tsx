"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon, MessageSquare } from "lucide-react";
import { useCartStore, useWishlistStore, useUIStore, useCatalogStore } from "@/store/useStore";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "./CartDrawer";

const NAV_LINKS = [


  { label: "Editorial", href: "/editorial" },
  { label: "Track Order", href: "/orders" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isCartOpen, setCartOpen, isSearchOpen, setSearchOpen, isMobileMenuOpen, setMobileMenuOpen, isDarkMode, toggleDarkMode, setChatOpen } = useUIStore();
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);
  const fetchProducts = useCatalogStore((s) => s.fetchProducts);

  useEffect(() => {
    // Fetch products from Supabase on app load
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1440px] rounded-full z-50 transition-all duration-500 ${scrolled
          ? "bg-white/70 dark:bg-midnight-navy/70 shadow-cinematic border-[0.5px] border-outline-variant/40"
          : "bg-white/10 dark:bg-black/10 border-[0.5px] border-outline-variant/20"
          } backdrop-blur-xl`}
        id="main-navbar"
      >
        <div className="flex justify-between items-center px-6 md:px-8 py-3.5">
          {/* Left — Nav Links (Desktop) */}
          <ul className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-sans text-[12px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant/70 hover:text-primary transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-primary p-1"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Center — Logo */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 font-serif text-[24px] font-medium tracking-tight text-primary hover:opacity-80 transition-opacity duration-300"
            id="brand-logo"
          >
            KLVORA
          </Link>

          {/* Right — Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="hover:opacity-70 transition-opacity duration-300 p-1"
              aria-label="Search"
              id="search-trigger"
            >
              <Search size={20} className="text-primary" />
            </button>

            <Link
              href="/wishlist"
              className="hover:opacity-70 transition-opacity duration-300 p-1 relative"
              aria-label="Wishlist"
              id="wishlist-link"
            >
              <Heart size={20} className="text-primary" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setCartOpen(true)}
              className="hover:opacity-70 transition-opacity duration-300 p-1 relative"
              aria-label="Shopping bag"
              id="cart-trigger"
            >
              <ShoppingBag size={20} className="text-primary" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setChatOpen(true)}
              className="hover:opacity-70 transition-opacity duration-300 p-1"
              aria-label="Support AI assistant"
              id="chatbot-trigger"
              title="Support AI Assistant"
            >
              <MessageSquare size={20} className="text-primary" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="hover:opacity-70 transition-opacity duration-300 p-1 hidden md:block"
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              {isDarkMode ? <Sun size={18} className="text-primary" /> : <Moon size={18} className="text-primary" />}
            </button>

            <Link
              href="/account"
              className="hover:opacity-70 transition-opacity duration-300 p-1 hidden md:block"
              aria-label="Account"
              id="account-link"
            >
              <User size={20} className="text-primary" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 px-8"
          >
            <nav className="flex flex-col gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif text-display-sm text-primary"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/80 dark:bg-midnight-navy/80 backdrop-blur-xl border-t border-outline-variant/20 px-4 py-2 flex justify-around items-center">
        <Link href="/" className="flex flex-col items-center gap-0.5 text-primary/60 hover:text-primary transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
          <span className="text-[10px] font-semibold tracking-wider uppercase">Home</span>
        </Link>
        <Link href="/collections" className="flex flex-col items-center gap-0.5 text-primary/60 hover:text-primary transition-colors">
          <Search size={20} />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Explore</span>
        </Link>
        <button onClick={() => setChatOpen(true)} className="flex flex-col items-center gap-0.5 text-primary/60 hover:text-primary transition-colors">
          <MessageSquare size={20} />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Support</span>
        </button>
        <Link href="/wishlist" className="flex flex-col items-center gap-0.5 text-primary/60 hover:text-primary transition-colors relative">
          <Heart size={20} />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-1 right-2 w-3.5 h-3.5 bg-secondary text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
          <span className="text-[10px] font-semibold tracking-wider uppercase">Saved</span>
        </Link>
        <Link href="/account" className="flex flex-col items-center gap-0.5 text-primary/60 hover:text-primary transition-colors">
          <User size={20} />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Profile</span>
        </Link>
      </div>
    </>
  );
}
