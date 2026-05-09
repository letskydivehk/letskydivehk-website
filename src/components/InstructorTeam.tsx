import { motion } from "framer-motion";
import { Award, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const instructors = [
  {
    name: "Marcus",
    roleKey: "instructors.role.tandem",
    image:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=600&h=600&fit=crop",
  },
  {
    name: "Linda",
    roleKey: "instructors.role.alicence",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop",
  },
  {
    name: "Kevin",
    roleKey: "instructors.role.videographer",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&h=600&fit=crop",
  },
];

export function InstructorTeam() {
  const { t } = useLanguage();
  return (
    <section id="instructors" className="relative py-20 sm:py-24 bg-background">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block bg-accent-blue/10 text-accent-blue text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
            {t("instructors.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
            {t("instructors.title")}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {t("instructors.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {instructors.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-card border border-border rounded-3xl overflow-hidden mobile-transparent-card"
            >
              <div className="aspect-square overflow-hidden bg-muted">
                <img
                  src={person.image}
                  alt={person.name}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl text-foreground">{person.name}</h3>
                <p className="text-accent-orange text-sm font-semibold mb-3">
                  {t(person.roleKey)}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Award className="w-3.5 h-3.5" /> {t("instructors.cert")}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Globe className="w-3.5 h-3.5" /> {t("instructors.langs")}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
