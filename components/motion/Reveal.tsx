"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, stagger } from "./variants";

type RevealProps = {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "section" | "ul" | "header";
  amount?: number;
};

/** Reveals once when scrolled into view. Children using `fadeUp` variants will stagger. */
export function Reveal({ children, className, variants = stagger(), as = "div", amount = 0.25 }: RevealProps) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={variants} initial="hidden" whileInView="show" viewport={{ once: true, amount }}>
      {children}
    </Tag>
  );
}

type RevealItemProps = { children: ReactNode; className?: string; as?: "div" | "li"; id?: string };

export function RevealItem({ children, className, as = "div", id }: RevealItemProps) {
  const Tag = motion[as];
  return (
    <Tag id={id} className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
