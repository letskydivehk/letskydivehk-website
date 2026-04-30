import type { Location } from "@/hooks/useLocations";

export type ServiceKey = "tandem" | "alicence" | "group";

export interface QuestionOption {
  key: string;
  service?: Partial<Record<ServiceKey, number>>;
  loc?: {
    country?: "Thailand" | "China";
    proximity?: number;
    scenery?: number;
    budget?: number;
    needsAff?: boolean;
    needsGroup?: boolean;
    monthPref?: number[];
  };
}

export interface Question {
  key: string;
  options: QuestionOption[];
}

export const QUIZ_QUESTIONS: Question[] = [
  {
    key: "quiz.q1",
    options: [
      { key: "quiz.q1.a", service: { tandem: 3 } },
      { key: "quiz.q1.b", service: { tandem: 1, alicence: 2 } },
      { key: "quiz.q1.c", service: { alicence: 4 } },
    ],
  },
  {
    key: "quiz.q2",
    options: [
      { key: "quiz.q2.a", service: { tandem: 1, alicence: 2 } },
      { key: "quiz.q2.b", service: { tandem: 3 } },
      { key: "quiz.q2.c", service: { group: 4, tandem: 1 }, loc: { needsGroup: true } },
      { key: "quiz.q2.d", service: { alicence: 3 } },
    ],
  },
  {
    key: "quiz.q3",
    options: [
      { key: "quiz.q3.a", service: { tandem: 2 } },
      { key: "quiz.q3.b", service: { tandem: 3, group: 1 } },
      { key: "quiz.q3.c", service: { alicence: 4 } },
    ],
  },
  {
    key: "quiz.q4",
    options: [
      { key: "quiz.q4.a", loc: { proximity: 3, country: "China", budget: 1 } },
      { key: "quiz.q4.b", loc: { proximity: 1, scenery: 2 } },
      { key: "quiz.q4.c", loc: { proximity: 0, scenery: 3, country: "Thailand" } },
    ],
  },
  {
    key: "quiz.q5",
    options: [
      { key: "quiz.q5.a", loc: { budget: 3, country: "China" } },
      { key: "quiz.q5.b", loc: { budget: 1 } },
      { key: "quiz.q5.c", loc: { budget: 0, scenery: 2 } },
    ],
  },
  {
    key: "quiz.q6",
    options: [
      { key: "quiz.q6.a", loc: { scenery: 3, country: "Thailand" } },
      { key: "quiz.q6.b", loc: { scenery: 2 } },
      { key: "quiz.q6.c", loc: { proximity: 2, country: "China" } },
      { key: "quiz.q6.d", loc: { scenery: 3 } },
    ],
  },
  {
    key: "quiz.q7",
    options: [
      { key: "quiz.q7.a", loc: { monthPref: [10, 11, 12] } },
      { key: "quiz.q7.b", loc: { monthPref: [1, 2, 3] } },
      { key: "quiz.q7.c", loc: { monthPref: [4, 5, 6, 7, 8, 9] } },
      { key: "quiz.q7.d", loc: {} },
    ],
  },
];

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
  reasons: string[]; // i18n keys
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
  "chiang-mai": { proximity: 0, scenery: 3, budget: 1 },
  huizhou: { proximity: 3, scenery: 1, budget: 3 },
  luoding: { proximity: 3, scenery: 2, budget: 3 },
  zhuhai: { proximity: 3, scenery: 2, budget: 2 },
  hainan: { proximity: 1, scenery: 3, budget: 2 },
};

export function computeRecommendation(
  selections: QuestionOption[],
  locations: Location[],
): Recommendation {
  const sScore: Record<ServiceKey, number> = { tandem: 0, alicence: 0, group: 0 };
  selections.forEach((opt) => {
    if (opt.service) {
      (Object.keys(opt.service) as ServiceKey[]).forEach((k) => {
        sScore[k] += opt.service![k] || 0;
      });
    }
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
  };
  selections.forEach((opt) => {
    const l = opt.loc;
    if (!l) return;
    if (l.proximity) agg.proximity += l.proximity;
    if (l.scenery) agg.scenery += l.scenery;
    if (l.budget) agg.budget += l.budget;
    if (l.country) agg.countryBoost[l.country] = (agg.countryBoost[l.country] || 0) + 2;
    if (l.needsAff) agg.needsAff = true;
    if (l.needsGroup) agg.needsGroup = true;
    if (l.monthPref) l.monthPref.forEach((m) => agg.monthPref.add(m));
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
      return { loc: l, score };
    })
    .sort((a, b) => b.score - a.score);

  // Build "why this match" reason keys
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

// ---- URL encoding for shareable result URLs ----
// Encode answers as compact string: one letter per question (a/b/c/d) joined.
// Handles missing questions / future expansion via "-" placeholder.
export function encodeAnswers(answers: (QuestionOption | null)[]): string {
  return answers
    .map((a, i) => {
      if (!a) return "-";
      const idx = QUIZ_QUESTIONS[i].options.findIndex((o) => o.key === a.key);
      return idx >= 0 ? String.fromCharCode(97 + idx) : "-";
    })
    .join("");
}

export function decodeAnswers(code: string): QuestionOption[] {
  const out: QuestionOption[] = [];
  for (let i = 0; i < QUIZ_QUESTIONS.length && i < code.length; i++) {
    const ch = code[i];
    if (ch === "-") continue;
    const idx = ch.charCodeAt(0) - 97;
    const opt = QUIZ_QUESTIONS[i].options[idx];
    if (opt) out.push(opt);
  }
  return out;
}
