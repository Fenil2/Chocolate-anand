"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const markScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.92, 1.06]);
  const powderY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [50, -50]);

  return (
    <section ref={ref} id="story" aria-labelledby="story-title" className="grain relative overflow-hidden bg-cocoa py-20 sm:py-28 lg:py-44">
      {/* Oversized wordmark watermark */}
      <motion.div
        aria-hidden
        style={{ scale: markScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 w-[140%] max-w-[110rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.045] sm:w-[110%]"
      >
        <Image src="/images/mora/mora-wordmark.png" alt="" width={986} height={220} className="h-auto w-full" />
      </motion.div>

      <motion.div
        style={{ y: powderY }}
        className="absolute right-0 top-16 hidden aspect-[10/7] w-[22rem] overflow-hidden opacity-80 [mask-image:radial-gradient(closest-side_at_70%_50%,black_45%,transparent)] lg:block"
      >
        <Image src="/images/mora/cocoa-powder.jpg" alt="" fill sizes="22rem" className="object-cover" />
      </motion.div>

      <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-8">
        <RevealItem>
          <div className="mx-auto mb-10 w-28 opacity-90">
            <Image src="/images/mora/mora-wordmark.png" alt="" width={986} height={220} className="h-auto w-full" />
          </div>
        </RevealItem>
        <RevealItem>
          <h2 id="story-title" className="display text-[clamp(2.8rem,6.4vw,5.6rem)]">
            More Cacao. More Taste.
          </h2>
        </RevealItem>
        <RevealItem>
          <div className="mx-auto my-8 h-12 w-px bg-gradient-to-b from-copper to-transparent" aria-hidden />
        </RevealItem>
        <RevealItem>
          <p className="mx-auto max-w-[34rem] font-display text-[1.12rem] leading-[1.65] text-beige min-[400px]:text-[1.2rem] sm:text-[1.3rem]">
            We believe chocolate should be an experience, not just a sweet treat. MORA celebrates the richness of cacao, the
            pleasure of texture, and the little moments that deserve something extraordinary.
          </p>
        </RevealItem>
      </Reveal>
    </section>
  );
}
