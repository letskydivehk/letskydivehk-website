import { motion } from 'framer-motion';

interface SectionDecorationsProps {
  variant?: 'default' | 'alt';
}

export function SectionDecorations({ variant = 'default' }: SectionDecorationsProps) {
  const isAlt = variant === 'alt';
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Left side clouds */}
      <motion.div
        className="absolute top-[8%] left-[1%] opacity-15"
        animate={{ x: [0, 15, 0], y: [0, -5, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSVG className="w-20 h-12 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[25%] left-[2%] opacity-12"
        animate={{ x: [0, 20, 0], y: [0, 8, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <CloudSVG className="w-24 h-14 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[45%] left-[1%] opacity-10"
        animate={{ x: [0, 18, 0], y: [0, -6, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <CloudSVG className="w-22 h-13 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[65%] left-[2%] opacity-14"
        animate={{ x: [0, 12, 0], y: [0, 5, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <CloudSVG className="w-18 h-11 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[85%] left-[1%] opacity-11"
        animate={{ x: [0, 16, 0], y: [0, -4, 0] }}
        transition={{ duration: 19, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <CloudSVG className="w-20 h-12 text-muted-foreground" />
      </motion.div>

      {/* Right side clouds */}
      <motion.div
        className="absolute top-[12%] right-[1%] opacity-13"
        animate={{ x: [0, -18, 0], y: [0, 6, 0] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <CloudSVG className="w-22 h-13 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[32%] right-[2%] opacity-10"
        animate={{ x: [0, -14, 0], y: [0, -7, 0] }}
        transition={{ duration: 21, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <CloudSVG className="w-26 h-15 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[52%] right-[1%] opacity-15"
        animate={{ x: [0, -20, 0], y: [0, 5, 0] }}
        transition={{ duration: 23, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <CloudSVG className="w-20 h-12 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[72%] right-[2%] opacity-12"
        animate={{ x: [0, -12, 0], y: [0, -8, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <CloudSVG className="w-24 h-14 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[92%] right-[1%] opacity-10"
        animate={{ x: [0, -16, 0], y: [0, 4, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 0 }}
      >
        <CloudSVG className="w-18 h-11 text-muted-foreground" />
      </motion.div>

      {/* Left side skydivers */}
      <motion.div
        className="absolute top-[15%] left-[4%] opacity-12"
        animate={{ y: [0, 40, 80], x: [0, 8, 16], rotate: [0, 8, 16] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <SkydiverSVG className={`w-6 h-6 ${isAlt ? 'text-accent-blue' : 'text-accent-orange'}`} />
      </motion.div>
      
      <motion.div
        className="absolute top-[35%] left-[3%] opacity-10"
        animate={{ y: [0, 50, 100], x: [0, 10, 20], rotate: [0, -6, -12] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      >
        <SkydiverSVG className="w-5 h-5 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[55%] left-[5%] opacity-11"
        animate={{ y: [0, 35, 70], x: [0, 6, 12], rotate: [0, 10, 20] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      >
        <SkydiverSVG className={`w-5 h-5 ${isAlt ? 'text-accent-blue' : 'text-accent-orange'}`} />
      </motion.div>
      
      <motion.div
        className="absolute top-[75%] left-[3%] opacity-09"
        animate={{ y: [0, 45, 90], x: [0, 12, 24], rotate: [0, -8, -16] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <SkydiverSVG className="w-4 h-4 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[90%] left-[4%] opacity-10"
        animate={{ y: [0, 30, 60], x: [0, 5, 10], rotate: [0, 6, 12] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <SkydiverSVG className={`w-5 h-5 ${isAlt ? 'text-accent-blue' : 'text-accent-orange'}`} />
      </motion.div>

      {/* Right side skydivers */}
      <motion.div
        className="absolute top-[10%] right-[4%] opacity-11"
        animate={{ y: [0, 45, 90], x: [0, -10, -20], rotate: [0, -10, -20] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <SkydiverSVG className="w-5 h-5 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[28%] right-[3%] opacity-13"
        animate={{ y: [0, 55, 110], x: [0, -8, -16], rotate: [0, 8, 16] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <SkydiverSVG className={`w-6 h-6 ${isAlt ? 'text-accent-blue' : 'text-accent-orange'}`} />
      </motion.div>
      
      <motion.div
        className="absolute top-[48%] right-[5%] opacity-10"
        animate={{ y: [0, 38, 76], x: [0, -6, -12], rotate: [0, -6, -12] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 7 }}
      >
        <SkydiverSVG className="w-4 h-4 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[68%] right-[3%] opacity-12"
        animate={{ y: [0, 42, 84], x: [0, -12, -24], rotate: [0, 4, 8] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <SkydiverSVG className={`w-5 h-5 ${isAlt ? 'text-accent-blue' : 'text-accent-orange'}`} />
      </motion.div>
      
      <motion.div
        className="absolute top-[88%] right-[4%] opacity-09"
        animate={{ y: [0, 32, 64], x: [0, -5, -10], rotate: [0, -12, -24] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      >
        <SkydiverSVG className="w-4 h-4 text-muted-foreground" />
      </motion.div>

      {/* Parachutes */}
      <motion.div
        className="absolute top-[20%] left-[6%] opacity-10"
        animate={{ y: [0, 25, 50], x: [0, -4, -8], rotate: [-2, 2, -2] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <ParachuteSVG className={`w-8 h-10 ${isAlt ? 'text-accent-blue' : 'text-accent-orange'}`} />
      </motion.div>
      
      <motion.div
        className="absolute top-[40%] right-[6%] opacity-12"
        animate={{ y: [0, 30, 60], x: [0, 5, 10], rotate: [2, -2, 2] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      >
        <ParachuteSVG className="w-9 h-11 text-muted-foreground" />
      </motion.div>
      
      <motion.div
        className="absolute top-[60%] left-[7%] opacity-08"
        animate={{ y: [0, 22, 44], x: [0, -3, -6], rotate: [-1, 1, -1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 8 }}
      >
        <ParachuteSVG className={`w-7 h-9 ${isAlt ? 'text-accent-blue' : 'text-accent-orange'}`} />
      </motion.div>
      
      <motion.div
        className="absolute top-[80%] right-[7%] opacity-11"
        animate={{ y: [0, 28, 56], x: [0, 4, 8], rotate: [1, -1, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <ParachuteSVG className="w-8 h-10 text-muted-foreground" />
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
      <circle cx="25" cy="8" r="5" />
      <path d="M25 13 L25 30" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M10 20 L25 18 L40 20" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M15 45 L25 30 L35 45" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function ParachuteSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" className={className} fill="currentColor">
      <path d="M5 25 Q30 -5 55 25 Q50 30 30 30 Q10 30 5 25" fill="currentColor" opacity="0.8" />
      <line x1="15" y1="28" x2="28" y2="55" stroke="currentColor" strokeWidth="1" />
      <line x1="30" y1="30" x2="30" y2="55" stroke="currentColor" strokeWidth="1" />
      <line x1="45" y1="28" x2="32" y2="55" stroke="currentColor" strokeWidth="1" />
      <circle cx="30" cy="58" r="4" />
      <line x1="30" y1="62" x2="30" y2="68" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
