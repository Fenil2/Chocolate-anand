"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/format";
import { buttonClass } from "@/components/ui/Button";
import { useDialog } from "@/components/ui/useDialog";
import { easeMelt } from "@/components/motion/variants";

export function CartDrawer() {
  const { isOpen, close, lines, subtotal, count, setQty, remove } = useCart();
  const panelRef = useDialog<HTMLDivElement>(isOpen, close);
  const [notice, setNotice] = useState(false);

  return (
    <AnimatePresence onExitComplete={() => setNotice(false)}>
      {isOpen && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-obsidian/70 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute right-0 top-0 flex h-full w-full max-w-[26rem] flex-col border-l border-ivory/10 bg-cocoa shadow-[-30px_0_60px_rgba(0,0,0,0.5)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.45 }}
          >
            <header className="flex items-center justify-between border-b border-ivory/10 px-6 py-5">
              <h2 id="cart-title" className="display text-2xl">
                Your bag <span className="font-sans text-sm text-beige/70">({count})</span>
              </h2>
              <button onClick={close} aria-label="Close bag" className="-mr-2 p-2 text-ivory/80 hover:text-gold">
                <X size={22} strokeWidth={1.4} />
              </button>
            </header>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
                <p className="display text-3xl">Nothing melting here yet.</p>
                <p className="text-sm text-beige/80">Pick a bar to start your bag.</p>
                <a href="#shop" onClick={close} className={buttonClass("ghost")}>
                  Browse the bars
                </a>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ivory/10 overflow-y-auto px-6">
                  <AnimatePresence initial={false}>
                    {lines.map(({ product, qty, total }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.35, ease: easeMelt }}
                        className="flex gap-4 py-5"
                      >
                        <div className="relative h-24 w-[4.5rem] shrink-0 overflow-hidden bg-obsidian">
                          <Image src={product.image.src} alt="" fill sizes="72px" className="object-cover" />
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="display text-xl">{product.name}</p>
                              <p className="text-xs text-beige/70">{product.subtitle}</p>
                            </div>
                            <p className="text-sm tabular-nums">{formatINR(total)}</p>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-3">
                            <div className="flex items-center border border-ivory/20" role="group" aria-label={`Quantity of ${product.name}`}>
                              <button
                                className="p-2 hover:text-gold"
                                onClick={() => setQty(product.id, qty - 1)}
                                aria-label={`Decrease ${product.name}`}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
                                {qty}
                              </span>
                              <button
                                className="p-2 hover:text-gold"
                                onClick={() => setQty(product.id, qty + 1)}
                                aria-label={`Increase ${product.name}`}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <button
                              onClick={() => remove(product.id)}
                              className="text-xs text-beige/70 underline-offset-4 hover:text-gold hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <footer className="border-t border-ivory/10 px-6 py-6">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm text-beige/80">Subtotal</span>
                    <span className="display text-2xl tabular-nums">{formatINR(subtotal)}</span>
                  </div>
                  <p className="mb-5 text-xs text-beige/60">Demo prices. Taxes and delivery are worked out at checkout.</p>
                  <button className={buttonClass("solid", "w-full")} onClick={() => setNotice(true)}>
                    Checkout
                  </button>
                  <AnimatePresence>
                    {notice && (
                      <motion.p
                        role="status"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 border-l-2 border-copper pl-3 text-xs leading-relaxed text-beige"
                      >
                        Checkout isn’t connected in this preview, so no order has been placed. Your bag is saved on this device.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
