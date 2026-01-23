import { motion } from 'framer-motion';

export function SectionDecorations() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Left side clouds - white/muted style */}
      <motion.div
        className="absolute top-[8%] left-[1%] opacity-20"
        animate={{ x: [0, 15, 0], y: [0, -5, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-20 h-12 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[25%] left-[2%] opacity-15"
        animate={{ x: [0, 20, 0], y: [0, 8, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <CloudSVG className="w-24 h-14 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[45%] left-[1%] opacity-18"
        animate={{ x: [0, 18, 0], y: [0, -6, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <CloudSVG className="w-22 h-13 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[65%] left-[2%] opacity-20"
        animate={{ x: [0, 12, 0], y: [0, 5, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <CloudSVG className="w-18 h-11 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[85%] left-[1%] opacity-15"
        animate={{ x: [0, 16, 0], y: [0, -4, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <CloudSVG className="w-20 h-12 text-white drop-shadow-sm" />
      </motion.div>

      {/* Right side clouds */}
      <motion.div
        className="absolute top-[12%] right-[1%] opacity-18"
        animate={{ x: [0, -18, 0], y: [0, 6, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <CloudSVG className="w-22 h-13 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[32%] right-[2%] opacity-15"
        animate={{ x: [0, -14, 0], y: [0, -7, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <CloudSVG className="w-26 h-15 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[52%] right-[1%] opacity-20"
        animate={{ x: [0, -20, 0], y: [0, 5, 0] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <CloudSVG className="w-20 h-12 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[72%] right-[2%] opacity-15"
        animate={{ x: [0, -12, 0], y: [0, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <CloudSVG className="w-24 h-14 text-white drop-shadow-sm" />
      </motion.div>
      
      <motion.div
        className="absolute top-[92%] right-[1%] opacity-18"
        animate={{ x: [0, -16, 0], y: [0, 4, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      >
        <CloudSVG className="w-18 h-11 text-white drop-shadow-sm" />
      </motion.div>
    </div>
  );
}

function CloudSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} fill="currentColor">
      <ellipse cx="25" cy="40" rx="20" ry="15" />
      <ellipse cx="50" cy="35" rx="25" ry="20" />
      <ellipse cx="75" cy="40" rx="20" ry="15" />
      <ellipse cx="40" cy="25" rx="18" ry="14" />
      <ellipse cx="60" cy="25" rx="18" ry="14" />
    </svg>
  );
}
