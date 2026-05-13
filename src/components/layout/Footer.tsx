"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Globe, ArrowRight } from "lucide-react";

const FOOTER_LINKS = {
  Shop: ["New Arrivals", "Bestsellers", "Collections", "Sale"],
  About: ["Our Story", "Sustainability", "Craftsmanship", "Press"],
  Help: ["Contact Us", "Shipping", "Returns", "Size Guide", "FAQ"],
  Legal: ["Privacy Policy", "Terms of Service"],
};

export default function Footer() {
  return (
    <footer className="w-full bg-midnight-navy text-frost relative overflow-hidden" id="site-footer">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-display-sm lg:text-display-md text-frost mb-4"
              >
                Stay in the know
              </motion.h2>
              <p className="font-sans text-body-lg text-silver-chrome/70 max-w-md">
                Be the first to discover new collections, exclusive offers, and behind-the-scenes stories.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 bg-white/5 border border-white/15 rounded-none px-6 py-4 text-body-md text-frost placeholder:text-silver-chrome/40 outline-none focus:border-accent-gold/50 transition-colors"
                id="newsletter-email"
              />
              <button className="bg-frost text-midnight-navy px-8 py-4 font-sans text-ui-button uppercase tracking-[0.05em] hover:bg-accent-gold hover:text-midnight-navy transition-colors flex items-center gap-2 group"
                id="newsletter-subscribe"
              >
                Subscribe
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
            <Link href="/" className="font-serif text-[32px] font-medium tracking-tight text-frost mb-4 block">
              KLVORA
            </Link>
            <p className="font-sans text-body-md text-silver-chrome/50 max-w-xs mb-6">
              The theatricality of silence. Bridging heritage luxury and digital immersion.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-silver-chrome/60 hover:text-frost hover:border-white/40 transition-all" aria-label="Instagram">
                <Globe size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-silver-chrome/60 hover:text-frost hover:border-white/40 transition-all" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-sans text-label-caps uppercase tracking-[0.15em] text-frost/80 mb-5">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={
                        link === "Contact Us" ? "/contact" :
                        link === "FAQ" ? "/faq" :
                        link === "Size Guide" ? "/size-guide" :
                        link === "New Arrivals" || link === "Bestsellers" || link === "Collections" || link === "Sale" ? "/collections" :
                        link === "Our Story" || link === "Sustainability" || link === "Craftsmanship" ? "/editorial" :
                        link === "Shipping" || link === "Returns" ? "/faq" :
                        "#"
                      }
                      className="font-sans text-body-sm text-silver-chrome/50 hover:text-frost transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-body-sm text-silver-chrome/40">
            © {new Date().getFullYear()} KLVORA Fashion Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-body-sm text-silver-chrome/30">Powered by Vercel & Firebase</span>
          </div>
        </div>
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-t from-slate-blue/10 to-transparent rounded-full blur-[120px] pointer-events-none" />
    </footer>
  );
}
