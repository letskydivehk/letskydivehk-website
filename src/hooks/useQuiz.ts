import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DBQuizOption {
  id: string;
  question_id: string;
  display_order: number;
  label_en: string;
  label_zh_tw: string;
  label_zh_cn: string;
  service_weights: Record<string, number>;
  location_weights: {
    country?: "Thailand" | "China";
    proximity?: number;
    scenery?: number;
    budget?: number;
    needsAff?: boolean;
    needsGroup?: boolean;
    monthPref?: number[];
  };
  pin_location_slug: string | null;
}

export interface DBQuizQuestion {
  id: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  text_en: string;
  text_zh_tw: string;
  text_zh_cn: string;
  options: DBQuizOption[];
}

export function useQuiz() {
  return useQuery({
    queryKey: ["quiz"],
    queryFn: async (): Promise<DBQuizQuestion[]> => {
      const { data: questions, error: qErr } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (qErr) throw qErr;
      const { data: options, error: oErr } = await supabase
        .from("quiz_options")
        .select("*")
        .order("display_order");
      if (oErr) throw oErr;
      return (questions ?? []).map((q: any) => ({
        ...q,
        options: (options ?? []).filter((o: any) => o.question_id === q.id) as DBQuizOption[],
      }));
    },
    staleTime: 60_000,
  });
}

export function useQuizAdmin() {
  return useQuery({
    queryKey: ["quiz", "admin"],
    queryFn: async (): Promise<DBQuizQuestion[]> => {
      const { data: questions, error: qErr } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("display_order");
      if (qErr) throw qErr;
      const { data: options, error: oErr } = await supabase
        .from("quiz_options")
        .select("*")
        .order("display_order");
      if (oErr) throw oErr;
      return (questions ?? []).map((q: any) => ({
        ...q,
        options: (options ?? []).filter((o: any) => o.question_id === q.id) as DBQuizOption[],
      }));
    },
  });
}
