"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* ─── Hanging Streetwear Garment (SVG) ─── */
function HangingGarment({
  className,
  delay,
  garmentType,
  startAnimation,
  y,
}: {
  className?: string;
  delay: number;
  garmentType: "hoodie" | "oversizedTee" | "puffer" | "cargoPants";
  startAnimation: boolean;
  y?: MotionValue<number>;
}) {
  const garmentPaths: Record<string, React.ReactNode> = {
    hoodie: (
      <>
        {/* Hanger */}
        <path
          d="M30 14 L50 2 L70 14"
          stroke="rgba(191,201,217,0.6)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="50" cy="2" r="2" fill="rgba(191,201,217,0.6)" />
        {/* Hood */}
        <path
          d="M40 16 Q50 4 60 16"
          stroke="rgba(245,230,208,0.2)"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Drawstrings */}
        <path d="M45 16 L45 35 M55 16 L55 35" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
        {/* Boxy Body */}
        <path
          d="M30 16 L15 35 L20 40 L28 32 L28 75 L72 75 L72 32 L80 40 L85 35 L70 16 Z"
          stroke="rgba(191,201,217,0.4)"
          strokeWidth="1.5"
          fill="rgba(191,201,217,0.08)"
          strokeLinejoin="round"
        />
        {/* Kangaroo Pocket */}
        <path
          d="M35 55 L65 55 L70 70 L30 70 Z"
          stroke="rgba(191,201,217,0.25)"
          strokeWidth="1"
          fill="none"
          strokeLinejoin="round"
        />
        {/* Ribbed Hem/Cuffs */}
        <path d="M28 75 L72 75" stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="2 2" />
        <path d="M17 38 L22 43 M83 38 L78 43" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      </>
    ),
    oversizedTee: (
      <>
        {/* Hanger */}
        <path
          d="M25 10 L50 2 L75 10"
          stroke="rgba(191,201,217,0.6)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="50" cy="2" r="2" fill="rgba(191,201,217,0.6)" />
        {/* Neckline */}
        <path
          d="M40 10 Q50 16 60 10"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          fill="none"
        />
        {/* Oversized Body & Drop Shoulders */}
        <path
          d="M25 10 L8 25 L12 35 L28 25 L28 85 L72 85 L72 25 L88 35 L92 25 L75 10 Z"
          stroke="rgba(245,230,208,0.3)"
          strokeWidth="1.5"
          fill="rgba(245,230,208,0.05)"
          strokeLinejoin="round"
        />
        {/* Center Graphic Graphic placeholder */}
        <rect x="42" y="30" width="16" height="20" stroke="rgba(191,201,217,0.2)" strokeWidth="1" fill="none" />
      </>
    ),
    puffer: (
      <>
        {/* Hanger */}
        <path
          d="M28 12 L50 2 L72 12"
          stroke="rgba(191,201,217,0.6)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="50" cy="2" r="2" fill="rgba(191,201,217,0.6)" />
        {/* Bulky Puffer Body */}
        <path
          d="M28 12 L10 30 L16 40 L26 30 L26 80 L74 80 L74 30 L84 40 L90 30 L72 12 Z"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          fill="rgba(255,255,255,0.08)"
          strokeLinejoin="round"
        />
        {/* Puffer Baffles (Horizontal quilting) */}
        <path d="M26 25 L74 25 M26 40 L74 40 M26 55 L74 55 M26 70 L74 70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <path d="M15 25 L23 17 M13 34 L21 26 M85 25 L77 17 M87 34 L79 26" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        {/* Front Zipper */}
        <path d="M50 12 L50 80" stroke="rgba(191,201,217,0.4)" strokeWidth="1.5" strokeDasharray="3 2" />
      </>
    ),
    cargoPants: (
      <>
        {/* Clip Hanger */}
        <path d="M30 14 L70 14" stroke="rgba(191,201,217,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M50 2 L50 14" stroke="rgba(191,201,217,0.6)" strokeWidth="2" fill="none" />
        <circle cx="50" cy="2" r="2" fill="rgba(191,201,217,0.6)" />
        <rect x="32" y="12" width="6" height="4" fill="rgba(191,201,217,0.6)" />
        <rect x="62" y="12" width="6" height="4" fill="rgba(191,201,217,0.6)" />

        {/* Cargo Pants Body */}
        <path
          d="M28 18 L72 18 L75 40 L70 90 L52 90 L50 45 L48 90 L30 90 L25 40 Z"
          stroke="rgba(191,201,217,0.4)"
          strokeWidth="1.5"
          fill="rgba(191,201,217,0.08)"
          strokeLinejoin="round"
        />
        {/* Cargo Pockets */}
        <path d="M26 45 L38 45 L38 60 L28 60 Z" stroke="rgba(191,201,217,0.3)" strokeWidth="1" fill="none" />
        <path d="M74 45 L62 45 L62 60 L72 60 Z" stroke="rgba(191,201,217,0.3)" strokeWidth="1" fill="none" />
        {/* Fly & Seams */}
        <path d="M50 18 L50 35 Q50 40 45 42" stroke="rgba(191,201,217,0.3)" strokeWidth="1" fill="none" />
        <path d="M28 25 L72 25" stroke="rgba(191,201,217,0.2)" strokeWidth="1" />
      </>
    )
  };

  return (
    <motion.div
      suppressHydrationWarning
      className={`absolute ${className} touch-none`} // touch-none for better drag on mobile
      style={{ y, zIndex: 10 }}
      initial={{ opacity: 0, y: -30 }}
      animate={
        startAnimation
          ? { opacity: 1 }
          : { opacity: 0 }
      }
      transition={{ duration: 1.6, delay, ease: [0.23, 1, 0.32, 1] }}
      drag
      dragConstraints={{ top: -100, left: -100, right: 100, bottom: 100 }}
      dragElastic={0.2}
      whileHover={{ scale: 1.15, rotate: 5, zIndex: 50, filter: "drop-shadow(0 0 20px rgba(255,255,255,0.2))" }}
      whileDrag={{ scale: 1.25, rotate: -5, zIndex: 50, filter: "drop-shadow(0 0 30px rgba(255,255,255,0.4))" }}
    >
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "top center" }}
        className="cursor-grab active:cursor-grabbing"
      >
        <svg viewBox="0 0 100 95" fill="none" className="w-full h-full drop-shadow-md pointer-events-none">
          {garmentPaths[garmentType]}
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ─── Utility Tape / Urban Grid Line ─── */
function TechTape({
  d,
  delay,
  className,
}: {
  d: string;
  delay: number;
  className?: string;
}) {
  return (
    <motion.path
      d={d}
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="2"
      strokeDasharray="15 5 5 5"
      fill="none"
      className={className}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 2.5, delay, ease: "easeInOut" }}
    />
  );
}

