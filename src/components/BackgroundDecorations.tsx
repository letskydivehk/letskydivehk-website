import { motion } from 'framer-motion';

export function BackgroundDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating Clouds */}
      <motion.div
        className="absolute top-[15%] left-[5%] opacity-20"
        animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-32 h-20 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[25%] right-[10%] opacity-15"
        animate={{ x: [0, -40, 0], y: [0, 15, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-48 h-28 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[45%] left-[15%] opacity-10"
        animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-40 h-24 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[60%] right-[5%] opacity-15"
        animate={{ x: [0, -30, 0], y: [0, 10, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-36 h-22 text-white" />
      </motion.div>
      
      <motion.div
        className="absolute top-[80%] left-[40%] opacity-10"
        animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-44 h-26 text-white" />
      </motion.div>

      {/* Skydiver Silhouettes */}
      <motion.div
        className="absolute top-[20%] right-[25%] opacity-10"
        animate={{ 
          y: [0, 100, 200],
          x: [0, 20, 40],
          rotate: [0, 15, 30]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <SkydiverSVG className="w-12 h-12 text-accent-orange" />
      </motion.div>
      
      <motion.div
        className="absolute top-[10%] left-[60%] opacity-8"
        animate={{ 
          y: [0, 150, 300],
          x: [0, -30, -60],
          rotate: [0, -10, -20]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <SkydiverSVG className="w-8 h-8 text-white" />
      </motion.div>

      {/* Parachute */}
      <motion.div
        className="absolute top-[35%] left-[80%] opacity-10"
        animate={{ 
          y: [0, 80, 160],
          x: [0, -15, -30],
          rotate: [-5, 5, -5]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      >
        <ParachuteSVG className="w-16 h-20 text-accent-orange" />
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
