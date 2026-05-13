"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      id="hero-section"
    >
      {/* Background Image with Parallax */}
      <motion.div style={{ scale }} className="absolute inset-0 z-0">
        <Image
          src="/hero-editorial.png"
          alt="Cinematic hero showcasing KLVORA luxury fashion"
          fill
          className="object-cover opacity-90"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/20 via-transparent to-background/70" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/30 via-transparent to-transparent" />

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-[2] pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent-gold/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center flex flex-col items-center justify-center w-full max-w-[1440px] px-6 md:px-16"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-light text-label-caps uppercase tracking-[0.2em] text-primary/70">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse-glow" />
            Spring / Summer 2026
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="font-serif text-display-sm md:text-display-lg lg:text-display-xl text-primary mb-6 drop-shadow-sm tracking-tight leading-none"
        >
          Ethereal Elegance
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-sans text-body-lg md:text-body-xl text-on-surface-variant max-w-2xl mb-10 drop-shadow-sm"
        >
          Discover the new collection where architectural precision meets fluid motion.
          A curated experience of light, space, and form.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/collections"
            className="bg-primary text-on-primary font-sans text-ui-button uppercase tracking-[0.05em] px-10 py-4 hover:bg-primary/90 transition-all duration-300 shadow-ambient flex items-center gap-2 group magnetic-btn"
            id="hero-cta-primary"
          >
            Start Experience
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/collections"
            className="border border-primary/30 text-primary font-sans text-ui-button uppercase tracking-[0.05em] px-10 py-4 hover:bg-primary hover:text-on-primary transition-all duration-300 magnetic-btn backdrop-blur-sm"
            id="hero-cta-secondary"
          >
            View Lookbook
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="font-sans text-label-caps uppercase tracking-[0.2em] text-on-surface-variant/60 text-[10px]">
          Scroll
        </span>
        <motion.div
          animate={{ height: [20, 48, 20] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-[1px] bg-on-surface-variant/40"
        />
      </motion.div>
    </section>
  );
}
