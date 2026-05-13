"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Info } from "lucide-react";
import Link from "next/link";

export default function SizeGuidePage() {
  const SIZES = [
    { size: "XS", chest: "34-36", waist: "28-30", hips: "35-37" },
    { size: "S", chest: "36-38", waist: "30-32", hips: "37-39" },
    { size: "M", chest: "38-40", waist: "32-34", hips: "39-41" },
    { size: "L", chest: "40-42", waist: "34-36", hips: "41-43" },
    { size: "XL", chest: "42-44", waist: "36-38", hips: "43-45" },
    { size: "XXL", chest: "44-46", waist: "38-40", hips: "45-47" },
  ];

  return (
    <div className="pt-32 pb-20 min-h-screen max-w-[1440px] mx-auto px-6 md:px-16">
      <Link href="/collections" className="inline-flex items-center gap-2 text-on-surface-variant/60 hover:text-primary mb-8 transition-colors">
        <ChevronLeft size={16} /> Back to Shop
      </Link>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-display-sm text-primary mb-4">Size Guide</h1>
          <p className="font-sans text-body-lg text-on-surface-variant">Find your perfect KLVORA fit with our measurement guide.</p>
        </div>

        <div className="glass-card rounded-2xl overflow-hidden border border-outline-variant/10 mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50">
                <th className="p-6 font-sans text-label-caps uppercase tracking-widest text-primary font-bold border-b border-outline-variant/10">Size</th>
                <th className="p-6 font-sans text-label-caps uppercase tracking-widest text-primary font-bold border-b border-outline-variant/10">Chest (in)</th>
                <th className="p-6 font-sans text-label-caps uppercase tracking-widest text-primary font-bold border-b border-outline-variant/10">Waist (in)</th>
                <th className="p-6 font-sans text-label-caps uppercase tracking-widest text-primary font-bold border-b border-outline-variant/10">Hips (in)</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((row) => (
                <tr key={row.size} className="hover:bg-surface-container-low/20 transition-colors border-b border-outline-variant/5">
                  <td className="p-6 font-serif text-body-lg text-primary">{row.size}</td>
                  <td className="p-6 font-sans text-body-md text-on-surface-variant">{row.chest}</td>
                  <td className="p-6 font-sans text-body-md text-on-surface-variant">{row.waist}</td>
                  <td className="p-6 font-sans text-body-md text-on-surface-variant">{row.hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card rounded-2xl p-8 bg-surface-container-low/30">
            <h3 className="font-serif text-headline-sm text-primary mb-4">How to Measure</h3>
            <ul className="space-y-4">
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-[10px]">1</div>
                <p className="text-body-sm text-on-surface-variant"><span className="text-primary font-bold">Chest:</span> Measure around the fullest part of your chest, keeping the tape horizontal.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-[10px]">2</div>
                <p className="text-body-sm text-on-surface-variant"><span className="text-primary font-bold">Waist:</span> Measure around the narrowest part of your waistline.</p>
              </li>
              <li className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-[10px]">3</div>
                <p className="text-body-sm text-on-surface-variant"><span className="text-primary font-bold">Hips:</span> Measure around the fullest part of your hips.</p>
              </li>
            </ul>
          </div>
          <div className="glass-card rounded-2xl p-8 bg-primary/5 flex flex-col justify-center border-primary/10">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Info size={20} />
              <h3 className="font-serif text-headline-sm">Fit Advice</h3>
            </div>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              If your measurements fall between two sizes, we recommend choosing the larger size for a relaxed KLVORA silhouette, or the smaller size for a more tailored look.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
