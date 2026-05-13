"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle, Shield, Truck, RefreshCcw } from "lucide-react";
import ChatBot from "@/components/ai/ChatBot";

const FAQS = [
  {
    category: "Shipping",
    icon: Truck,
    questions: [
      { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days across India. Express shipping is available for select pin codes with 1-2 day delivery." },
      { q: "Is international shipping available?", a: "Currently, KLVORA ships within India. We are working on expanding our reach globally soon." }
    ]
  },
  {
    category: "Returns",
    icon: RefreshCcw,
    questions: [
      { q: "What is your return policy?", a: "We offer a 7-day return policy for all unworn items with tags attached. Beauty and intimate products are non-returnable." },
      { q: "How do I initiate a return?", a: "You can initiate a return directly from your 'Track Order' dashboard or by contacting our support team." }
    ]
  },
  {
    category: "Authenticity",
    icon: Shield,
    questions: [
      { q: "Are all products original?", a: "Yes, every item at KLVORA is authentic, verified, and sourced directly from our master craftsmen." }
    ]
  }
];

export default function FAQPage() {
  const [activeIdx, setActiveIdx] = useState<string | null>(null);

  return (
    <div className="pt-32 pb-20 min-h-screen max-w-[1440px] mx-auto px-6 md:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-display-sm text-primary mb-4">Support & FAQ</motion.h1>
          <p className="font-sans text-body-lg text-on-surface-variant">Find answers to common questions or chat with our AI concierge below.</p>
        </div>

        <div className="space-y-12">
          {FAQS.map((category, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <category.icon size={20} className="text-primary/40" />
                <h2 className="font-sans text-label-caps uppercase tracking-widest text-primary font-bold">{category.category}</h2>
              </div>
              <div className="space-y-4">
                {category.questions.map((faq, qIdx) => {
                  const id = `${catIdx}-${qIdx}`;
                  const isOpen = activeIdx === id;
                  return (
                    <div key={id} className="glass-card rounded-2xl overflow-hidden border border-outline-variant/10">
                      <button 
                        onClick={() => setActiveIdx(isOpen ? null : id)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface-container-low transition-colors"
                      >
                        <span className="font-sans text-body-md text-primary font-medium">{faq.q}</span>
                        {isOpen ? <Minus size={18} className="text-primary/40" /> : <Plus size={18} className="text-primary/40" />}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 text-body-md text-on-surface-variant leading-relaxed border-t border-outline-variant/5 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 glass-card rounded-3xl bg-surface-container-low/50 border-dashed border-2 border-outline-variant/30 text-center">
          <HelpCircle size={32} className="mx-auto mb-4 text-primary/20" />
          <h3 className="font-serif text-headline-sm text-primary mb-2">Still have questions?</h3>
          <p className="font-sans text-body-md text-on-surface-variant mb-6">Click the chat icon in the bottom right corner to talk to KLVORA AI.</p>
        </div>
      </div>
    </div>
  );
}
