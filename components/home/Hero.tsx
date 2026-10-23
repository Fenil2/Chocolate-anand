"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LinkButton } from "@/components/ui/Button";
import { easeMelt } from "@/components/motion/variants";
import { MeltEdge } from "./MeltEdge";

const HEADLINE = ["Some", "Things", "Are", "Better", "When", "They", "Melt."];

// Fixed positions for the drifting cocoa dust (deterministic for SSR)
const DUST = [
  { left: "58%", top: "22%", size: 5, dur: 16, delay: 0 },
  { left: "71%", top: "64%", size: 3, dur: 19, delay: 3 },
  { left: "86%", top: "30%", size: 4, dur: 14, delay: 6 },
  { left: "64%", top: "78%", size: 2.5, dur: 21, delay: 1.5 },
  { left: "92%", top: "70%", size: 3.5, dur: 17, delay: 4.5 },
  { left: "48%", top: "48%", size: 2, dur: 23, delay: 8 },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 90]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);

  return (
    <section ref={ref} id="top" aria-labelledby="hero-title" className="relative -mt-16 bg-obsidian lg:-mt-20">
      <div className="relative lg:min-h-[max(44rem,calc(100svh-2rem))]">
        {/* Product visual */}
        <motion.div
          className="relative aspect-[4/5] max-h-[74svh] w-full overflow-hidden sm:aspect-[16/11] sm:max-h-none lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[64%]"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.6, ease: easeMelt, delay: 0.15 }}
        >
          <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.14 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.4, ease: easeMelt, delay: 0.15 }}
            >
              <Image
                src="/images/mora/hero-bar.jpg"
                alt="A MORA 70% dark chocolate bar in a black and copper wrapper, surrounded by cocoa beans, cocoa powder and glossy broken squares"
                fill
                priority
                // hidden below 640px, so ask for the smallest file there
                sizes="(min-width: 1024px) 64vw, (min-width: 640px) 100vw, 1px"
                className="hidden object-cover object-center sm:block"
              />
              <Image
                src="/images/mora/hero-bar-tall.jpg"
                alt="A MORA 70% dark chocolate bar in a black and copper wrapper, surrounded by cocoa beans and broken squares"
                fill
                priority
                // phone-only crop; hidden from 640px, so the smallest file is enough there
                sizes="(max-width: 639px) 100vw, 1px"
                className="object-cover object-center sm:hidden"
              />
            </motion.div>
          </motion.div>

          {/* One pass of light across the glossy surface */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-[#f3d2a8]/15 to-transparent mix-blend-overlay motion-reduce:hidden"
            style={{ skewX: -16 }}
            initial={{ x: "-130%" }}
            animate={{ x: "360%" }}
            transition={{ duration: 2.6, delay: 1.7, ease: "easeInOut" }}
          />

          {/* Blend photo into the black page */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/10 to-obsidian/40 lg:bg-gradient-to-r lg:from-obsidian lg:via-obsidian/20 lg:to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-obsidian to-transparent lg:block" />

          {/* Cocoa dust */}
          {DUST.map((d) => (
              <span
                key={d.left + d.top}
                aria-hidden
                className="cocoa-dust pointer-events-none absolute rounded-full bg-gold/50 blur-[0.5px] motion-reduce:hidden"
                style={{
                  left: d.left,
                  top: d.top,
                  width: d.size,
                  height: d.size,
                  animationDuration: `${d.dur}s`,
                  animationDelay: `${d.delay}s`,
                }}
              />
            ))}

          <p className="pointer-events-none absolute bottom-6 right-5 hidden text-[0.66rem] tracking-[0.32em] text-beige/70 uppercase sm:block lg:bottom-28 lg:right-10">
            More Cacao. More Taste.
          </p>
        </motion.div>

        {/* Copy */}
        <motion.div
          style={{ y: copyY }}
          className="relative z-10 mx-auto max-w-[90rem] px-4 pb-20 sm:px-8 sm:pb-24 lg:flex lg:min-h-[max(44rem,calc(100svh-2rem))] lg:items-center lg:pb-36 lg:pt-28"
        >
          <div className="-mt-14 max-w-[34rem] min-[400px]:-mt-20 sm:-mt-32 lg:mt-0 lg:max-w-[40rem]">
            <motion.p
              className="kicker"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeMelt, delay: 0.35 }}
            >
              Crafted for your cravings
            </motion.p>

            <h1 id="hero-title" className="display mt-4 text-[clamp(2.3rem,10.6vw,3.6rem)] sm:mt-5 sm:text-[clamp(2.75rem,5.4vw,5.6rem)]">
              {HEADLINE.map((word, i) => (
                <span key={word} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, ease: easeMelt, delay: 0.45 + i * 0.07 }}
                  >
                    {word}
                  </motion.span>
                  {i < HEADLINE.length - 1 && " "}
                </span>
              ))}
            </h1>

            <motion.p
              className="mt-5 max-w-[26rem] text-base leading-relaxed text-beige min-[380px]:text-lg sm:mt-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeMelt, delay: 0.85 }}
            >
              Deep cacao. Silky texture. A moment worth savouring.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:gap-6"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeMelt, delay: 0.95 }}
            >
              <LinkButton href="#shop">Discover Our Chocolates</LinkButton>
              <LinkButton href="#gifting" variant="line" className="self-start pt-3 sm:self-auto sm:pt-0">
                Explore the Collection
              </LinkButton>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Signature: ganache pouring over the edge into the next section */}
      <MeltEdge fadeTop pourOnMount className="absolute inset-x-0 top-full z-20 -translate-y-[38%]" />
    </section>
  );
}
