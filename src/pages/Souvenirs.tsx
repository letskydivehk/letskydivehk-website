import { SEO } from "@/components/SEO";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSouvenirs, type Souvenir } from "@/hooks/useSouvenirs";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Ruler, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const WHATSAPP_NUMBER = "85269391570";

function getName(item: Souvenir, lang: string) {
  if (lang === "zh-TW") return item.name_zh_tw || item.name_en;
  if (lang === "zh-CN") return item.name_zh_cn || item.name_en;
  return item.name_en;
}
function getDesc(item: Souvenir, lang: string) {
  if (lang === "zh-TW") return item.description_zh_tw || item.description_en;
  if (lang === "zh-CN") return item.description_zh_cn || item.description_en;
  return item.description_en;
}

function ProductCard({ item }: { item: Souvenir }) {
  const { t, language } = useLanguage();
  const sizes = item.sizes.length > 0 ? item.sizes : [];
  const [selectedSize, setSelectedSize] = useState<string>(sizes[1]?.size_label || sizes[0]?.size_label || "");
  const name = getName(item, language);
  const desc = getDesc(item, language);

  const handleOrder = () => {
    const msg = t("souvenirs.whatsappMsg")
      .replace("{size}", selectedSize)
      .replace("Let's Skydive HK T-Shirt", name)
      .replace("Let's Skydive HK T恤", name);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <Card className="overflow-hidden p-0 mb-10">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="aspect-square bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
          <img
            src={item.image_url || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 sm:p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-foreground mb-2">{name}</h2>
          <p className="text-foreground/70 mb-4">{desc}</p>
          <div className="text-3xl font-bold text-accent-orange mb-6">HK${item.price}</div>

          {sizes.length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-foreground mb-2">{t("souvenirs.selectSize")}</div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.size_label)}
                    className={`min-w-[3rem] px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                      selectedSize === s.size_label
                        ? "border-accent-orange bg-accent-orange text-white"
                        : "border-border bg-background text-foreground hover:border-accent-orange/50"
                    }`}
                  >
                    {s.size_label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleOrder}
            className="mt-auto inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {t("souvenirs.orderWhatsapp")}
          </button>
        </div>
      </div>
    </Card>
  );
}

function SizeChartCard({ item }: { item: Souvenir }) {
  const { t } = useLanguage();
  if (item.sizes.length === 0) return null;
  return (
    <Card className="p-6 sm:p-8 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Ruler className="w-5 h-5 text-accent-orange" />
        <h2 className="text-2xl font-bold text-foreground">{t("souvenirs.sizeChart")}</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold">{t("souvenirs.size")}</TableHead>
            <TableHead className="font-bold">{t("souvenirs.height")}</TableHead>
            <TableHead className="font-bold">{t("souvenirs.weight")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {item.sizes.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-semibold">{s.size_label}</TableCell>
              <TableCell>{s.height_range || "—"}</TableCell>
              <TableCell>{s.weight_range || "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 p-3 rounded-lg bg-accent-orange/10 border border-accent-orange/30 text-sm text-foreground/80">
        {t("souvenirs.sizeTipBigger")}
      </div>
      <p className="text-sm text-foreground/60 mt-3">{t("souvenirs.sizeNote")}</p>
    </Card>
  );
}

export default function Souvenirs() {
  const { t } = useLanguage();
  const { items, isLoading } = useSouvenirs();

  return (
    <>
      <SEO title={t("souvenirs.seoTitle")} description={t("souvenirs.seoDesc")} />
      <PageNavbar />
      <BackgroundDecorations />

      <main className="relative pt-28 pb-20 min-h-screen">
        <div className="container mx-auto px-6 sm:px-8 lg:px-12 max-w-5xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/70 hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("promo.backToHome")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-orange/10 text-accent-orange text-sm font-semibold mb-4">
              <ShoppingBag className="w-4 h-4" />
              {t("souvenirs.badge")}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">{t("souvenirs.title")}</h1>
            <p className="text-foreground/70 text-lg max-w-xl mx-auto">{t("souvenirs.subtitle")}</p>
          </motion.div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-foreground/60 py-20">Coming soon.</p>
          ) : (
            items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <ProductCard item={item} />
                <SizeChartCard item={item} />
              </motion.div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
