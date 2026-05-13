"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, User, Sparkles, Loader2 } from "lucide-react";
import { auth } from "@/lib/firebase";
import { subscribeToCustomerOrders, getUserProfile } from "@/lib/db";

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubOrders = subscribeToCustomerOrders(user.uid, user.email || "", (orders) => {
          setContext((prev: any) => ({ ...prev, orders, userEmail: user.email }));
        });
        const unsubProfile = getUserProfile(user.uid, (profile) => {
          setContext((prev: any) => ({ ...prev, addresses: profile?.savedAddress }));
        });
        return () => {
          unsubOrders();
          unsubProfile();
        };
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage], context }),
      });
      const data = await response.json();
      
      let finalContent = data.content;
      if (finalContent.includes("[REQUEST_EXECUTIVE]")) {
        finalContent = finalContent.replace("[REQUEST_EXECUTIVE]", "").trim();
        // Save priority message
        const { saveContactMessage } = require("@/lib/db");
        await saveContactMessage({
          name: context.userEmail || "Customer",
          email: context.userEmail || "Unknown",
          phone: "N/A",
          message: `URGENT: Executive Requested via Chat. Context: ${input}`,
          status: "priority"
        });
      }
      
      setMessages(prev => [...prev, { role: "assistant", content: finalContent }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting to my fashion database. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-float hover:scale-110 transition-all z-50 group"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-12 right-0 bg-primary text-on-primary text-[10px] uppercase tracking-widest px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            KLVORA Customer Care
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[400px] max-h-[600px] flex flex-col bg-white rounded-2xl shadow-cinematic border border-outline-variant/20 z-[100] overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant/10 flex items-center gap-4 bg-white">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="font-serif text-body-lg text-primary">KLVORA Care</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">24/7 Virtual Concierge</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide bg-white">
              {messages.length === 0 && (
                <div className="text-center py-10 space-y-4">
                  <Sparkles size={32} className="mx-auto text-primary/20" />
                  <p className="font-sans text-body-md text-on-surface-variant/60">
                    Welcome to KLVORA Hub. How can I assist you with your orders or style today?
                  </p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl font-sans text-body-sm leading-relaxed ${
                    m.role === "user" 
                    ? "bg-primary text-on-primary rounded-tr-none shadow-md" 
                    : "bg-gray-50 text-primary rounded-tl-none border border-outline-variant/20 shadow-sm"
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-outline-variant/20">
                    <Loader2 size={16} className="animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-outline-variant/10 bg-white">
              <div className="relative flex items-center">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your orders, size guide, or styles..."
                  className="w-full bg-gray-50 border border-outline-variant/20 rounded-full px-6 py-4 pr-14 text-body-sm text-primary outline-none focus:border-primary transition-colors"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center disabled:opacity-50 transition-opacity"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-[9px] text-center mt-3 uppercase tracking-widest text-on-surface-variant/40">Powered by Groq Intelligence</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
