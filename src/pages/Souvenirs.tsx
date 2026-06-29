import { SEO } from "@/components/SEO";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSouvenirs, type Souvenir, type SouvenirVariant } from "@/hooks/useSouvenirs";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingBag, Ruler, Loader2, Upload, Check, Sparkles, BadgePercent, Minus, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import magnetFridgeMosaic from "@/assets/magnet-fridge-mosaic.jpg";

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
function getVendorNote(item: Souvenir, lang: string) {
  if (lang === "zh-TW") return item.vendor_note_zh_tw || item.vendor_note_en;
  if (lang === "zh-CN") return item.vendor_note_zh_cn || item.vendor_note_en;
  return item.vendor_note_en;
}
function getVariantName(v: SouvenirVariant, lang: string) {
  if (lang === "zh-TW") return v.name_zh_tw || v.name_en;
  if (lang === "zh-CN") return v.name_zh_cn || v.name_en;
  return v.name_en;
}
function pickTierPrice(item: Souvenir, qty: number): number {
  if (!item.bulk_pricing || item.bulk_pricing.length === 0) return item.price * qty;
  const tiers = [...item.bulk_pricing].sort((a, b) => a.qty - b.qty);
  let unit = item.price;
  for (const t of tiers) {
    if (qty >= t.qty) unit = t.sale_price / t.qty;
  }
  return Math.round(unit * qty);
}

