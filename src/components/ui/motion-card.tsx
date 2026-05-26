import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MotionCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
  spotlight?: boolean;
  intensity?: number;
}

/**
 * Premium card wrapper with subtle 3D tilt + cursor spotlight.
 * Desktop only (skips effects on touch / reduced motion).
 */
export function MotionCard({
  children,
  className,
  tilt = true,
  spotlight = true,
  intensity = 1,
}: MotionCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const px = useMotionValue(50);
  const py = useMotionValue(50);

  const rxs = useSpring(rx, { stiffness: 180, damping: 18, mass: 0.4 });
  const rys = useSpring(ry, { stiffness: 180, damping: 18, mass: 0.4 });

  const transform = useTransform(
    [rxs, rys],
    ([rxv, ryv]) => `perspective(900px) rotateX(${rxv}deg) rotateY(${ryv}deg)`
  );

  const background = useTransform(
    [px, py],
    ([x, y]) =>
      `radial-gradient(420px circle at ${x}% ${y}%, hsl(var(--accent-blue) / 0.18), transparent 60%)`
  );

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (tilt) {
      const max = 5 * intensity;
      ry.set((x - 0.5) * 2 * max);
      rx.set(-(y - 0.5) * 2 * max);
    }
    if (spotlight) {
      px.set(x * 100);
      py.set(y * 100);
    }
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={tilt && !reduce ? { transform, transformStyle: "preserve-3d" } : undefined}
      className={cn(
        "relative group will-change-transform transition-shadow duration-500",
        "hover:shadow-[0_24px_60px_-20px_hsl(var(--accent-blue)/0.35)]",
        className
      )}
    >
      {spotlight && !reduce && (
        <motion.div
          aria-hidden
          style={{ background }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      )}
      <div className="relative" style={{ transform: "translateZ(0)" }}>{children}</div>
    </motion.div>
  );
}
