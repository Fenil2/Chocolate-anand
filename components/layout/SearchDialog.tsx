"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { allProducts } from "@/components/products/products";
import { useCart } from "@/components/cart/CartProvider";
import { useDialog } from "@/components/ui/useDialog";
import { formatINR } from "@/lib/format";
import { easeMelt } from "@/components/motion/variants";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useDialog<HTMLDivElement>(open, onClose);
  const [query, setQuery] = useState("");
  const { add, open: openCart } = useCart();
  const inputId = useId();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter((p) =>
      [p.name, p.subtitle, p.description, p.cacao ? `${p.cacao}%` : ""].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <AnimatePresence onExitComplete={() => setQuery("")}>
      {open && (
        <div className="fixed inset-0 z-[70]">
          <motion.div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label="Search chocolates"
            className="relative mx-auto mt-16 w-[calc(100%-2rem)] max-w-2xl border border-ivory/10 bg-cocoa sm:mt-24"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: easeMelt }}
          >
            <div className="flex items-center gap-3 border-b border-ivory/10 px-5">
              <Search size={18} strokeWidth={1.4} className="text-beige/70" aria-hidden />
              <label htmlFor={inputId} className="sr-only">
                Search by flavour, name or cacao percentage
              </label>
              <input
                id={inputId}
                data-autofocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Strawberry, sea salt, 85%…"
                className="h-16 flex-1 bg-transparent text-lg text-ivory placeholder:text-beige/40 focus:outline-none"
                autoComplete="off"
              />
              <button onClick={onClose} aria-label="Close search" className="p-2 hover:text-gold">
                <X size={20} strokeWidth={1.4} />
              </button>
            </div>
            <ul className="max-h-[60vh] overflow-y-auto p-2" aria-live="polite">
              {results.length === 0 && (
                <li className="px-4 py-8 text-center text-sm text-beige/80">
                  No chocolate matches “{query}”. Try a flavour like “salt” or a cacao level like “70%”.
                </li>
              )}
              {results.map((p) => (
                <li key={p.id} className="flex items-center gap-4 p-3 hover:bg-ivory/[0.04]">
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden bg-obsidian">
                    <Image src={p.image.src} alt="" fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="display text-lg">{p.name}</p>
                    <p className="truncate text-xs text-beige/70">{p.subtitle}</p>
                  </div>
                  <span className="text-sm tabular-nums text-beige">{formatINR(p.price)}</span>
                  <button
                    onClick={() => {
                      add(p.id);
                      onClose();
                      openCart();
                    }}
                    className="border border-ivory/25 px-3 py-2 text-[0.7rem] tracking-[0.12em] uppercase hover:border-gold hover:text-gold"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
