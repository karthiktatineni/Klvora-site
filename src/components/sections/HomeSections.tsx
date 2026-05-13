"use client";

import { motion } from "framer-motion";
import { PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function NewArrivals() {
  const items = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  return (
    <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto" id="new-arrivals">
      <div className="flex items-end justify-between mb-12">
        <div>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-sans text-label-caps uppercase tracking-[0.2em] text-secondary mb-3 block">Just Landed</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-display-sm md:text-headline-lg text-primary">New Arrivals</motion.h2>
        </div>
        <Link href="/collections?filter=new" className="hidden md:flex items-center gap-2 font-sans text-ui-button uppercase tracking-[0.05em] text-primary hover:text-secondary transition-colors group">
          View All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

export function TrendingProducts() {
  const items = PRODUCTS.filter((p) => p.isTrending).slice(0, 4);
  return (
    <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto" id="trending">
      <div className="flex items-end justify-between mb-12">
        <div>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-sans text-label-caps uppercase tracking-[0.2em] text-accent-gold mb-3 block flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-accent-gold" />Trending Now</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-display-sm md:text-headline-lg text-primary">Most Wanted</motion.h2>
        </div>
        <Link href="/collections?filter=trending" className="hidden md:flex items-center gap-2 font-sans text-ui-button uppercase tracking-[0.05em] text-primary hover:text-secondary transition-colors group">
          Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

export function EditorialShowcase() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" id="editorial-showcase">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="lg:col-span-7 relative aspect-[4/3] overflow-hidden bg-surface-container-low group cursor-pointer">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRH9wAlWRVvWhwaD8Dc3mD9m_L4s7HaLVoo2GxFCObQYCyu1oLRo5z6iC1-OqOEvCEAYpp2uY4THMYwpWJ1hNjpoAeEwuv5cE0vz72RnMDQhShV-ihY2-MadWPRlp-PrnCvNeT3IcCHt4XJ-g4iad9bru826_cL0VYYhzlpDu1fUnBo1ot0hKSm8Wo5FHIoVJphJ96W4Lhx_RWAdSDJg0Fr88vMVxO-AwlqUkOIZgVcSwalbKzLs8H_RhSHcM0T82tW2WCVnoHI9o" alt="Editorial fashion showcase" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            <div className="absolute bottom-6 left-6 glass-light rounded-xl p-5 max-w-xs opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="font-sans text-label-caps uppercase tracking-[0.15em] text-primary/70 mb-1">01 / Archive</p>
              <h3 className="font-serif text-headline-sm text-primary mb-2">The Obsidian Tote</h3>
              <p className="text-body-sm text-on-surface-variant mb-3">Crafted from flawless matte leather, embodying the theatricality of silence.</p>
              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-3">
                <span className="text-body-md text-primary font-medium">$1,250</span>
                <Link href="/product/obsidian-tote" className="font-sans text-ui-button uppercase tracking-[0.05em] bg-primary text-on-primary px-5 py-1.5 hover:bg-secondary transition-colors text-[11px]">Discover</Link>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-5 flex flex-col justify-center lg:pl-8">
            <div className="w-16 h-px bg-primary mb-8" />
            <h2 className="font-serif text-headline-lg text-primary mb-6">Structured Minimalism</h2>
            <p className="font-sans text-body-lg text-on-surface-variant mb-8 leading-relaxed">Our approach strips away the unnecessary, leaving only the essential. Every curve is deliberate, every texture selected to interact with light.</p>
            <Link href="/collections" className="font-sans text-ui-button uppercase tracking-[0.05em] border border-primary text-primary px-8 py-3 w-max hover:bg-primary hover:text-on-primary transition-colors">View Collection</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function BrandStory() {
  return (
    <section className="py-24 md:py-40 bg-midnight-navy text-frost relative overflow-hidden" id="brand-story">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-slate-blue/20 to-transparent rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-gold/10 to-transparent rounded-full blur-[120px]" />
      </div>
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-sans text-label-caps uppercase tracking-[0.2em] text-silver-chrome/60 mb-6 block">Our Philosophy</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="font-serif text-display-sm md:text-display-md text-frost mb-8 leading-tight">
            The Theatricality<br />of Silence
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="font-sans text-body-xl text-silver-chrome/70 mb-12 leading-relaxed">
            KLVORA was born from the belief that true luxury whispers. Each piece in our collection is a meditation on form — where architecture meets fabric, where silence speaks louder than spectacle.
          </motion.p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="flex justify-center gap-12 md:gap-20">
            {[{ num: "150+", label: "Artisans" }, { num: "12", label: "Ateliers" }, { num: "48", label: "Countries" }].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-serif text-headline-lg text-accent-gold mb-1">{s.num}</p>
                <p className="font-sans text-label-caps uppercase tracking-[0.15em] text-silver-chrome/50">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Bestsellers() {
  const items = PRODUCTS.filter((p) => p.isBestseller).slice(0, 4);
  return (
    <section className="py-24 md:py-32 px-6 md:px-16 max-w-[1440px] mx-auto" id="bestsellers">
      <div className="flex items-end justify-between mb-12">
        <div>
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-sans text-label-caps uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 block">Curated Selection</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-display-sm md:text-headline-lg text-primary">Bestsellers</motion.h2>
        </div>
        <Link href="/collections?filter=bestseller" className="hidden md:flex items-center gap-2 font-sans text-ui-button uppercase tracking-[0.05em] text-primary hover:text-secondary transition-colors group">
          Shop All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

export function Testimonials() {
  const reviews = [
    { name: "Isabelle M.", text: "The quality is unlike anything I've experienced. Every detail speaks of intention and craft.", rating: 5, location: "Paris, France" },
    { name: "Alexandra K.", text: "KLVORA pieces don't just complement an outfit — they become the outfit. Truly transformative design.", rating: 5, location: "New York, USA" },
    { name: "Yuki T.", text: "The Obsidian Tote is a masterpiece of engineering and aesthetics. It only gets more beautiful with time.", rating: 5, location: "Tokyo, Japan" },
  ];
  return (
    <section className="py-24 md:py-32 bg-surface-container-low/50" id="testimonials">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <div className="text-center mb-16">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="font-sans text-label-caps uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 block">Voices</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="font-serif text-display-sm md:text-headline-lg text-primary">What They Say</motion.h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="glass-card rounded-2xl p-8 flex flex-col">
              <div className="flex gap-1 mb-4">{[...Array(r.rating)].map((_, j) => <span key={j} className="text-accent-gold text-sm">★</span>)}</div>
              <p className="font-sans text-body-lg text-on-surface leading-relaxed mb-6 flex-1">&ldquo;{r.text}&rdquo;</p>
              <div>
                <p className="font-serif text-body-lg text-primary font-medium">{r.name}</p>
                <p className="font-sans text-body-sm text-on-surface-variant/50">{r.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
