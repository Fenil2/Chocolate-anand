"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/format";
import { springPress } from "@/components/motion/variants";

type Variant = "solid" | "ghost" | "line";

const base =
  "inline-flex items-center justify-center gap-2 font-sans text-[0.8rem] tracking-[0.14em] uppercase transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid: "bg-ivory text-obsidian hover:bg-gold px-5 sm:px-7 py-4 rounded-[2px]",
  ghost: "text-ivory border border-ivory/30 hover:border-gold hover:text-gold px-5 sm:px-7 py-4 rounded-[2px]",
  line: "text-ivory pb-1 border-b border-copper/70 hover:text-gold hover:border-gold",
};

export const buttonClass = (variant: Variant = "solid", className?: string) => cn(base, variants[variant], className);

type ButtonProps = HTMLMotionProps<"button"> & { variant?: Variant };

export function Button({ variant = "solid", className, ...props }: ButtonProps) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} transition={springPress} className={buttonClass(variant, className)} {...props} />
  );
}

type LinkButtonProps = HTMLMotionProps<"a"> & { variant?: Variant };

export function LinkButton({ variant = "solid", className, ...props }: LinkButtonProps) {
  return <motion.a whileTap={{ scale: 0.97 }} transition={springPress} className={buttonClass(variant, className)} {...props} />;
}
