"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Reordered to surface fear/safety/eligibility first.
const faqItems = [
  { questionKey: "faq.q7", answerKey: "faq.a7" },
  { questionKey: "faq.q3", answerKey: "faq.a3" },
  { questionKey: "faq.q1", answerKey: "faq.a1" },
  { questionKey: "faq.q2", answerKey: "faq.a2" },
  { questionKey: "faq.q9", answerKey: "faq.a9" },
  { questionKey: "faq.q6", answerKey: "faq.a6" },
  { questionKey: "faq.q8", answerKey: "faq.a8" },
  { questionKey: "faq.q4", answerKey: "faq.a4" },
  { questionKey: "faq.q5", answerKey: "faq.a5" },
  { questionKey: "faq.q10", answerKey: "faq.a10" },
];

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section id="faq" className="relative py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 mb-6"
          >
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">{t('faq.badge')}</span>
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground"
          >
            {t('faq.title')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
          >
            {t('faq.subtitle')}
          </motion.p>
        </div>

        {/* FAQ Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-3xl p-6 sm:p-8 lg:p-10 clean-border mobile-transparent-card">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-accent-orange transition-colors py-5 text-base sm:text-lg font-medium hover:no-underline">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                      <span>{t(item.questionKey)}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8 pr-4 pb-5">
                    {t(item.answerKey)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-10 text-center"
          >
            <p className="text-muted-foreground mb-4">{t('faq.moreQuestions')}</p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-accent-orange hover:bg-accent-orange/90 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              {t('faq.contactUs')}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
