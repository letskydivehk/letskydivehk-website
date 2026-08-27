import type { Location } from "@/hooks/useLocations";
import type { DBQuizOption, DBQuizQuestion } from "@/hooks/useQuiz";

export type ServiceKey = "tandem" | "alicence" | "group";

export interface RankedLocation {
  loc: Location;
  score: number;
}

export interface Recommendation {
  service: ServiceKey;
  serviceScores: Record<ServiceKey, number>;
  primaryLocation: Location | null;
  alternateLocation: Location | null;
  ranked: RankedLocation[];
  reasons: string[];
  agg: {
    proximity: number;
    scenery: number;
    budget: number;
    monthPref: number[];
    needsAff: boolean;
    needsGroup: boolean;
    countryBoost: Record<string, number>;
  };
}

const LOCATION_PROFILE: Record<string, { proximity: number; scenery: number; budget: number }> = {
  pattaya: { proximity: 0, scenery: 3, budget: 0 },
  "pattaya-tsa": { proximity: 0, scenery: 3, budget: 0 },
  "chiang-mai": { proximity: 0, scenery: 3, budget: 1 },
  huizhou: { proximity: 3, scenery: 1, budget: 3 },
  luoding: { proximity: 3, scenery: 2, budget: 3 },
  zhuhai: { proximity: 3, scenery: 2, budget: 2 },
  hainan: { proximity: 1, scenery: 3, budget: 2 },
};

export function computeRecommendation(
  selections: DBQuizOption[],
  locations: Location[],
): Recommendation {
  const sScore: Record<ServiceKey, number> = { tandem: 0, alicence: 0, group: 0 };
  selections.forEach((opt) => {
    const sw = opt.service_weights || {};
    (Object.keys(sw) as ServiceKey[]).forEach((k) => {
      sScore[k] += Number(sw[k]) || 0;
    });
  });
  const service =
    (Object.entries(sScore).sort((a, b) => b[1] - a[1])[0][0] as ServiceKey) || "tandem";

  const agg = {
    proximity: 0,
    scenery: 0,
    budget: 0,
    countryBoost: { Thailand: 0, China: 0 } as Record<string, number>,
    monthPref: new Set<number>(),
    needsAff: service === "alicence",
    needsGroup: false,
    pinSlugBonus: {} as Record<string, number>,
  };
  selections.forEach((opt) => {
    const l = opt.location_weights || {};
    if (l.proximity) agg.proximity += l.proximity;
    if (l.scenery) agg.scenery += l.scenery;
    if (l.budget) agg.budget += l.budget;
    if (l.country) agg.countryBoost[l.country] = (agg.countryBoost[l.country] || 0) + 2;
    if (l.needsAff) agg.needsAff = true;
    if (l.needsGroup) agg.needsGroup = true;
    if (l.monthPref) l.monthPref.forEach((m) => agg.monthPref.add(m));
    if (opt.pin_location_slug) {
      agg.pinSlugBonus[opt.pin_location_slug] =
        (agg.pinSlugBonus[opt.pin_location_slug] || 0) + 10;
    }
  });

  const candidates = locations
    .filter((l) => l.is_active && !l.coming_soon)
    .filter((l) => (agg.needsAff ? l.has_aff : true))
    .filter((l) => (agg.needsGroup ? l.has_group_events : true));

  const ranked: RankedLocation[] = candidates
    .map((l) => {
      const p = LOCATION_PROFILE[l.slug] || { proximity: 1, scenery: 2, budget: 1 };
      let score = 0;
      score += p.proximity * agg.proximity;
      score += p.scenery * agg.scenery;
      score += p.budget * agg.budget;
      score += agg.countryBoost[l.country] || 0;
      if (agg.monthPref.size > 0 && l.best_months) {
        const overlap = (l.best_months as number[]).filter((m) => agg.monthPref.has(m)).length;
        score += overlap * 1.5;
      }
      score += agg.pinSlugBonus[l.slug] || 0;
      return { loc: l, score };
    })
    .sort((a, b) => b.score - a.score);

  const reasons: string[] = [];
  if (agg.needsAff) reasons.push("quiz.reason.needsAff");
  if (agg.needsGroup) reasons.push("quiz.reason.needsGroup");
  if (agg.proximity >= agg.scenery && agg.proximity > 0) reasons.push("quiz.reason.proximity");
  if (agg.scenery > agg.proximity && agg.scenery > 0) reasons.push("quiz.reason.scenery");
  if (agg.budget >= 3) reasons.push("quiz.reason.budget");
  if (agg.monthPref.size > 0) reasons.push("quiz.reason.season");

  return {
    service,
    serviceScores: sScore,
    primaryLocation: ranked[0]?.loc || null,
    alternateLocation: ranked[1]?.loc || null,
    ranked,
    reasons,
    agg: {
      proximity: agg.proximity,
      scenery: agg.scenery,
      budget: agg.budget,
      monthPref: Array.from(agg.monthPref),
      needsAff: agg.needsAff,
      needsGroup: agg.needsGroup,
      countryBoost: agg.countryBoost,
    },
  };
}

// Encode: one letter per question (a/b/c/d/...), "-" if unanswered.
export function encodeAnswers(
  questions: DBQuizQuestion[],
  answers: (DBQuizOption | null)[],
): string {
  return questions
    .map((q, i) => {
      const a = answers[i];
      if (!a) return "-";
      const idx = q.options.findIndex((o) => o.id === a.id);
      return idx >= 0 ? String.fromCharCode(97 + idx) : "-";
    })
    .join("");
}

export function decodeAnswers(questions: DBQuizQuestion[], code: string): DBQuizOption[] {
  const out: DBQuizOption[] = [];
  for (let i = 0; i < questions.length && i < code.length; i++) {
    const ch = code[i];
    if (ch === "-") continue;
    const idx = ch.charCodeAt(0) - 97;
    const opt = questions[i].options[idx];
    if (opt) out.push(opt);
  }
  return out;
}

// Helper: pick a label in current language
export function quizLabel(
  o: { label_en: string; label_zh_tw: string; label_zh_cn: string },
  lang: string,
): string {
  if (lang === "zh-TW") return o.label_zh_tw || o.label_en;
  if (lang === "zh-CN") return o.label_zh_cn || o.label_en;
  return o.label_en;
}

export function quizText(
  q: { text_en: string; text_zh_tw: string; text_zh_cn: string },
  lang: string,
): string {
  if (lang === "zh-TW") return q.text_zh_tw || q.text_en;
  if (lang === "zh-CN") return q.text_zh_cn || q.text_en;
  return q.text_en;
}
