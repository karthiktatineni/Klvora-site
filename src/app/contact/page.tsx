"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { saveContactMessage } from "@/lib/db";
import { useUIStore } from "@/store/useStore";
import ChatBot from "@/components/ai/ChatBot";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await saveContactMessage(form);
      setSubmitted(true);
      showToast("Message sent successfully!");
    } catch (error) {
      showToast("Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-32 pb-20 min-h-screen flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center px-6 max-w-md">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle size={40} />
          </div>
          <h1 className="font-serif text-headline-lg text-primary mb-4">Message Received</h1>
          <p className="font-sans text-body-lg text-on-surface-variant mb-8">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
          <button onClick={() => setSubmitted(false)} className="text-primary underline font-sans text-ui-button tracking-widest uppercase">Send Another Message</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 min-h-screen max-w-[1440px] mx-auto px-6 md:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h1 className="font-serif text-display-sm text-primary mb-6">Get in Touch</h1>
          <p className="font-sans text-body-lg text-on-surface-variant mb-12 max-w-md">
            Whether you have questions about our latest collections or need assistance with an order, our team is here to help.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-sans text-label-caps uppercase tracking-widest text-on-surface-variant/60 mb-1">Email Us</h3>
                <p className="text-body-lg text-primary">care@klvora.in</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                <Phone size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-sans text-label-caps uppercase tracking-widest text-on-surface-variant/60 mb-1">Call Us</h3>
                <p className="text-body-lg text-primary">+91 (800) KLV-ORA</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-sans text-label-caps uppercase tracking-widest text-on-surface-variant/60 mb-1">Visit Us</h3>
                <p className="text-body-lg text-primary">KLVORA Fashion House, Hyderabad, India</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-card rounded-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Full Name</label>
              <input 
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-transparent border-b border-outline-variant/30 py-3 outline-none focus:border-primary transition-colors text-body-lg text-primary" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Email</label>
                <input 
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 outline-none focus:border-primary transition-colors text-body-lg text-primary" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Phone</label>
                <input 
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full bg-transparent border-b border-outline-variant/30 py-3 outline-none focus:border-primary transition-colors text-body-lg text-primary" 
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 ml-1">Message</label>
              <textarea 
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full bg-transparent border-b border-outline-variant/30 py-3 outline-none focus:border-primary transition-colors text-body-lg text-primary resize-none" 
              />
            </div>
            <button 
              disabled={loading}
              className="w-full bg-primary text-on-primary py-5 font-sans text-ui-button uppercase tracking-[0.1em] hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
