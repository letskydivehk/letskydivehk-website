import type { Variants, Transition } from "framer-motion";

// Apple-style ease-out-expo
export const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const easeInOut: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const durations = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
};

export const baseTransition: Transition = {
  duration: durations.base,
  ease: easeOutExpo,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: baseTransition },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: durations.base, ease: easeOutExpo } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: baseTransition },
};

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const revealMask: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};

export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.3, ease: easeOutExpo },
  },
};
