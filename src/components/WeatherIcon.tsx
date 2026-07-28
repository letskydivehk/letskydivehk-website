import { motion } from "framer-motion";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSnow, Moon, Sun } from "lucide-react";

interface WeatherIconProps {
  code: number;
  isDay?: boolean;
  className?: string;
  size?: number;
}

export function WeatherIcon({ code, isDay = true, className = "", size = 48 }: WeatherIconProps) {
  const base = "text-accent-blue";
  const sunColor = "text-accent-orange";
  const rainColor = "text-accent-blue";
  const snowColor = "text-sky-300";
  const stormColor = "text-violet-500";

  // Clear sky
  if (code === 0 || code === 1) {
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        {isDay ? (
          <Sun className={`w-full h-full ${sunColor}`} strokeWidth={1.5} />
        ) : (
          <Moon className={`w-full h-full ${base}`} strokeWidth={1.5} />
        )}
      </motion.div>
    );
  }

  // Partly cloudy
  if (code === 2) {
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <motion.div
          className="absolute"
          animate={{ x: [0, 3, 0], opacity: [1, 0.85, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sun className={`w-[70%] h-[70%] ${sunColor}`} strokeWidth={1.5} />
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0"
          animate={{ x: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Cloud className={`w-[60%] h-[60%] ${base}`} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Overcast
  if (code === 3) {
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud className={`w-full h-full ${base}`} strokeWidth={1.5} />
      </motion.div>
    );
  }

  // Fog
  if (code === 45 || code === 48) {
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudFog className={`w-full h-full ${base}`} strokeWidth={1.5} />
      </motion.div>
    );
  }

  // Drizzle / Rain
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    const heavy = code >= 63 || code >= 81;
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <motion.div
          animate={{ x: [0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <CloudRain className={`w-full h-full ${heavy ? stormColor : rainColor}`} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <CloudSnow className={`w-full h-full ${snowColor}`} strokeWidth={1.5} />
      </motion.div>
    );
  }

  // Thunderstorm
  if (code >= 95) {
    return (
      <motion.div
        className={`relative inline-flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <motion.div
          animate={{ opacity: [1, 0.4, 1, 0.6, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <CloudLightning className={`w-full h-full ${stormColor}`} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    );
  }

  // Fallback
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Cloud className={`w-full h-full ${base}`} strokeWidth={1.5} />
    </motion.div>
  );
}
