"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUIStore } from "@/store/useStore";
import { CheckCircle } from "lucide-react";

export default function Toast() {
  const toast = useUIStore((s) => s.toast);

  return (
    <AnimatePresence>
      {toast?.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-10 left-1/2 z-[200] flex items-center gap-3 bg-primary text-on-primary px-6 py-4 rounded-full shadow-cinematic border border-outline-variant/20"
        >
          <CheckCircle size={18} className="text-secondary" />
          <span className="font-sans text-body-md font-medium tracking-wide">
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
