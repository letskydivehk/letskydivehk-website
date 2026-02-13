import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  icon: React.ReactNode;
}

export function AnimatedCounter({ end, suffix = "", prefix = "", duration = 2, label, icon }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group"
    >
      <div className="bg-card rounded-2xl p-6 lg:p-8 clean-border mobile-transparent-card text-center transition-all duration-500 hover:elevated-shadow hover:-translate-y-1">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl bg-accent-orange/0 group-hover:bg-accent-orange/5 transition-colors duration-500" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-orange group-hover:scale-110 transition-all duration-500">
            <div className="text-accent-orange group-hover:text-white transition-colors duration-500">
              {icon}
            </div>
          </div>
          <div className="text-3xl lg:text-4xl font-black text-accent-orange mb-2 tabular-nums">
            {prefix}{count.toLocaleString()}{suffix}
          </div>
          <div className="text-sm text-muted-foreground font-medium">{label}</div>
        </div>
      </div>
    </motion.div>
  );
}