/* ═══════════════════════════════════════════════════════
   HERO SECTION — Dark Streetwear & Utility
   ═══════════════════════════════════════════════════════ */

export default function HeroSection({
  startAnimation = true,
}: {
  startAnimation?: boolean;
}) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const mainY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const mainOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Parallax scroll transforms for different depth layers
  const yLayer1 = useTransform(scrollYProgress, [0, 1], [0, -200]); // Fast up
  const yLayer2 = useTransform(scrollYProgress, [0, 1], [0, -100]); // Medium up
  const yLayer3 = useTransform(scrollYProgress, [0, 1], [0, -40]);  // Slow up
  const yLayer4 = useTransform(scrollYProgress, [0, 1], [0, 150]);  // Fast down
  const yLayer5 = useTransform(scrollYProgress, [0, 1], [0, 80]);   // Medium down

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#14181f]" // Slightly darker, cooler tone for street grit
      id="hero-section"
    >
      {/* ── Gritty Vignette & Ambient Light ── */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_40%,rgba(191,201,217,0.05)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_100%,rgba(20,24,31,0.9)_0%,transparent_50%)] pointer-events-none" />

      {/* ── Concrete / Halftone Texture Overlay ── */}
      <div
        className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* ── Utility Tape / Urban Grid (Parallax) ── */}
      <motion.svg
        suppressHydrationWarning
        className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        style={{ y: yLayer3 }}
      >
        <TechTape
          d="M0 250 L1440 300"
          delay={0.6}
        />
        <TechTape
          d="M0 650 L1440 600"
          delay={1.0}
        />
        {/* Angled slash */}
        <motion.path
          d="M400 900 L1000 0"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="40"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1.5 }}
        />
      </motion.svg>

      {/* ── Streetwear Garments (Parallax & Draggable) ── */}

      {/* Top Left: Hoodie */}
      <HangingGarment
        className="w-[120px] md:w-[180px] top-[12%] left-[5%] md:left-[10%]"
        delay={0.6}
        garmentType="hoodie"
        startAnimation={startAnimation}
        y={yLayer1}
      />

      {/* Top Right: Oversized Tee */}
      <HangingGarment
        className="w-[110px] md:w-[150px] top-[8%] right-[8%] md:right-[15%]"
        delay={0.9}
        garmentType="oversizedTee"
        startAnimation={startAnimation}
        y={yLayer2}
      />

      {/* Center Left (Hidden on Mobile): Puffer */}
      <HangingGarment
        className="w-[100px] md:w-[140px] top-[15%] left-[30%] md:left-[25%] hidden md:block"
        delay={1.2}
        garmentType="puffer"
        startAnimation={startAnimation}
        y={yLayer4}
      />

      {/* Center Right (Hidden on small screens): Hoodie */}
      <HangingGarment
        className="w-[95px] md:w-[135px] top-[10%] right-[30%] md:right-[28%] hidden lg:block"
        delay={1.0}
        garmentType="hoodie"
        startAnimation={startAnimation}
        y={yLayer5}
      />

      {/* Bottom Left: Cargo Pants (Replaced Sneakers) */}
      <HangingGarment
        className="w-[90px] md:w-[130px] bottom-[15%] left-[10%] md:left-[15%]"
        delay={1.0}
        garmentType="cargoPants"
        startAnimation={startAnimation}
        y={yLayer1}
      />

      {/* Bottom Right: Hoodie (Replaced Sneakers) */}
      <HangingGarment
        className="w-[85px] md:w-[125px] bottom-[20%] right-[8%] md:right-[12%]"
        delay={1.3}
        garmentType="hoodie"
        startAnimation={startAnimation}
        y={yLayer4}
      />

      {/* ── Industrial Hanging Rack (Parallax) ── */}
      <motion.div
        suppressHydrationWarning
        className="absolute top-[8%] left-[2%] right-[2%] md:left-[5%] md:right-[5%] h-[3px] bg-silver-chrome/20 z-[1] rounded-full pointer-events-none"
        initial={{ scaleX: 0 }}
        animate={startAnimation ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 1.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformOrigin: "center", y: yLayer3 }}
      />

      {/* ── Tech / Utility Typography Markers (Parallax & Interactive Hover) ── */}
      {[
        { text: "01 // HEAVYWEIGHT", x: "80%", y: "25%", d: 1.0, yLayer: yLayer1 },
        { text: "DRP_26", x: "12%", y: "50%", d: 1.3, yLayer: yLayer5 },
        { text: "OVERSIZED.FIT", x: "70%", y: "70%", d: 1.6, yLayer: yLayer2 },
      ].map((marker, i) => (
        <motion.div
          key={i}
          suppressHydrationWarning
          className="absolute font-mono text-[10px] md:text-[12px] text-silver-chrome/50 tracking-widest uppercase z-[10] cursor-crosshair"
          style={{
            left: marker.x,
            top: marker.y,
            y: marker.yLayer,
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={
            startAnimation
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: -20 }
          }
          transition={{
            duration: 1.5,
            delay: marker.d,
            ease: [0.23, 1, 0.32, 1],
          }}
          whileHover={{
            scale: 1.2,
            color: "#ffffff",
            textShadow: "0 0 10px rgba(255,255,255,0.8)",
            letterSpacing: "0.2em"
          }}
        >
          {marker.text}
        </motion.div>
      ))}

      {/* ═══ Main Content ═══ */}
      <motion.div
        suppressHydrationWarning
        style={{ y: mainY, opacity: mainOpacity }}
        className="relative z-10 text-center flex flex-col items-center justify-center w-full max-w-[1440px] px-6 md:px-16 pointer-events-none"
      >
        {/* Enable pointer events selectively on the content that needs it (like buttons) */}

        {/* Tech Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            startAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-3 px-6 py-2 border border-silver-chrome/20 bg-black/40 backdrop-blur-md text-[11px] uppercase tracking-[0.25em] text-silver-chrome/80 font-mono rounded-sm">
            <span className="w-2 h-2 bg-white animate-pulse" />
            Core Drop // SS26
          </span>
        </motion.div>

        {/* Title — Bold, Streetwear Sans-Serif */}
        <div className="overflow-hidden mb-1 md:mb-3">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={
              startAnimation
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 80 }
            }
            transition={{
              duration: 1.0,
              delay: 0.3,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="font-sans font-black text-[12vw] md:text-[9vw] lg:text-[110px] text-white tracking-tighter leading-[0.9] uppercase"
          >
            Klvora
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-6 md:mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 80 }}
            animate={
              startAnimation
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 80 }
            }
            transition={{
              duration: 1.0,
              delay: 0.45,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="font-sans font-black text-[12vw] md:text-[9vw] lg:text-[110px] text-transparent bg-clip-text bg-gradient-to-r from-silver-chrome via-white to-silver-chrome/50 tracking-tighter leading-[0.9] uppercase"
          >
            Fashion
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={
            startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, delay: 0.7 }}
          className="font-sans text-body-lg md:text-body-xl text-silver-chrome/70 max-w-lg mb-12"
        >
          Where raw street culture meets oversized comfort.
          <br className="hidden md:block" />
          Engineered for the modern concrete landscape.
        </motion.p>

        {/* CTA Buttons - Brutalist/Techwear style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={
            startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
          }
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 pointer-events-auto" // Re-enable pointer events for buttons!
        >
          <Link
            href="/collections"
            className="bg-white text-black font-sans font-bold text-ui-button uppercase tracking-[0.1em] px-12 py-5 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 flex items-center justify-center gap-3 group"
            id="hero-cta-primary"
          >
            Shop The Drop
            <ArrowRight
              size={18}
              strokeWidth={2.5}
              className="group-hover:translate-x-1.5 transition-transform duration-300"
            />
          </Link>
          <Link
            href="/collections"
            className="border border-white/20 text-white font-sans font-bold text-ui-button uppercase tracking-[0.1em] px-12 py-5 hover:bg-white/5 transition-colors duration-200 backdrop-blur-sm flex items-center justify-center"
            id="hero-cta-secondary"
          >
            View Lookbook
          </Link>
        </motion.div>
      </motion.div>

      {/* ── Scroll Indicator (Tech Style) ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={startAnimation ? { opacity: 0.6 } : { opacity: 0 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10 pointer-events-none"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-silver-chrome/60">
          Scroll Down
        </span>
        <div className="w-[1px] h-12 bg-white/10 overflow-hidden relative">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-1/2 bg-white/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
