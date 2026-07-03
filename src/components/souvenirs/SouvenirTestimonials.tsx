import { Card } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import magnetFridgeMosaic from "@/assets/magnet-fridge-mosaic.jpg";

export function SouvenirTestimonials() {
  const { t } = useLanguage();

  const items = [
    { key: "q1", name: t("souvenirs.testimonials.n1"), quote: t("souvenirs.testimonials.q1") },
    { key: "q2", name: t("souvenirs.testimonials.n2"), quote: t("souvenirs.testimonials.q2") },
    { key: "q3", name: t("souvenirs.testimonials.n3"), quote: t("souvenirs.testimonials.q3") },
  ];

  return (
    <section className="mt-12 mb-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t("souvenirs.testimonials.title")}
        </h2>
        <p className="text-foreground/70">{t("souvenirs.testimonials.subtitle")}</p>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {items.map((it) => (
          <Card key={it.key} className="p-5 flex flex-col">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-sky-100 mb-4">
              <img
                src={magnetFridgeMosaic}
                alt={it.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-0.5 mb-2 text-accent-orange">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <Quote className="w-5 h-5 text-accent-orange/50 mb-2" />
            <p className="text-sm text-foreground/80 flex-1">{it.quote}</p>
            <div className="mt-3 text-xs font-semibold text-foreground/60">— {it.name}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}
