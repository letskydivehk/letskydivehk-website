import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useLanguage } from '@/contexts/LanguageContext'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  questionKey: string
  answerKey: string
}

interface ServiceFAQProps {
  items: FAQItem[]
}

export function ServiceFAQ({ items }: ServiceFAQProps) {
  const { t } = useLanguage()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: t(item.questionKey),
      acceptedAnswer: {
        '@type': 'Answer',
        text: t(item.answerKey),
      },
    })),
  }

  return (
    <section className="py-24 bg-background">
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('servicePage.faqBadge')}
            </span>
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            {t('servicePage.faqTitle')}
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <div className="bg-card rounded-3xl p-6 sm:p-8 clean-border mobile-transparent-card">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {items.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border/50 last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-foreground hover:text-accent-orange transition-colors py-5 text-base font-medium hover:no-underline">
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
        </motion.div>
      </div>
    </section>
  )
}
