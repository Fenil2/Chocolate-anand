"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useCallback, useRef, useState, type FocusEvent, type KeyboardEvent, type PointerEvent } from "react";
import { flavourChoices, getProduct, type FlavourProfile } from "@/components/products/products";
import { AddToCartButton } from "@/components/products/AddToCartButton";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { easeMelt } from "@/components/motion/variants";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/format";

/** How long each flavour stays on screen during the automatic tour. */
const INTERVAL_MS = 5000;

// Outgoing and incoming matches overlap in the same grid cell, so the swap is a true cross-fade.
const panel: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.07, delayChildren: 0.12 } },
  exit: { opacity: 0, pointerEvents: "none", transition: { duration: 0.45, ease: "easeIn" } },
};

const bar: Variants = {
  hidden: { opacity: 0, y: 22, scale: 1.04, rotate: -1.5 },
  show: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { duration: 1.1, ease: easeMelt } },
  exit: { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.45, ease: "easeIn" } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeMelt } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.3 } },
};

export function FlavourFinder() {
  const [selected, setSelected] = useState<FlavourProfile>(flavourChoices[0].id);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.35 });
  const reduce = useReducedMotion();

  const index = Math.max(0, flavourChoices.findIndex((c) => c.id === selected));
  const choice = flavourChoices[index];
  const product = getProduct(choice.productId);

  // Auto-tour only while visible and not being read or used.
  const running = !reduce && inView && !hovered && !focused && !userPaused;

  const advance = useCallback(() => {
    setSelected((current) => {
      const i = flavourChoices.findIndex((c) => c.id === current);
      return flavourChoices[(i + 1) % flavourChoices.length].id;
    });
  }, []);

  // Radio-group keyboard pattern: arrows move and select, focus follows.
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (i + keys[e.key] + flavourChoices.length) % flavourChoices.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = flavourChoices.length - 1;
    if (next === null) return;
    e.preventDefault();
    setSelected(flavourChoices[next].id);
    refs.current[next]?.focus();
  };

  // Mouse hover pauses; touch "hover" is ignored so the tour never gets stuck on phones.
  const onPointerEnter = (e: PointerEvent) => e.pointerType === "mouse" && setHovered(true);
  const onPointerLeave = (e: PointerEvent) => e.pointerType === "mouse" && setHovered(false);
  // Only keyboard focus pauses (a tap also focuses the button on some browsers).
  const onFocus = (e: FocusEvent) => {
    try {
      setFocused((e.target as HTMLElement).matches(":focus-visible"));
    } catch {
      // Safari < 15.4 doesn't know :focus-visible; don't pause on focus there.
      setFocused(false);
    }
  };
  const onBlur = (e: FocusEvent<HTMLElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
  };

  return (
    <section
      ref={sectionRef}
      id="flavour"
      aria-labelledby="flavour-title"
      className="grain relative overflow-hidden bg-cocoa py-20 sm:py-24 lg:py-36"
    >
      {/* Accent glow follows the chosen flavour's foil */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] top-1/2 h-[70rem] w-[70rem] -translate-y-1/2 rounded-full opacity-25"
        animate={{ backgroundColor: product?.accent ?? "#B87345" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        style={{
          maskImage: "radial-gradient(closest-side, black, transparent)",
          WebkitMaskImage: "radial-gradient(closest-side, black, transparent)",
        }}
      />

      <div
        className="relative mx-auto grid max-w-[90rem] gap-12 px-4 sm:gap-14 sm:px-8 lg:grid-cols-12 lg:items-center"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <div className="lg:col-span-6">
          <Reveal>
            <RevealItem>
              <h2 id="flavour-title" className="display max-w-[16ch] text-[clamp(2.1rem,9.4vw,2.9rem)] sm:text-[clamp(2.4rem,5vw,4.4rem)]">
                What’s Your Kind of Indulgence?
              </h2>
            </RevealItem>
            <RevealItem>
              <p className="mt-4 text-beige/80">Choose a mood and we’ll hand you the bar.</p>
            </RevealItem>
          </Reveal>

          <div role="radiogroup" aria-labelledby="flavour-title" className="mt-8 border-t border-ivory/10 sm:mt-10">
            {flavourChoices.map((c, i) => {
              const active = c.id === selected;
              return (
                <button
                  key={c.id}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setSelected(c.id)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                  className={cn(
                    "group relative flex w-full items-baseline justify-between gap-4 border-b border-ivory/10 py-4 text-left transition-colors duration-700 ease-out sm:py-5",
                    active ? "text-ivory" : "text-ivory/45 hover:text-ivory/80",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="flavour-indicator"
                      className="absolute -bottom-px left-0 h-px w-full overflow-hidden bg-gold/25 motion-reduce:bg-gold"
                      transition={{ type: "spring", bounce: 0, duration: 0.7 }}
                      aria-hidden
                    >
                      {/* Fills over the interval; reaching the end moves to the next flavour */}
                      <span
                        key={selected}
                        className="flavour-progress absolute inset-0 origin-left bg-gold motion-reduce:hidden"
                        style={{ animationDuration: `${INTERVAL_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                        onAnimationEnd={() => {
                          if (!reduce) advance();
                        }}
                      />
                    </motion.span>
                  )}
                  <span className="display text-[clamp(1.7rem,3.4vw,2.6rem)]">{c.label}</span>
                  <span
                    className={cn(
                      "hidden text-sm transition-colors duration-700 sm:block",
                      active ? "text-beige" : "text-beige/60",
                    )}
                  >
                    {c.line}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setUserPaused((p) => !p)}
            aria-pressed={userPaused}
            className="mt-5 inline-flex items-center gap-2 py-2 text-xs text-beige/70 transition-colors hover:text-gold motion-reduce:hidden"
          >
            {userPaused ? <Play size={13} strokeWidth={1.6} aria-hidden /> : <Pause size={13} strokeWidth={1.6} aria-hidden />}
            {userPaused ? "Play the flavour tour" : "Pause the flavour tour"}
          </button>
        </div>

        <div className="grid lg:col-span-5 lg:col-start-8" aria-live={running ? "off" : "polite"}>
          <AnimatePresence initial={false}>
            {product && (
              <motion.div
                key={product.id}
                variants={panel}
                initial="hidden"
                animate="show"
                exit="exit"
                className="grid grid-cols-[minmax(0,7rem)_1fr] items-end gap-4 [grid-area:1/1] min-[400px]:grid-cols-[minmax(0,9rem)_1fr] min-[400px]:gap-6 sm:grid-cols-[minmax(0,14rem)_1fr]"
              >
                <motion.div
                  variants={bar}
                  className="relative aspect-[2/3] overflow-hidden bg-obsidian shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
                >
                  <Image src={product.image.src} alt={product.image.alt} fill sizes="(min-width: 640px) 14rem, 9rem" className="object-cover" />
                </motion.div>
                <div>
                  <motion.p variants={line} className="text-sm text-beige/70">
                    Your match
                  </motion.p>
                  <motion.h3 variants={line} className="display mt-1 text-[clamp(2rem,9vw,2.4rem)] sm:text-[clamp(2.4rem,4vw,3.4rem)]">
                    {product.name}
                  </motion.h3>
                  <motion.p variants={line} className="mt-1 text-sm" style={{ color: product.accent }}>
                    {product.subtitle}
                  </motion.p>
                  <motion.p variants={line} className="mt-3 text-sm leading-relaxed text-beige/80 sm:mt-4">
                    {choice.line}
                  </motion.p>
                  <motion.p variants={line} className="mt-3 text-sm tabular-nums text-beige sm:mt-4">
                    {formatINR(product.price)} <span className="text-xs text-beige/50">demo price</span>
                  </motion.p>
                  <motion.div variants={line} className="mt-5 max-w-[15rem]">
                    <AddToCartButton productId={product.id} productName={product.name} variant="solid" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
