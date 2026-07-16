"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
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

// Rewards FAQ appended after the primary list. Trilingual inline.
const rewardsFaq = {
  "zh-TW": [
    { q: "積分會過期嗎？", a: "會的。每筆賺取的積分自到期日起 12 個月有效，逾期自動歸零。我們會在到期前 30 天發送電郵提醒你把握使用。" },
    { q: "積分可以用來支付訂金嗎？", a: "不可以。訂金必須以現金支付以確保您的行程預訂；但積分可用於尾款、加購攝影／紀念品／聚會門票等。" },
    { q: "磁石貼可以補領嗎？", a: "磁石貼在每次達成里程碑（第 1／3／5／10 跳）當日由工作人員親手交付。若當日未領取，請聯絡我們，我們會安排下次跳傘時補發。" },
    { q: "錯過了某階段還能拿到嗎？", a: "可以。系統會依你的累積跳數自動記錄；例如你目前跳了 6 次，代表銀（1）、金（3）、白金（5）三枚磁石貼皆已解鎖，可在下一次到訪時一併領取。" },
  ],
  "zh-CN": [
    { q: "积分会过期吗？", a: "会的。每笔赚取的积分自到期日起 12 个月有效，逾期自动归零。我们会在到期前 30 天发送电邮提醒你把握使用。" },
    { q: "积分可以用来支付订金吗？", a: "不可以。订金必须以现金支付以确保您的行程预订；但积分可用于尾款、加购摄影／纪念品／聚会门票等。" },
    { q: "磁石贴可以补领吗？", a: "磁石贴在每次达成里程碑（第 1／3／5／10 跳）当日由工作人员亲手交付。若当日未领取，请联络我们，我们会安排下次跳伞时补发。" },
    { q: "错过了某阶段还能拿到吗？", a: "可以。系统会依你的累积跳数自动记录；例如你目前跳了 6 次，代表银（1）、金（3）、白金（5）三枚磁石贴皆已解锁，可在下一次到访时一并领取。" },
  ],
  en: [
    { q: "Do points expire?", a: "Yes. Points expire 12 months after they are earned. We email you 30 days before they lapse so you have time to redeem them." },
    { q: "Can I use points for the booking deposit?", a: "No — the deposit secures your reservation and must be paid in cash. Points can be applied to the final balance and add-ons (photos, souvenirs, gathering tickets)." },
    { q: "Can I claim a missed magnet?", a: "Magnets are handed out in person on the day of each milestone jump. If you did not receive one, contact us and we will hand it over on your next visit." },
    { q: "What if I skip a milestone stage?", a: "Nothing lost — your progress is tracked by total jumps. E.g. after 6 jumps you have already unlocked Silver (1), Gold (3) and Platinum (5); we can hand all three magnets over on your next visit." },
  ],
} as const;


export function FAQ() {
  const { t, language } = useLanguage();
  const rewards = rewardsFaq[language as keyof typeof rewardsFaq] ?? rewardsFaq.en;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      ...faqItems.map((item) => ({
        "@type": "Question",
        name: t(item.questionKey),
        acceptedAnswer: { "@type": "Answer", text: t(item.answerKey) },
      })),
      ...rewards.map((r) => ({
        "@type": "Question",
        name: r.q,
        acceptedAnswer: { "@type": "Answer", text: r.a },
      })),
    ],
  };


  return (
    <section id="faq" className="relative py-24 bg-background overflow-hidden">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
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
              {rewards.map((item, index) => (
                <AccordionItem
                  key={`reward-${index}`}
                  value={`reward-${index}`}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-accent-orange transition-colors py-5 text-base sm:text-lg font-medium hover:no-underline">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-accent-orange shrink-0 mt-0.5" />
                      <span>{item.q}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pl-8 pr-4 pb-5">
                    {item.a}
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
