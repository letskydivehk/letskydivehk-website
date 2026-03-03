import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CountdownTimerProps {
  targetDate: Date;
  compact?: boolean;
}

export function CountdownTimer({ targetDate, compact = false }: CountdownTimerProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.total <= 0) return null;

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-orange">
        <Clock className="w-3 h-3" />
        {timeLeft.days > 0
          ? t("countdown.daysLeft").replace("{days}", String(timeLeft.days))
          : `${pad(timeLeft.hours)}:${pad(timeLeft.minutes)}:${pad(timeLeft.seconds)}`}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-accent-orange/10 rounded-lg px-4 py-2.5">
      <Clock className="w-4 h-4 text-accent-orange flex-shrink-0" />
      <div className="flex items-center gap-2 text-sm font-semibold text-accent-orange">
        <span>{t("countdown.endsIn")}</span>
        <div className="flex gap-1 font-mono">
          {timeLeft.days > 0 && (
            <span className="bg-accent-orange/20 px-2 py-0.5 rounded text-xs">
              {timeLeft.days}{t("countdown.d")}
            </span>
          )}
          <span className="bg-accent-orange/20 px-2 py-0.5 rounded text-xs">
            {pad(timeLeft.hours)}{t("countdown.h")}
          </span>
          <span className="bg-accent-orange/20 px-2 py-0.5 rounded text-xs">
            {pad(timeLeft.minutes)}{t("countdown.m")}
          </span>
          <span className="bg-accent-orange/20 px-2 py-0.5 rounded text-xs">
            {pad(timeLeft.seconds)}{t("countdown.s")}
          </span>
        </div>
      </div>
    </div>
  );
}

function getTimeLeft(target: Date) {
  const total = target.getTime() - Date.now();
  return {
    total,
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}
