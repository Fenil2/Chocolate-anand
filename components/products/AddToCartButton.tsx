"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { buttonClass } from "@/components/ui/Button";
import { springPress } from "@/components/motion/variants";

type Props = { productId: string; productName: string; variant?: "solid" | "ghost"; className?: string };

export function AddToCartButton({ productId, productName, variant = "ghost", className }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      transition={springPress}
      onClick={() => {
        add(productId);
        setAdded(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setAdded(false), 1800);
      }}
      aria-label={`Add ${productName} to bag`}
      className={buttonClass(variant, `relative w-full overflow-hidden whitespace-nowrap ${className ?? ""}`)}
    >
      <AnimatePresence mode="wait" initial={false}>
        {added ? (
          <motion.span
            key="added"
            className="inline-flex items-center gap-2"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={15} strokeWidth={1.8} aria-hidden />
            <span className="sm:hidden">Added</span>
            <span className="hidden sm:inline">Added to bag</span>
          </motion.span>
        ) : (
          <motion.span
            key="add"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            Add to cart
          </motion.span>
        )}
      </AnimatePresence>
      <span className="sr-only" role="status">
        {added ? `${productName} added to bag` : ""}
      </span>
    </motion.button>
  );
}
