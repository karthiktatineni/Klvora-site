"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, Eye, Lock, RefreshCw, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: <Eye size={20} className="text-accent-gold" />,
      title: "1. Information We Collect",
      content:
        "We collect personal information you provide directly to us when purchasing, creating an account, or communicating with us. This includes your name, email address, physical billing/shipping addresses, payment details, and contact history.",
    },
    {
      icon: <Lock size={20} className="text-accent-gold" />,
      title: "2. How We Protect Your Data",
      content:
        "Your security is our absolute priority. We implement advanced industrial-grade encryption protocols and secure SSL checkouts. We partner with Firebase and Stripe to handle authentication and payment processing securely, ensuring no sensitive credentials touch our databases directly.",
    },
    {
      icon: <Shield size={20} className="text-accent-gold" />,
      title: "3. Information Sharing",
      content:
        "KLVORA does not sell, rent, or trade your personal data. We only share essential details with certified third-party service providers (like shipping couriers and payment gateways) strictly to process your transactions and deliver your garments.",
    },
    {
      icon: <RefreshCw size={20} className="text-accent-gold" />,
      title: "4. Your Rights & Choice",
      content:
        "You have the right to request access to, correction of, or permanent deletion of your personal data at any time. You can easily manage your account details or contact our Virtual AI Concierge support team directly to handle data removal request.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#14181f] text-[#dbdad8] pt-32 pb-24 px-6 md:px-16 overflow-hidden relative">
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-slate-blue/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-accent-gold/5 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#dbdad8]/50 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Return Home
          </Link>
        </motion.div>

        {/* Header */}
        <div className="border-b border-[#dbdad8]/10 pb-8 mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent-gold block mb-3"
          >
            Security & Trust
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-sans font-black text-4xl md:text-5xl lg:text-6xl text-white tracking-tighter uppercase leading-[0.9]"
          >
            Privacy Policy
          </motion.h1>
          <p className="font-mono text-xs text-[#dbdad8]/40 mt-4">LAST UPDATED: MAY 28, 2026</p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-8 border border-[#dbdad8]/10 bg-black/20 backdrop-blur-md"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#dbdad8]/5 border border-[#dbdad8]/10 rounded-lg">
                  {sec.icon}
                </div>
                <div>
                  <h2 className="font-serif text-xl md:text-2xl text-white mb-4">{sec.title}</h2>
                  <p className="font-sans text-sm md:text-base text-[#dbdad8]/70 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center border-t border-[#dbdad8]/10 pt-8"
        >
          <p className="font-sans text-xs text-[#dbdad8]/40 uppercase tracking-widest mb-4">
            Have questions about your data security?
          </p>
          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                const trigger = document.getElementById("chatbot-trigger");
                if (trigger) trigger.click();
              }
            }}
            className="px-8 py-3 bg-white text-black font-sans font-bold text-xs uppercase tracking-widest hover:bg-white/90 active:scale-95 transition-all"
          >
            Consult Virtual Assistant
          </button>
        </motion.div>
      </div>
    </div>
  );
}
