import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, baseTransition } from "@/lib/motion";
import type { ReactNode, HTMLAttributes } from "react";

interface RevealProps extends Omit<HTMLAttributes<HTMLDivElement>, "onAnimationStart" | "onDrag" | "onDragEnd" | "onDragStart"> {
  children: ReactNode;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "header" | "article" | "li" | "ul";
  amount?: number;
  once?: boolean;
}

export function Reveal({
  children,
  delay = 0,
  variants = fadeUp,
  className,
  amount = 0.2,
  once = true,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className} {...rest}>{children}</div>;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ ...baseTransition, delay }}
      className={cn(className)}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
}

export function Stagger({ children, className, stagger = 0.08, delayChildren = 0, amount = 0.2 }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={staggerContainer(stagger, delayChildren)}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, variants = fadeUp }: { children: ReactNode; className?: string; variants?: Variants }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}