function BulkPricingTable({ item }: { item: Souvenir }) {
  const { t } = useLanguage();
  if (!item.bulk_pricing || item.bulk_pricing.length === 0) return null;
  const tiers = [...item.bulk_pricing].sort((a, b) => a.qty - b.qty);
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
        <Sparkles className="w-4 h-4 text-accent-orange" />
        {t("souvenirs.bulkPricing")}
      </div>
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead className="h-9 text-[11px] px-2">{t("souvenirs.qty")}</TableHead>
              <TableHead className="h-9 text-[11px] px-2">{t("souvenirs.originalPrice")}</TableHead>
              <TableHead className="h-9 text-[11px] px-2">{t("souvenirs.salePrice")}</TableHead>
              <TableHead className="h-9 text-[11px] text-right px-2">{t("souvenirs.savePrefix")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tiers.map((tier) => {
              const save = tier.original_price - tier.sale_price;
              const pct = tier.original_price > 0 ? Math.round((save / tier.original_price) * 100) : 0;
              const isDiscount = save > 0;
              return (
                <TableRow key={tier.qty}>
                  <TableCell className="font-semibold py-1.5 px-2 text-[11px]">
                    {tier.qty === 1
                      ? `1 ${t("souvenirs.each")}`
                      : `${tier.qty}-${t("souvenirs.pack")}`}
                  </TableCell>
                  <TableCell className="py-1.5 px-2 text-[11px]">
                    {isDiscount ? (
                      <span className="line-through text-foreground/50">HK${tier.original_price}</span>
                    ) : (
                      <span className="text-foreground/50">—</span>
                    )}
                  </TableCell>
                  <TableCell className="py-1.5 px-2 text-[11px] font-bold text-accent-orange">
                    HK${tier.sale_price}
                  </TableCell>
                  <TableCell className="py-1.5 px-2 text-right text-[11px]">
                    {isDiscount ? (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
                        -{pct}%
                      </span>
                    ) : (
                      <span className="text-foreground/40">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 999,
}: {
  value: number;
  onChange: (n: number) => void;
  label?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {label && <span className="text-sm font-semibold text-foreground">{label}</span>}
      <div className="inline-flex items-center rounded-lg border border-border overflow-hidden">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="px-3 py-2 hover:bg-muted text-foreground/80 disabled:opacity-40"
          disabled={value <= min}
          aria-label="decrease"
        >
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const n = parseInt(e.target.value);
            if (Number.isFinite(n)) onChange(Math.min(max, Math.max(min, n)));
          }}
          className="w-14 text-center font-semibold bg-background focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="px-3 py-2 hover:bg-muted text-foreground/80 disabled:opacity-40"
          disabled={value >= max}
          aria-label="increase"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function EditionMagnetCard({ item }: { item: Souvenir }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [qtys, setQtys] = useState<Record<string, number>>({});

  const activeVariants = useMemo(
    () => item.variants.filter((v) => v.is_active).sort((a, b) => a.display_order - b.display_order),
    [item.variants]
  );

  const totalQty = useMemo(
    () => Object.values(qtys).reduce((s, n) => s + (n > 0 ? n : 0), 0),
    [qtys]
  );
  const totalPrice = useMemo(() => pickTierPrice(item, totalQty), [item, totalQty]);

  const setQty = (id: string, n: number) => {
    setQtys((prev) => {
      const next = { ...prev };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  };

  const handleOrder = () => {
    if (totalQty <= 0) {
      toast.error(t("souvenirs.selectAtLeastOne"));
      return;
    }
    const lines = activeVariants
      .filter((v) => (qtys[v.id] || 0) > 0)
      .map((v) => `- ${getVariantName(v, language)} × ${qtys[v.id]}`)
      .join("\n");
    const template = user
      ? t("souvenirs.editionWhatsappMsgMember")
      : t("souvenirs.editionWhatsappMsg");
    const msg = template
      .replace("{lines}", lines)
      .replace("{totalQty}", String(totalQty))
      .replace("{totalPrice}", String(totalPrice));
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <Card className="overflow-hidden p-4 sm:p-8 mb-10">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold text-foreground mr-2">{t("souvenirs.editionTitle")}</h2>
        <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
          <Ruler className="w-3 h-3" />
          {t("souvenirs.magnetSize")}
        </span>
      </div>
      <p className="text-foreground/70 mb-4">{t("souvenirs.editionDesc")}</p>

      <div
        className={`flex items-start gap-2 mb-6 px-3 py-2 rounded-lg border text-sm ${
          user
            ? "border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border-amber-200 bg-amber-50 text-amber-800"
        }`}
      >
        <BadgePercent className="w-4 h-4 mt-0.5 shrink-0" />
        {user ? (
          <span>{t("souvenirs.memberDiscountApplied")}</span>
        ) : (
          <span>
            {t("souvenirs.memberDiscountGuest")}{" "}
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="font-semibold underline underline-offset-2 hover:text-amber-900"
            >
              {t("souvenirs.signInCta")}
            </button>
          </span>
        )}
      </div>

      <BulkPricingTable item={item} />

      <div className="text-sm font-semibold text-foreground mb-3">
        {t("souvenirs.selectDesigns")}
      </div>

      {activeVariants.length === 0 ? (
        <p className="text-sm text-foreground/60 py-6 text-center">{t("souvenirs.noVariants")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          {activeVariants.map((v) => {
            const qty = qtys[v.id] || 0;
            const selected = qty > 0;
            return (
              <div
                key={v.id}
                className={`rounded-xl border-2 overflow-hidden transition-all ${
                  selected ? "border-accent-orange shadow-md" : "border-border"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setQty(v.id, selected ? 0 : 1)}
                  className="block w-full aspect-square bg-sky-100 overflow-hidden"
                >
                  {v.image_url ? (
                    <img
                      src={v.image_url}
                      alt={getVariantName(v, language)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-foreground/50">
                      —
                    </div>
                  )}
                </button>
                <div className="p-2 sm:p-3">
                  <div className="text-xs sm:text-sm font-semibold text-foreground truncate mb-2">
                    {getVariantName(v, language)}
                  </div>
                  <QuantityStepper
                    value={Math.max(1, qty)}
                    onChange={(n) => setQty(v.id, selected ? n : Math.max(1, n))}
                    min={selected ? 1 : 0}
                  />
                  {!selected && (
                    <button
                      type="button"
                      onClick={() => setQty(v.id, 1)}
                      className="w-full text-[11px] text-accent-orange font-semibold py-1 rounded border border-accent-orange/40 hover:bg-accent-orange/10"
                    >
                      + Select
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mb-4 text-sm text-foreground/80">
        {t("souvenirs.totalLine")
          .replace("{qty}", String(totalQty))
          .replace("{price}", String(totalPrice))}
      </div>

      <button
        onClick={handleOrder}
        disabled={activeVariants.length === 0}
        className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        {t("souvenirs.orderWhatsapp")}
      </button>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </Card>
  );
}



function PhotoUpload({
  itemId,
  onChange,
}: {
  itemId: string;
  onChange: (state: { hasPhoto: boolean; uploadedUrl: string | null }) => void;
}) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Max 10 MB");
      return;
    }
    // Always show a local preview first — works for guests and signed-in users alike.
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setHasPhoto(true);
    onChange({ hasPhoto: true, uploadedUrl: null });
    toast.success(t("souvenirs.photoReady"));

    // For signed-in users, also upload to storage so we can attach a URL in WhatsApp.
    if (!user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      // Path must start with the user's auth.uid() to satisfy storage RLS.
      const path = `${user.id}/${itemId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage
        .from("souvenir-uploads")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data, error: signErr } = await supabase.storage
        .from("souvenir-uploads")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signErr || !data) throw signErr || new Error("Sign failed");
      onChange({ hasPhoto: true, uploadedUrl: data.signedUrl });
    } catch (err: unknown) {
      // Preview still works; just no attachment URL for WhatsApp.
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="text-sm font-semibold text-foreground mb-2">{t("souvenirs.uploadPhoto")}</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
      {hasPhoto ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-300 bg-emerald-50">
            {previewUrl && (
              <img src={previewUrl} alt="" className="w-14 h-14 rounded-md object-cover border" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-sm">
                <Check className="w-4 h-4" /> {t("souvenirs.photoReady")}
              </div>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="text-xs text-foreground/60 hover:text-foreground underline"
              >
                {t("souvenirs.replacePhoto")}
              </button>
            </div>
          </div>

          {previewUrl && (
            <div className="rounded-xl border border-border bg-gradient-to-br from-sky-50 to-white p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-bold text-foreground">{t("souvenirs.previewTitle")}</div>
                  <p className="text-xs text-foreground/60 mt-0.5">{t("souvenirs.previewSubtitle")}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-accent-orange/10 text-accent-orange text-[11px] font-semibold whitespace-nowrap">
                  <Sparkles className="w-3 h-3" />
                  {t("souvenirs.previewBadge")}
                </span>
              </div>
              <div className="flex justify-center">
                {/* Magnet mock: square photo with thick white border, rounded corners and soft shadow to mimic a fridge magnet */}
                <div
                  className="relative bg-white p-3 rounded-lg shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] rotate-[-2deg] transition-transform hover:rotate-0"
                  style={{ width: "min(260px, 70%)" }}
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-sky-100">
                    <img
                      src={previewUrl}
                      alt={t("souvenirs.previewTitle")}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-2 text-center text-[10px] tracking-wider font-semibold text-foreground/60 uppercase">
                    Let&apos;s Skydive HK
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-border hover:border-accent-orange/60 hover:bg-accent-orange/5 transition-colors text-foreground/70 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> {t("souvenirs.uploading")}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" /> {t("souvenirs.uploadPhoto")}
            </>
          )}
        </button>
      )}
      <p className="text-xs text-foreground/60 mt-2">{t("souvenirs.uploadHint")}</p>
    </div>
  );
}

function ProductCard({ item }: { item: Souvenir }) {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const sizes = item.sizes.length > 0 ? item.sizes : [];
  const [selectedSize, setSelectedSize] = useState<string>(
    sizes[1]?.size_label || sizes[0]?.size_label || ""
  );
  const [hasPhoto, setHasPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [variantQtys, setVariantQtys] = useState<Record<string, number>>({});
  const name = getName(item, language);
  const desc = getDesc(item, language);
  const vendorNote = getVendorNote(item, language);

  const activeVariants = useMemo(
    () =>
      item.variants
        .filter((v) => v.is_active)
        .sort((a, b) => a.display_order - b.display_order),
    [item.variants]
  );
  const editionQty = useMemo(
    () => Object.values(variantQtys).reduce((s, n) => s + (n > 0 ? n : 0), 0),
    [variantQtys]
  );
  const customQty = item.customisation_required ? (hasPhoto ? quantity : 0) : quantity;
  const combinedQty = item.customisation_required ? customQty + editionQty : quantity;
  const lineTotal = pickTierPrice(item, Math.max(1, combinedQty));

  const setVariantQty = (id: string, n: number) => {
    setVariantQtys((prev) => {
      const next = { ...prev };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });
  };

  const handleOrder = () => {
    if (item.customisation_required && !hasPhoto) {
      toast.error(t("souvenirs.uploadFirst"));
      return;
    }
    let msg: string;
    if (item.customisation_required) {
      const qtyStr = String(quantity);
      const priceStr = String(lineTotal);
      if (user && photoUrl) {
        msg = t("souvenirs.magnetWhatsappMsgMember")
          .replace("{qty}", qtyStr)
          .replace("{price}", priceStr)
          .replace("{photo}", photoUrl);
      } else if (photoUrl) {
        msg = t("souvenirs.magnetWhatsappMsg")
          .replace("{qty}", qtyStr)
          .replace("{price}", priceStr)
          .replace("{photo}", photoUrl);
      } else {
        msg = t("souvenirs.magnetWhatsappMsgNoPhoto")
          .replace("{qty}", qtyStr)
          .replace("{price}", priceStr);
      }
    } else {
      msg = t("souvenirs.whatsappMsg")
        .replace("{size}", selectedSize)
        .replace("{qty}", String(quantity))
        .replace("{price}", String(lineTotal))
        .replace("Let's Skydive HK T-Shirt", name)
        .replace("Let's Skydive HK T恤", name);
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const showOriginal = item.original_price && item.original_price > item.price;

  return (
    <Card className="overflow-hidden p-0 mb-10">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="aspect-square max-h-[280px] md:max-h-none bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center overflow-hidden">
          <img
            src={item.customisation_required ? magnetFridgeMosaic : (item.image_url || "/placeholder.svg")}
            alt={name}
            width={1024}
            height={1024}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 sm:p-8 flex flex-col min-w-0">

          <h2 className="text-2xl font-bold text-foreground mb-1">{name}</h2>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {vendorNote && (
              <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-orange/10 text-accent-orange text-xs font-semibold">
                <Sparkles className="w-3 h-3" />
                {vendorNote}
              </span>
            )}
            {item.customisation_required && (
              <span className="inline-flex w-fit items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
                <Ruler className="w-3 h-3" />
                {t("souvenirs.magnetSize")}
              </span>
            )}
          </div>
          <p className="text-foreground/70 mb-4">{desc}</p>
          <div className="flex items-baseline gap-3 mb-3">
            <div className="text-3xl font-bold text-accent-orange">HK${item.price}</div>
            {showOriginal && (
              <div className="text-lg text-foreground/50 line-through">HK${item.original_price}</div>
            )}
            {item.customisation_required && (
              <div className="text-sm text-foreground/60">/ {t("souvenirs.each")}</div>
            )}
          </div>

          {item.customisation_required && (
            <div
              className={`flex items-start gap-2 mb-6 px-3 py-2 rounded-lg border text-sm ${
                user
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-amber-200 bg-amber-50 text-amber-800"
              }`}
            >
              <BadgePercent className="w-4 h-4 mt-0.5 shrink-0" />
              {user ? (
                <span>{t("souvenirs.memberDiscountApplied")}</span>
              ) : (
                <span>
                  {t("souvenirs.memberDiscountGuest")}{" "}
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="font-semibold underline underline-offset-2 hover:text-amber-900"
                  >
                    {t("souvenirs.signInCta")}
                  </button>
                </span>
              )}
            </div>
          )}

          {item.customisation_required && item.variants.filter((v) => v.is_active).length > 0 && (
            <div className="mb-6">
              <div className="text-sm font-semibold text-foreground mb-1">
                {t("souvenirs.examplesTitle")}
              </div>
              <p className="text-xs text-foreground/60 mb-3">{t("souvenirs.examplesHint")}</p>
              <div className="grid grid-cols-4 gap-2">
                {item.variants
                  .filter((v) => v.is_active)
                  .sort((a, b) => a.display_order - b.display_order)
                  .slice(0, 4)
                  .map((v) => (
                    <div key={v.id} className="space-y-1">
                      <div className="aspect-square overflow-hidden rounded-md border border-border bg-sky-100">
                        {v.image_url ? (
                          <img
                            src={v.image_url}
                            alt={getVariantName(v, language)}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-foreground/40">
                            —
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] sm:text-xs text-center text-foreground/70 truncate">
                        {getVariantName(v, language)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <BulkPricingTable item={item} />

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

          {item.customisation_required ? (
            <>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                label={t("souvenirs.qtyLabel")}
              />
              <div className="mb-4 text-sm text-foreground/70">
                {t("souvenirs.totalLine")
                  .replace("{qty}", String(quantity))
                  .replace("{price}", String(lineTotal))}
              </div>
              <PhotoUpload
                itemId={item.id}
                onChange={({ hasPhoto: hp, uploadedUrl }) => {
                  setHasPhoto(hp);
                  setPhotoUrl(uploadedUrl);
                }}
              />
            </>
          ) : (
            <>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                label={t("souvenirs.qtyLabel")}
              />
              <div className="mb-4 text-sm text-foreground/70">
                {t("souvenirs.totalLine")
                  .replace("{qty}", String(quantity))
                  .replace("{price}", String(lineTotal))}
              </div>
            </>
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
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
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
