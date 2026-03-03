import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const names = {
  en: [
    "Sarah from Hong Kong", "Alex from Singapore", "Mika from Tokyo",
    "David from Taipei", "Jessica from Melbourne", "Kevin from London",
    "Rachel from New York", "Tom from Vancouver", "Amy from Seoul",
    "Chris from Bangkok",
  ],
  "zh-TW": [
    "來自香港的 Sarah", "來自新加坡的 Alex", "來自東京的 Mika",
    "來自台北的 David", "來自墨爾本的 Jessica", "來自倫敦的 Kevin",
    "來自紐約的 Rachel", "來自溫哥華的 Tom", "來自首爾的 Amy",
    "來自曼谷的 Chris",
  ],
  "zh-CN": [
    "来自香港的 Sarah", "来自新加坡的 Alex", "来自东京的 Mika",
    "来自台北的 David", "来自墨尔本的 Jessica", "来自伦敦的 Kevin",
    "来自纽约的 Rachel", "来自温哥华的 Tom", "来自首尔的 Amy",
    "来自曼谷的 Chris",
  ],
};

export function SocialProofTicker() {
  const { t, language } = useLanguage();
  const [index, setIndex] = useState(0);
  const [messageType, setMessageType] = useState(0);

  const getMessage = useCallback(() => {
    const nameList = names[language] || names.en;
    const name = nameList[index % nameList.length];
    const hours = Math.floor(Math.random() * 3) + 1;

    const templates = [
      t("social.booked").replace("{name}", name),
      t("social.recentCount").replace("{count}", String(Math.floor(Math.random() * 15) + 8)),
      t("social.slotsLeft").replace("{count}", String(Math.floor(Math.random() * 4) + 2)),
    ];

    return templates[messageType % templates.length];
  }, [index, messageType, t, language]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => i + 1);
      setMessageType((m) => m + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-accent-orange/5 border-y border-accent-orange/10 py-3 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-3">
        <Users className="w-4 h-4 text-accent-orange flex-shrink-0" />
        <AnimatePresence mode="wait">
          <motion.span
            key={`${index}-${messageType}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="text-sm font-medium text-foreground/80"
          >
            {getMessage()}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
