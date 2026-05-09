import { motion } from "framer-motion";
import { MapPin, ClipboardCheck, Backpack, Plane, Wind, ParkingCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function JumpDayTimeline() {
  const { t } = useLanguage();
  const steps = [
    { icon: MapPin, title: "timeline.step1.title", body: "timeline.step1.body" },
    { icon: ClipboardCheck, title: "timeline.step2.title", body: "timeline.step2.body" },
    { icon: Backpack, title: "timeline.step3.title", body: "timeline.step3.body" },
    { icon: Plane, title: "timeline.step4.title", body: "timeline.step4.body" },
    { icon: Wind, title: "timeline.step5.title", body: "timeline.step5.body" },
    { icon: ParkingCircle, title: "timeline.step6.title", body: "timeline.step6.body" },
  ];

  return (
    <section id="jump-day" className="relative py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-accent-blue/10 text-accent-blue text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {t("timeline.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
            {t("timeline.title")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("timeline.subtitle")}
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-[19px] sm:left-1/2 top-0 bottom-0 w-0.5 bg-accent-orange/30 sm:-translate-x-1/2" />
          <div className="space-y-8">
            {steps.map(({ icon: Icon, title, body }, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`relative flex sm:items-center sm:justify-${isLeft ? "start" : "end"} pl-12 sm:pl-0`}
                >
                  <div
                    className={`absolute left-0 sm:left-1/2 sm:-translate-x-1/2 w-10 h-10 rounded-full bg-accent-orange text-white flex items-center justify-center shadow-lg z-10`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div
                    className={`bg-card border border-border rounded-2xl p-5 w-full sm:w-[44%] mobile-transparent-card ${
                      isLeft ? "sm:mr-auto sm:pr-6 sm:text-right" : "sm:ml-auto sm:pl-6"
                    }`}
                  >
                    <div className="text-xs font-bold uppercase tracking-wider text-accent-orange mb-1">
                      Step {i + 1}
                    </div>
                    <h3 className="font-bold text-lg mb-1 text-foreground">{t(title)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{t(body)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
