import { motion } from 'framer-motion';

export function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* ===== CLOUDS - Positioned at edges to avoid content ===== */}
      
      {/* Left side clouds */}
      <motion.div
        className="absolute top-[5%] left-[2%] opacity-20"
        animate={{ x: [0, 20, 0], y: [0, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-24 h-14 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[18%] left-[1%] opacity-15"
        animate={{ x: [0, 25, 0], y: [0, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <CloudSVG className="w-32 h-18 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[35%] left-[3%] opacity-18"
        animate={{ x: [0, 15, 0], y: [0, -12, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <CloudSVG className="w-28 h-16 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[52%] left-[1%] opacity-12"
        animate={{ x: [0, 30, 0], y: [0, 8, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <CloudSVG className="w-36 h-20 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[70%] left-[2%] opacity-16"
        animate={{ x: [0, 18, 0], y: [0, -6, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <CloudSVG className="w-30 h-17 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[88%] left-[3%] opacity-14"
        animate={{ x: [0, 22, 0], y: [0, 10, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <CloudSVG className="w-26 h-15 text-white" />
      </motion.div>

      {/* Right side clouds */}
      <motion.div
        className="absolute top-[8%] right-[2%] opacity-18"
        animate={{ x: [0, -25, 0], y: [0, 12, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <CloudSVG className="w-30 h-18 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[22%] right-[1%] opacity-15"
        animate={{ x: [0, -20, 0], y: [0, -10, 0] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <CloudSVG className="w-34 h-20 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[40%] right-[3%] opacity-20"
        animate={{ x: [0, -30, 0], y: [0, 8, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <CloudSVG className="w-28 h-16 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[58%] right-[2%] opacity-14"
        animate={{ x: [0, -18, 0], y: [0, -14, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <CloudSVG className="w-32 h-19 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[75%] right-[1%] opacity-16"
        animate={{ x: [0, -22, 0], y: [0, 6, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      >
        <CloudSVG className="w-26 h-15 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[92%] right-[3%] opacity-12"
        animate={{ x: [0, -15, 0], y: [0, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      >
        <CloudSVG className="w-24 h-14 text-white" />
      </motion.div>

      {/* ===== SKYDIVERS - Small and at edges ===== */}
      
      {/* Left side skydivers */}
      <motion.div
        className="absolute top-[12%] left-[5%] opacity-15"
        animate={{ y: [0, 80, 160], x: [0, 15, 30], rotate: [0, 10, 20] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <SkydiverSVG className="w-8 h-8 text-accent-orange" />
      </motion.div>
      
      <motion.div
        className="absolute top-[28%] left-[4%] opacity-12"
        animate={{ y: [0, 100, 200], x: [0, 20, 40], rotate: [0, -8, -16] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <SkydiverSVG className="w-6 h-6 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[45%] left-[6%] opacity-14"
        animate={{ y: [0, 70, 140], x: [0, 12, 24], rotate: [0, 12, 24] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      >
        <SkydiverSVG className="w-7 h-7 text-accent-orange" />
      </motion.div>
      
      <motion.div
        className="absolute top-[62%] left-[3%] opacity-10"
        animate={{ y: [0, 90, 180], x: [0, 18, 36], rotate: [0, -6, -12] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 9 }}
      >
        <SkydiverSVG className="w-5 h-5 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[80%] left-[5%] opacity-13"
        animate={{ y: [0, 60, 120], x: [0, 10, 20], rotate: [0, 8, 16] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <SkydiverSVG className="w-6 h-6 text-accent-orange" />
      </motion.div>

      {/* Right side skydivers */}
      <motion.div
        className="absolute top-[10%] right-[5%] opacity-14"
        animate={{ y: [0, 90, 180], x: [0, -20, -40], rotate: [0, -10, -20] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <SkydiverSVG className="w-7 h-7 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[25%] right-[4%] opacity-16"
        animate={{ y: [0, 110, 220], x: [0, -15, -30], rotate: [0, 12, 24] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <SkydiverSVG className="w-8 h-8 text-accent-orange" />
      </motion.div>
      
      <motion.div
        className="absolute top-[42%] right-[6%] opacity-11"
        animate={{ y: [0, 75, 150], x: [0, -12, -24], rotate: [0, -8, -16] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      >
        <SkydiverSVG className="w-6 h-6 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[58%] right-[3%] opacity-15"
        animate={{ y: [0, 85, 170], x: [0, -22, -44], rotate: [0, 6, 12] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <SkydiverSVG className="w-7 h-7 text-accent-orange" />
      </motion.div>
      
      <motion.div
        className="absolute top-[78%] right-[5%] opacity-12"
        animate={{ y: [0, 65, 130], x: [0, -10, -20], rotate: [0, -14, -28] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      >
        <SkydiverSVG className="w-5 h-5 text-white" />
      </motion.div>

      {/* ===== PARACHUTES - At edges ===== */}
      
      <motion.div
        className="absolute top-[15%] left-[7%] opacity-12"
        animate={{ y: [0, 50, 100], x: [0, -8, -16], rotate: [-3, 3, -3] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <ParachuteSVG className="w-10 h-12 text-accent-orange" />
      </motion.div>
      
      <motion.div
        className="absolute top-[38%] right-[7%] opacity-14"
        animate={{ y: [0, 60, 120], x: [0, 10, 20], rotate: [3, -3, 3] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <ParachuteSVG className="w-12 h-14 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[55%] left-[8%] opacity-10"
        animate={{ y: [0, 45, 90], x: [0, -6, -12], rotate: [-2, 2, -2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      >
        <ParachuteSVG className="w-9 h-11 text-accent-orange" />
      </motion.div>
      
      <motion.div
        className="absolute top-[72%] right-[8%] opacity-13"
        animate={{ y: [0, 55, 110], x: [0, 8, 16], rotate: [2, -2, 2] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <ParachuteSVG className="w-11 h-13 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[90%] left-[6%] opacity-11"
        animate={{ y: [0, 40, 80], x: [0, -5, -10], rotate: [-4, 4, -4] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      >
        <ParachuteSVG className="w-10 h-12 text-accent-orange" />
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

function SkydiverSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 50" className={className} fill="currentColor">
      {/* Head */}
      <circle cx="25" cy="8" r="5" />
      {/* Body */}
      <path d="M25 13 L25 30" stroke="currentColor" strokeWidth="3" fill="none" />
      {/* Arms spread */}
      <path d="M10 20 L25 18 L40 20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Legs spread */}
      <path d="M15 45 L25 30 L35 45" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ParachuteSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" className={className} fill="currentColor">
      {/* Canopy */}
      <path d="M5 25 Q30 -5 55 25 Q50 30 30 30 Q10 30 5 25" fill="currentColor" opacity="0.8" />
      {/* Lines */}
      <line x1="15" y1="28" x2="28" y2="55" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="30" x2="30" y2="55" stroke="currentColor" strokeWidth="1" />
      <line x1="45" y1="28" x2="32" y2="55" stroke="currentColor" strokeWidth="1" />
      {/* Person */}
      <circle cx="30" cy="58" r="4" />
      <line x1="30" y1="62" x2="30" y2="68" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
