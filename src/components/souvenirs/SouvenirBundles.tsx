import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Gift, ShoppingBag, Sparkles, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Souvenir } from "@/hooks/useSouvenirs";

const WHATSAPP_NUMBER = "85269391570";

interface BundleLine {
  item: Souvenir;
  qty: number;
  variant?: string; // optional size / variant label for T-shirt etc.
}

interface Bundle {
  id: "beginner" | "friends";
  icon: typeof Gift;
  titleKey: string;
  descKey: string;
  chipKey: string;
  /** Extra multiplicative discount applied on top of item bulk pricing. 0.9 = 10% off. */
  extraDiscount: number;
  build: (items: Souvenir[]) => BundleLine[];
}

function tierUnitPrice(item: Souvenir, qty: number): number {
  if (!item.bulk_pricing || item.bulk_pricing.length === 0) return item.price;
  const tiers = [...item.bulk_pricing].sort((a, b) => a.qty - b.qty);
  let unit = item.price;
  for (const t of tiers) if (qty >= t.qty) unit = t.sale_price / t.qty;
  return unit;
}

const BUNDLES: Bundle[] = [
  {
    id: "beginner",
    icon: Gift,
    titleKey: "souvenirs.bundles.beginner.title",
    descKey: "souvenirs.bundles.beginner.desc",
    chipKey: "souvenirs.bundles.beginner.chip",
    extraDiscount: 0.9,
    build: (items) => {
      const magnet = items.find((i) => i.customisation_required);
      const tshirt = items.find((i) => !i.customisation_required && i.sizes.length > 0);
      const lines: BundleLine[] = [];
      if (magnet) lines.push({ item: magnet, qty: 1 });
      if (tshirt) {
        const mid = tshirt.sizes[Math.floor(tshirt.sizes.length / 2)];
        lines.push({ item: tshirt, qty: 1, variant: mid?.size_label });
      }
      return lines;
    },
  },
  {
    id: "friends",
    icon: Users,
    titleKey: "souvenirs.bundles.friends.title",
    descKey: "souvenirs.bundles.friends.desc",
    chipKey: "souvenirs.bundles.friends.chip",
    extraDiscount: 0.9,
    build: (items) => {
      const magnet = items.find((i) => i.customisation_required);
      return magnet ? [{ item: magnet, qty: 5 }] : [];
    },
  },
];

function getName(item: Souvenir, lang: string) {
  if (lang === "zh-TW") return item.name_zh_tw || item.name_en;
  if (lang === "zh-CN") return item.name_zh_cn || item.name_en;
  return item.name_en;
}

export function SouvenirBundles({ items }: { items: Souvenir[] }) {
  const { t, language } = useLanguage();

  const cards = useMemo(() => {
    return BUNDLES.map((b) => {
      const lines = b.build(items);
      const originalTotal = lines.reduce((s, l) => s + l.item.price * l.qty, 0);
      const tierTotal = lines.reduce((s, l) => s + Math.round(tierUnitPrice(l.item, l.qty) * l.qty), 0);
      const bundlePrice = Math.round(tierTotal * b.extraDiscount);
      const save = Math.max(0, originalTotal - bundlePrice);
      const pct = originalTotal > 0 ? Math.round((save / originalTotal) * 100) : 0;
      return { bundle: b, lines, originalTotal, bundlePrice, save, pct };
    }).filter((c) => c.lines.length > 0 && c.bundlePrice > 0);
  }, [items]);

  if (cards.length === 0) return null;

  const handleBuy = (
    bundleTitle: string,
    lines: BundleLine[],
    bundlePrice: number,
    save: number
  ) => {
    const lineText = lines
      .map((l) => {
        const name = getName(l.item, language);
        const variant = l.variant ? ` (${l.variant})` : "";
        return `• ${name}${variant} × ${l.qty}`;
      })
      .join("\n");
    const template = t("souvenirs.bundles.whatsappMsg")
      .replace("{title}", bundleTitle)
      .replace("{lines}", lineText)
      .replace("{price}", String(bundlePrice))
      .replace("{save}", String(save));
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(template)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          {t("souvenirs.bundles.badge")}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t("souvenirs.bundles.sectionTitle")}
        </h2>
        <p className="text-foreground/70 text-sm">{t("souvenirs.bundles.sectionSubtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {cards.map(({ bundle, lines, originalTotal, bundlePrice, save, pct }) => {
          const Icon = bundle.icon;
          const title = t(bundle.titleKey);
          return (
            <Card
              key={bundle.id}
              className="p-5 sm:p-6 flex flex-col border-2 border-transparent hover:border-accent-orange/40 transition-colors relative overflow-hidden"
            >
              {save > 0 && (
                <span className="absolute top-3 right-3 inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-600 text-white text-xs font-bold">
                  -{pct}%
                </span>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-accent-orange/10 text-accent-orange flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
              </div>
              <p className="text-sm text-foreground/70 mb-3">{t(bundle.descKey)}</p>
              <span className="inline-flex w-fit items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 text-[11px] font-semibold mb-4">
                {t(bundle.chipKey)}
              </span>

              <ul className="space-y-1.5 text-sm text-foreground/80 mb-4">
                {lines.map((l, idx) => (
                  <li key={idx} className="flex items-center justify-between gap-2">
                    <span className="truncate">
                      {getName(l.item, language)}
                      {l.variant && (
                        <span className="text-foreground/50"> ({l.variant})</span>
                      )}
                    </span>
                    <span className="text-foreground/60 shrink-0">× {l.qty}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex items-end justify-between gap-3 pt-3 border-t border-border">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-accent-orange">HK${bundlePrice}</span>
                    {save > 0 && (
                      <span className="text-sm text-foreground/50 line-through">HK${originalTotal}</span>
                    )}
                  </div>
                  {save > 0 && (
                    <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                      {t("souvenirs.bundles.save").replace("{save}", String(save))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleBuy(title, lines, bundlePrice, save)}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors text-sm whitespace-nowrap"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {t("souvenirs.bundles.buyCta")}
                </button>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
