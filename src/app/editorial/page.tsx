"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const EDITORIALS = [
  {
    title: "The Art of Silence",
    subtitle: "Spring / Summer 2026",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATc9gxTnCFhr77f4AGN_GR5E71Kfn3vvk0G66rnf2SG9rTn9e0gyNRyTKAJrWg9KFZVTRcJIiloyRTfYSZ2miG5-6vwEa_UOxIfC0K0a5PstGDvHBzPiy3ZyBjo7iWdCTaCNtwwPorwcYeTQWO6acpoKqEIlgI_-ur92RPCIn_VKRo2ufAnk856WLnxKgZctOa7duSxjDVEhYmt1Dc5-s0k9BvOB0FPMLz2LalYQXyLDanq1AzXRZVNWiD9YK8vATXiyTmJajD7KE",
    description: "Exploring the intersection of architectural precision and fluid motion in our latest editorial.",
  },
  {
    title: "Structured Minimalism",
    subtitle: "Campaign",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRH9wAlWRVvWhwaD8Dc3mD9m_L4s7HaLVoo2GxFCObQYCyu1oLRo5z6iC1-OqOEvCEAYpp2uY4THMYwpWJ1hNjpoAeEwuv5cE0vz72RnMDQhShV-ihY2-MadWPRlp-PrnCvNeT3IcCHt4XJ-g4iad9bru826_cL0VYYhzlpDu1fUnBo1ot0hKSm8Wo5FHIoVJphJ96W4Lhx_RWAdSDJg0Fr88vMVxO-AwlqUkOIZgVcSwalbKzLs8H_RhSHcM0T82tW2WCVnoHI9o",
    description: "Our approach strips away the unnecessary, leaving only the essential.",
  },
  {
    title: "Lumen",
    subtitle: "Exclusive Collection",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfUaAETtjyJc1c7xIdrniE4LQiaP03LH057GRh-VB9_jEi0FRTQGw3QNoztN-HHEfN_pnP18EVDDB8QVS2OonKhYfVSrZ-Hwy2q8KTO2MHu4I3CrFWRb3BS1MVGiDQ3577qOVbemPIODr2oP-hhjoYeRIbaQyMZ-j7Faeqs4NeKFn673o8TmczqwJO0lkqDY7ymyMnSXxmY5v9XZdWduYBdxoOV7gykywQ81tjBXoFaYdmHf-HP6df-c0NkueTj9T_ek-UU9G26AQ",
    description: "Captured in the stillness between moments. A silhouette defined by what it omits.",
  },
];

export default function EditorialPage() {
  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="font-sans text-label-caps uppercase tracking-[0.2em] text-on-surface-variant/50 mb-3 block">Stories</span>
          <h1 className="font-serif text-display-sm md:text-display-md text-primary mb-4">Editorial</h1>
          <p className="font-sans text-body-lg text-on-surface-variant max-w-xl mx-auto">Behind every collection lies a narrative of intent, craft, and vision.</p>
        </motion.div>

        <div className="space-y-24">
          {EDITORIALS.map((item, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${i % 2 === 1 ? "lg:direction-rtl" : ""}`}
            >
              <div className={`relative aspect-[4/3] overflow-hidden bg-surface-container-low group ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image src={item.image} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
              <div className={`flex flex-col justify-center ${i % 2 === 1 ? "lg:order-1 lg:text-right lg:items-end" : ""}`}>
                <span className="font-sans text-label-caps uppercase tracking-[0.2em] text-secondary mb-3">{item.subtitle}</span>
                <h2 className="font-serif text-headline-lg text-primary mb-4">{item.title}</h2>
                <p className="font-sans text-body-lg text-on-surface-variant mb-6 max-w-md">{item.description}</p>
                <Link href="/collections" className="font-sans text-ui-button uppercase tracking-[0.05em] border border-primary text-primary px-8 py-3 w-max hover:bg-primary hover:text-on-primary transition-colors">
                  Read More
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
