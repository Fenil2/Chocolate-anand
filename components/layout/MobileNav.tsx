"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { site } from "@/lib/site";
import { Logo } from "@/components/ui/Logo";
import { useDialog } from "@/components/ui/useDialog";
import { easeMelt } from "@/components/motion/variants";

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useDialog<HTMLDivElement>(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="grain fixed inset-0 z-[70] flex flex-col bg-cocoa lg:hidden"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          exit={{ clipPath: "inset(0 100% 0 0)" }}
          transition={{ duration: 0.5, ease: easeMelt }}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <div className="w-24">
              <Logo />
            </div>
            <button onClick={onClose} aria-label="Close menu" className="-mr-2 p-2">
              <X size={24} strokeWidth={1.4} />
            </button>
          </div>
          <motion.ul
            className="flex flex-1 flex-col justify-center gap-2 px-6"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
          >
            {site.nav.map((item) => (
              <motion.li
                key={item.href}
                variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { ease: easeMelt, duration: 0.5 } } }}
              >
                <a href={item.href} onClick={onClose} className="display block py-3 text-[2.6rem] hover:text-gold">
                  {item.label}
                </a>
              </motion.li>
            ))}
          </motion.ul>
          <p className="px-6 pb-10 text-sm text-beige/70">{site.tagline}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
