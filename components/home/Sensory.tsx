"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { imageReveal } from "@/components/motion/variants";

const BEATS = [
  { title: "The snap", text: "Clean and bright — the sound of a well-tempered bar." },
  { title: "The melt", text: "Slow, silky, coating every corner." },
  { title: "The finish", text: "Deep cacao that lingers long after." },
];

export function Sensory() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bigY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-40, 40]);
  const smallY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [60, -60]);

  return (
    <section ref={ref} aria-labelledby="sensory-title" className="relative overflow-hidden bg-obsidian py-20 sm:py-24 lg:py-40">
      <div className="mx-auto grid max-w-[90rem] gap-14 px-4 sm:px-8 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-6">
          <motion.div
            className="relative mt-8 aspect-[4/5] w-[84%] max-w-[26rem] overflow-hidden sm:mt-0 sm:w-[80%] sm:max-w-none lg:w-[78%]"
            variants={imageReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className="absolute -inset-y-12 inset-x-0" style={{ y: bigY }}>
              <Image
                src="/images/mora/broken-squares.jpg"
                alt="Glossy squares of MORA dark chocolate stacked and broken on dark stone"
                fill
                sizes="(min-width: 1024px) 36vw, (min-width: 640px) 70vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute right-0 top-0 aspect-[3/4] w-[38%] max-w-[11rem] overflow-hidden border-[6px] border-obsidian sm:top-auto sm:-bottom-10 sm:w-[34%] sm:max-w-none lg:right-[2%]"
            style={{ y: smallY }}
            variants={imageReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <Image
              src="/images/mora/cocoa-beans.jpg"
              alt="Roasted cocoa beans in a dark wooden bowl"
              fill
              sizes="(min-width: 1024px) 16vw, 40vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <Reveal className="lg:col-span-5 lg:col-start-8">
          <RevealItem>
            <h2 id="sensory-title" className="display text-[clamp(2.1rem,9.4vw,2.9rem)] sm:text-[clamp(2.4rem,4.8vw,4.2rem)]">
              Close Your Eyes. Imagine the First Bite.
            </h2>
          </RevealItem>
          <RevealItem>
            <p className="mt-5 max-w-[38ch] font-display text-lg leading-[1.6] text-beige sm:mt-6 sm:text-xl">
              First, the snap. Then, the melt. Finally, that deep cacao finish that makes one square feel like nowhere near
              enough.
            </p>
          </RevealItem>
          <ol className="mt-10 space-y-5 border-l border-copper/40 pl-6">
            {BEATS.map((b) => (
              <RevealItem key={b.title} as="li">
                <p className="text-sm text-gold">{b.title}</p>
                <p className="mt-0.5 text-sm text-beige/75">{b.text}</p>
              </RevealItem>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
