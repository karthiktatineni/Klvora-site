"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface OpeningPageProps {
  onExitStart: () => void;
  onComplete: () => void;
}

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
}

export default function OpeningPage({ onExitStart, onComplete }: OpeningPageProps) {
  const [mounted, setMounted] = useState(false);
  const [isBypassed, setIsBypassed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Check sessionStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    const played = sessionStorage.getItem("klvora-intro-played");
    if (played === "true") {
      setIsBypassed(true);
      onExitStart();
      onComplete();
    }
  }, [onExitStart, onComplete]);

  // Generate floating particles on mount to prevent SSR hydration mismatches
  useEffect(() => {
    if (mounted && !isBypassed) {
      const generated = [...Array(15)].map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 1.5, // 1.5px to 3.5px
        x: Math.random() * 100, // percentage left
        y: Math.random() * 100, // percentage top
        duration: Math.random() * 8 + 8, // 8s to 16s
        delay: Math.random() * 2,
      }));
      setParticles(generated);
    }
  }, [mounted, isBypassed]);

  // Handle progress counter
  useEffect(() => {
    if (!mounted || isBypassed || isExiting) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Realistic luxury organic loading steps
        // It starts faster, slows down near 80%, then finishes gracefully
        let increment = 1;
        if (prev < 30) {
          increment = Math.floor(Math.random() * 5) + 2; // +2 to +6
        } else if (prev < 70) {
          increment = Math.floor(Math.random() * 4) + 1; // +1 to +4
        } else if (prev < 90) {
          increment = Math.floor(Math.random() * 2) + 1; // +1 to +2
        } else {
          increment = Math.random() > 0.6 ? 1 : 0; // slower trickle at the end
        }

        return Math.min(prev + increment, 100);
      });
    }, 30); // smooth update rate

    return () => clearInterval(interval);
  }, [mounted, isBypassed, isExiting]);

  // Trigger exit when progress reaches 100%
  useEffect(() => {
    if (progress === 100 && !isExiting) {
      const timeout = setTimeout(() => {
        setIsExiting(true);
        onExitStart();
        sessionStorage.setItem("klvora-intro-played", "true");
      }, 500); // premium delay to see 100% load
      return () => clearTimeout(timeout);
    }
  }, [progress, isExiting, onExitStart]);

  // Notify home page when the curtain has completely slid up
  useEffect(() => {
    if (isExiting) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 950); // matches the y transition duration below
      return () => clearTimeout(timeout);
    }
  }, [isExiting, onComplete]);

  // Direct skip handler for standard convenience
  const handleSkip = () => {
    if (isExiting) return;
    setIsExiting(true);
    onExitStart();
    sessionStorage.setItem("klvora-intro-played", "true");
  };

  if (!mounted || isBypassed) return null;

  const tagline = "COUTURE & ARCHITECTURE";

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: isExiting ? "-100vh" : 0 }}
      transition={{
        duration: 0.9,
        ease: [0.76, 0, 0.24, 1], // cinematic curtain-up bezier
      }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#faf9f7] select-none overflow-hidden"
    >
      {/* Central Luxurious Radial Gold Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.15)_0%,transparent_65%)] pointer-events-none z-0" />

      {/* Floating Ethereal Dust Particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#C9A96E]/50 shadow-[0_0_6px_rgba(201,169,110,0.3)]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.7, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 max-w-lg text-center">
        {/* Logo Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8 w-[90vw] max-w-[600px] md:w-[860px] h-[140px] md:h-[215px] select-none pointer-events-none"
        >
          <Image
            src="/logoKlvora.png"
            alt="KLVORA Luxury Logo"
            fill
            priority
            className="object-contain mix-blend-multiply brightness-[1.02]"
            sizes="(max-width: 768px) 90vw, 860px"
          />
        </motion.div>

        {/* Tagline Staggered Lettering Reveal */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.04,
                delayChildren: 0.5,
              },
            },
          }}
          className="flex justify-center items-center flex-wrap gap-x-1.5 md:gap-x-2.5 mb-14"
        >
          {tagline.split(" ").map((word, wordIndex) => (
            <div key={wordIndex} className="flex gap-x-0.5 md:gap-x-1">
              {word.split("").map((letter, letterIndex) => (
                <motion.span
                  key={letterIndex}
                  variants={{
                    hidden: { opacity: 0, y: 6 },
                    visible: {
                      opacity: 0.65,
                      y: 0,
                      transition: { duration: 0.7, ease: "easeOut" },
                    },
                  }}
                  className="font-sans text-[9px] md:text-[10px] tracking-[0.25em] font-semibold text-primary"
                >
                  {letter}
                </motion.span>
              ))}
              {/* Space helper */}
              <span className="w-1.5 md:w-3" />
            </div>
          ))}
        </motion.div>

        {/* Loading Progress Section */}
        <div className="w-full flex flex-col items-center gap-4 max-w-[200px]">
          {/* Micro digital percentage indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.8 }}
            className="font-sans text-[10px] font-semibold tracking-[0.3em] text-[#C9A96E] text-center tabular-nums"
          >
            {progress.toString().padStart(3, "0")} %
          </motion.div>

          {/* Luxury ultra-thin progress bar */}
          <div className="w-full h-[1px] bg-black/10 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 bg-accent-gold shadow-[0_0_4px_rgba(201,169,110,0.4)]"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Premium Minimalist Skip Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        whileHover={{ opacity: 0.9, letterSpacing: "0.22em" }}
        transition={{ duration: 0.4 }}
        onClick={handleSkip}
        className="absolute bottom-10 right-8 md:right-12 z-20 font-sans text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-primary/70 border-b border-transparent hover:border-primary/40 pb-1 cursor-pointer transition-all duration-300 pointer-events-auto"
      >
        Skip Intro
      </motion.button>
    </motion.div>
  );
}
