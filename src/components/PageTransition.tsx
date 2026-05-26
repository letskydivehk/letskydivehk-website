import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { pageVariants } from "@/lib/motion";

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="hidden"
        animate="show"
        exit="exit"
        variants={pageVariants}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
