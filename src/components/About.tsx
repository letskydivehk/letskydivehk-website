"use client";

import { motion } from "framer-motion";
import { Shield, Award, Users, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { StatsSection } from "./StatsSection";

export function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Shield,
      titleKey: "about.values.safetyFirst.title",
      descKey: "about.values.safetyFirst.desc",
    },
    {
      icon: Award,
      titleKey: "about.values.expertInstructors.title",
      descKey: "about.values.expertInstructors.desc",
    },
    {
      icon: Users,
      titleKey: "about.values.personalizedExperience.title",
      descKey: "about.values.personalizedExperience.desc",
    },
    {
      icon: Heart,
      titleKey: "about.values.passionDriven.title",
      descKey: "about.values.passionDriven.desc",
    },
  ];

  return (
    <section id="about" className="relative py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground">{t('about.badge')}</span>
            <div className="w-3 h-3 bg-accent-orange rounded-full animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground sm:whitespace-nowrap">
            {t('about.title')}
          </h2>

          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Animated Stats */}
        <StatsSection />

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.titleKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="group relative bg-card rounded-2xl p-8 clean-border transition-all duration-300 mobile-transparent-card hover:elevated-shadow overflow-hidden"
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-orange/0 to-accent-blue/0 group-hover:from-accent-orange/5 group-hover:to-accent-blue/5 transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-accent-orange/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent-orange group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-7 h-7 text-accent-orange group-hover:text-white transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t(value.titleKey)}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t(value.descKey)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Story Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-accent-orange/5 to-accent-blue/5 rounded-3xl p-8 lg:p-12 clean-border mobile-transparent-card">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-6 text-center">{t('about.story.title')}</h3>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-4">
                {t('about.story.paragraph1')}
              </p>
              <p>
                {t('about.story.paragraph2')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
