import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface Step {
  icon: string
  title: string
  description: string
}

interface HowItWorksProps {
  steps: Step[]
}

export function HowItWorks({ steps }: HowItWorksProps) {
  const { t } = useLanguage()

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">
              {t('servicePage.howItWorks')}
            </span>
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            {t('servicePage.howItWorksTitle')}
          </h2>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5 hidden sm:block" />

          {steps.map((step, index) => {
            const isLeft = index % 2 === 0
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-start mb-12 last:mb-0 ${
                  isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col sm:flex-row`}
              >
                {/* Content */}
                <div className={`flex-1 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12'} pl-16 sm:pl-16 md:pl-0`}>
                  <div className="bg-card rounded-2xl p-6 clean-border mobile-transparent-card subtle-shadow">
                    <span className="text-3xl mb-3 block">{step.icon}</span>
                    <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>

                {/* Circle indicator */}
                <div className="absolute left-3 sm:left-3 md:left-1/2 md:-translate-x-1/2 w-7 h-7 bg-accent-orange rounded-full flex items-center justify-center text-white text-xs font-bold z-10 border-4 border-background">
                  {index + 1}
                </div>

                {/* Spacer for the other side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
