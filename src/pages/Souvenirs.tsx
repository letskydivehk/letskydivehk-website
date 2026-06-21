import { SEO } from "@/components/SEO";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Ruler } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const WHATSAPP_NUMBER = "85269391570";

const SIZES = ["S", "M", "L", "XL", "2XL"] as const;
type Size = (typeof SIZES)[number];

// Fill these in later — height in cm, weight in kg.
const SIZE_CHART: Record<Size, { height: string; weight: string }> = {
  S: { height: "—", weight: "—" },
  M: { height: "—", weight: "—" },
  L: { height: "—", weight: "—" },
  XL: { height: "—", weight: "—" },
  "2XL": { height: "—", weight: "—" },
};

export default function Souvenirs() {
  const { t } = useLanguage();
  const [size, setSize] = useState<Size>("M");

  const handleOrder = () => {
    const msg = t("souvenirs.whatsappMsg").replace("{size}", size);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

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
            {t("common.backHome")}
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
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-3">
              {t("souvenirs.title")}
            </h1>
            <p className="text-foreground/70 text-lg max-w-xl mx-auto">
              {t("souvenirs.subtitle")}
            </p>
          </motion.div>

          {/* Product Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="overflow-hidden p-0 mb-10">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="aspect-square bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                  <img
                    src="/placeholder.svg"
                    alt={t("souvenirs.tshirt.name")}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8 flex flex-col">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    {t("souvenirs.tshirt.name")}
                  </h2>
                  <p className="text-foreground/70 mb-4">{t("souvenirs.tshirt.desc")}</p>
                  <div className="text-3xl font-bold text-accent-orange mb-6">
                    HK$150
                  </div>

                  <div className="mb-6">
                    <div className="text-sm font-semibold text-foreground mb-2">
                      {t("souvenirs.selectSize")}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`min-w-[3rem] px-4 py-2 rounded-lg border-2 font-semibold transition-all ${
                            size === s
                              ? "border-accent-orange bg-accent-orange text-white"
                              : "border-border bg-background text-foreground hover:border-accent-orange/50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

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
          </motion.div>

          {/* Size Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <Ruler className="w-5 h-5 text-accent-orange" />
                <h2 className="text-2xl font-bold text-foreground">
                  {t("souvenirs.sizeChart")}
                </h2>
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
                  {SIZES.map((s) => (
                    <TableRow key={s}>
                      <TableCell className="font-semibold">{s}</TableCell>
                      <TableCell>{SIZE_CHART[s].height}</TableCell>
                      <TableCell>{SIZE_CHART[s].weight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <p className="text-sm text-foreground/60 mt-4">{t("souvenirs.sizeNote")}</p>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
