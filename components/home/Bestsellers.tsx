"use client";

import { motion } from "framer-motion";
import { bars } from "@/components/products/products";
import { ProductCard } from "@/components/products/ProductCard";
import { Reveal, RevealItem } from "@/components/motion/Reveal";
import { stagger } from "@/components/motion/variants";

export function Bestsellers() {
  return (
    <section id="shop" aria-labelledby="shop-title" className="relative bg-obsidian pb-16 pt-[clamp(8rem,17vw,16rem)] sm:pb-24 sm:pt-[clamp(9rem,17vw,16rem)] lg:pb-36 2xl:pt-[19vw]">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-8">
        <Reveal className="mb-10 flex flex-col gap-4 sm:mb-12 md:mb-16 md:flex-row md:items-end md:justify-between">
          <RevealItem>
            <h2 id="shop-title" className="display max-w-[14ch] text-[clamp(2.1rem,9.4vw,2.9rem)] sm:text-[clamp(2.4rem,5vw,4.4rem)]">
              The Ones You’ll Crave Again.
            </h2>
          </RevealItem>
          <RevealItem className="md:text-right">
            <p className="text-lg text-beige">Meet your next favourite bite.</p>
            <p className="mt-1 text-xs text-beige/55">Prices shown are demo prices.</p>
          </RevealItem>
        </Reveal>
      </div>

      {/* Mobile: swipeable row. Tablet: 2-up. Desktop: 4-up with a staggered editorial rhythm. */}
      <motion.ul
        className="mx-auto flex max-w-[90rem] snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 sm:overflow-visible sm:px-8 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        variants={stagger(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        aria-label="Bestselling bars"
      >
        {bars.map((product, i) => (
          <li key={product.id} className={`w-[76vw] max-w-[19rem] shrink-0 snap-start min-[480px]:w-[58vw] min-[480px]:max-w-[20rem] sm:w-auto sm:max-w-none ${i % 2 ? "lg:mt-16" : ""}`}>
            <ProductCard product={product} />
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
