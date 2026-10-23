"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "./products";
import { AddToCartButton } from "./AddToCartButton";
import { formatINR } from "@/lib/format";
import { fadeUp } from "@/components/motion/variants";

export function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article variants={fadeUp} className="group flex h-full flex-col" aria-labelledby={`p-${product.id}`}>
      <motion.div
        className="relative aspect-[2/3] overflow-hidden bg-cocoa"
        whileHover="hover"
        initial="rest"
        animate="rest"
      >
        <motion.div
          className="absolute inset-0"
          variants={{ rest: { scale: 1, y: 0 }, hover: { scale: 1.045, y: -6 } }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
        >
          <Image
            src={product.image.src}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 78vw"
            className="object-cover"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent" />
        {/* Foil-coloured line that draws in on hover */}
        <motion.span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left"
          style={{ backgroundColor: product.accent }}
          variants={{ rest: { scaleX: 0.18 }, hover: { scaleX: 1 } }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3 id={`p-${product.id}`} className="display text-[2rem]">
            {product.name}
          </h3>
          <p className="shrink-0 text-sm tabular-nums text-beige">
            {formatINR(product.price)}
            <span className="sr-only"> (demo price)</span>
          </p>
        </div>
        <p className="mt-1 text-sm" style={{ color: product.accent }}>
          {product.subtitle}
        </p>
        <p className="mt-3 max-w-[30ch] text-sm leading-relaxed text-beige/75">{product.description}</p>
        <div className="mt-auto pt-6">
          <AddToCartButton productId={product.id} productName={product.name} />
        </div>
      </div>
    </motion.article>
  );
}
