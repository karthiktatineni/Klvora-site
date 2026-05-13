"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { COLLECTIONS, PRODUCTS } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";

export default function ArchivesPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="font-sans text-label-caps uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 block">Heritage</span>
          <h1 className="font-serif text-display-sm md:text-display-md text-primary mb-4">Archives</h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-xl mx-auto">A curated retrospective of KLVORA&apos;s most iconic collections and timeless pieces.</p>
        </motion.div>

        {/* Collection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {COLLECTIONS.map((collection, i) => (
            <motion.div
              key={collection.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href="/collections" className="group block relative overflow-hidden bg-surface-container-low rounded-xl aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-t from-midnight-navy/60 via-midnight-navy/20 to-transparent z-10" />
                {PRODUCTS[i % PRODUCTS.length] && (
                  <Image src={PRODUCTS[i % PRODUCTS.length].images[0]} alt={collection.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
                )}
                <div className="absolute bottom-6 left-6 z-20">
                  <h3 className="font-serif text-headline-sm text-frost mb-1">{collection.name}</h3>
                  <p className="font-sans text-body-sm text-frost/70">{collection.description}</p>
                  <p className="font-sans text-label-caps uppercase tracking-[0.15em] text-frost/50 mt-2">{collection.count} Pieces</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* All Products */}
        <div>
          <h2 className="font-serif text-headline-lg text-primary mb-8">Full Archive</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PRODUCTS.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
