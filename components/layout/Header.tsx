"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Search, ShoppingBag } from "lucide-react";
import { useCallback, useState } from "react";
import { site } from "@/lib/site";
import { cn } from "@/lib/format";
import { Logo } from "@/components/ui/Logo";
import { useCart } from "@/components/cart/CartProvider";
import { MobileNav } from "./MobileNav";
import { SearchDialog } from "./SearchDialog";
import { easeMelt } from "@/components/motion/variants";

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, open } = useCart();

  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: easeMelt, delay: 0.1 }}
        className={cn(
          "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          solid
            ? "border-b border-ivory/10 bg-obsidian/85 backdrop-blur-md"
            : "border-b border-transparent bg-gradient-to-b from-obsidian/70 to-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between gap-6 px-4 sm:px-8 lg:h-20">
          <button
            className="-ml-2.5 p-2.5 text-ivory sm:-ml-2 sm:p-2 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu size={22} strokeWidth={1.4} />
          </button>

          <a href="#top" className="w-24 shrink-0 sm:w-28 lg:w-32" aria-label="MORA home">
            <Logo priority />
          </a>

          <nav aria-label="Main" className="hidden flex-1 justify-center lg:flex">
            <ul className="flex gap-10">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="group relative py-2 text-[0.82rem] tracking-[0.08em] text-ivory/85 transition-colors hover:text-ivory"
                  >
                    {item.label}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-copper transition-transform duration-300 ease-out group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2.5 text-ivory/85 hover:text-gold sm:p-2" aria-label="Search chocolates">
              <Search size={20} strokeWidth={1.4} />
            </button>
            <button
              onClick={open}
              className="relative -mr-2.5 p-2.5 text-ivory/85 hover:text-gold sm:-mr-2 sm:p-2"
              aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
            >
              <ShoppingBag size={20} strokeWidth={1.4} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.35, duration: 0.4 }}
                    className="absolute right-0.5 top-0.5 flex h-[1.05rem] min-w-[1.05rem] items-center justify-center rounded-full bg-copper px-1 text-[0.62rem] font-medium text-obsidian tabular-nums"
                    aria-hidden
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNav open={menuOpen} onClose={closeMenu} />
      <SearchDialog open={searchOpen} onClose={closeSearch} />
    </>
  );
}
