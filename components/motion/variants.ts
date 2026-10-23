import type { Transition, Variants } from "framer-motion";

export const easeMelt = [0.16, 1, 0.3, 1] as const;

export const springSoft: Transition = { type: "spring", bounce: 0, duration: 0.4 };
export const springPress: Transition = { type: "spring", stiffness: 420, damping: 28 };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeMelt } },
};

export const stagger = (gap = 0.09, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
});

export const imageReveal: Variants = {
  hidden: { clipPath: "inset(18% 0% 18% 0%)", opacity: 0.4, scale: 1.08 },
  show: {
    clipPath: "inset(0% 0% 0% 0%)",
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: easeMelt },
  },
};
