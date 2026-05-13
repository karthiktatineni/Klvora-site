"use client";

import { useEffect } from "react";

export default function StickyToastRemover() {
  useEffect(() => {
    // Clear old sticky toast from local storage once
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("klvora-ui");
      if (saved && saved.includes('"toast"')) {
        localStorage.removeItem("klvora-ui");
        window.location.reload();
      }
    }
  }, []);

  return null;
}
