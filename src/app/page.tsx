"use client";

import { useState, useEffect } from "react";
import OpeningPage from "@/components/ui/OpeningPage";
import HeroSection from "@/components/sections/HeroSection";
import {
  NewArrivals,
  TrendingProducts,
  EditorialShowcase,
  BrandStory,
  Bestsellers,
  Testimonials,
} from "@/components/sections/HomeSections";

export default function Home() {
  const [isIntroActive, setIsIntroActive] = useState(true);
  const [startHeroAnimation, setStartHeroAnimation] = useState(false);

  // Synchronize state instantly on mount for returning session users
  useEffect(() => {
    if (typeof window !== "undefined") {
      const played = sessionStorage.getItem("klvora-intro-played");
      if (played === "true") {
        setIsIntroActive(false);
        setStartHeroAnimation(true);
      }
    }
  }, []);

  // Control body scroll and scroll locking during the cinematic intro
  useEffect(() => {
    if (isIntroActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("lenis-stopped");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [isIntroActive]);

  return (
    <>
      {isIntroActive && (
        <OpeningPage
          onExitStart={() => setStartHeroAnimation(true)}
          onComplete={() => setIsIntroActive(false)}
        />
      )}
      
      {/* 
        Obsidian / Light Mode Wrapper: 
        Hides the homepage content during SSR/initial render before JS hydration, 
        eliminating the flash of layout contents. Fades in gracefully as the preloader exits.
      */}
      <div 
        className={
          startHeroAnimation 
            ? "opacity-100 transition-opacity duration-1000 ease-out" 
            : "opacity-0 pointer-events-none h-screen overflow-hidden"
        }
      >
        <HeroSection startAnimation={startHeroAnimation} />
        <NewArrivals />
        <EditorialShowcase />
        <TrendingProducts />
        <BrandStory />
        <Bestsellers />
        <Testimonials />
      </div>
    </>
  );
}
