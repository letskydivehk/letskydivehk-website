// Admin-only: draft skydiving-knowledge newsletter articles (TC + EN) with Lovable AI.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const TOPICS = [
  "30 歲生日，送自己一個「離地」的勇氣",
  "那 60 秒，我終於聽不到手機的聲音",
  "和最好的朋友一起，在 4000 米高空許願",
  "給一直說「下次先」的你",
  "媽媽第一次跳傘之後說的那句話",
  "由驚到飛：怕高的人為甚麼更應該跳一次",
  "芭堤雅日落下的降落，是我見過最溫柔的風景",
  "失戀、轉工、畢業後，用一跳重新開始",
  "深圳 iFLY：不用坐飛機，也能體驗飛的自由",
  "離地日：一群陌生人變成一班飛友",
  "海南的藍：從高空望落海岸線的一刻",
  "求婚、紀念日、蜜月：把最重要的時刻留在天空",
  "給自己一個不用解釋的決定",
  "落地之後，世界好像變得不一樣",
  "一張跳傘相，提醒我原來可以咁勇敢",
  "工作再忙，也要有一天屬於天空",
];

async function callAI(topic: string) {
  const system =
    "You write short, emotionally warm email newsletters for a Hong Kong skydiving company (Let's Skydive HK). " +
    "Purpose: deliver emotional value — freedom, courage, release, connection with loved ones, self-breakthrough, a sense of achievement and life meaning. About 80% of the article is feeling and story; only about 20% is light skydiving knowledge. " +
    "Structure: open with a vivid scene or moment the reader can step into; develop the emotion and what the jump means in life; include exactly ONE short paragraph starting with '你知道嗎？' (en: 'Did you know?') sharing one light, positive skydiving fact; close with warm encouragement and a soft, non-pushy invitation to book. " +
    "Tone: sincere, heartfelt, Cantonese-flavoured Traditional Chinese for the zh-TW fields, natural English for the en fields. 200-320 words per language, 3-5 short paragraphs. " +
    "Never mention accidents, injuries, death, safety statistics, or dwell on fear. Do not invent prices, dates, or real customer names. No markdown headings; you may use **bold** sparingly. EMOJI: be very energetic and exciting — use LOTS of emoji throughout both languages (e.g. 🪂☁️🌈✨🔥💙🙌😍🎉🌅🛫💪), at least 2-3 emoji in every paragraph and in the subject/title, so it feels fun and exhilarating, never dull.";

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Write the newsletter article for this topic: ${topic}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "submit_article",
            description: "Submit the bilingual newsletter article",
            parameters: {
              type: "object",
              properties: {
                subject_zh_tw: { type: "string" },
                subject_en: { type: "string" },
                body_zh_tw: { type: "string" },
                body_en: { type: "string" },
              },
              required: ["subject_zh_tw", "subject_en", "body_zh_tw", "body_en"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "submit_article" } },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`AI gateway failed [${res.status}]: ${body}`);
    throw Object.assign(new Error(body), { status: res.status });
  }

  const json = await res.json();
  const call = json?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("AI returned no article");
  return JSON.parse(call.function.arguments);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate caller is an admin
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: isAdmin } = await admin.rpc("has_role", {
      _user_id: userData.user.id,
      _role: "admin",
    });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const target = Math.min(Math.max(Number(body?.count ?? 1), 1), 5);
    const topicHint: string | undefined = body?.topic ? String(body.topic).slice(0, 200) : undefined;

    // Topics already queued/sent, to avoid repeats
    const { data: existing } = await admin
      .from("newsletter_articles")
      .select("topic, queue_position")
      .order("queue_position", { ascending: false });

    const usedTopics = new Set((existing ?? []).map((a: any) => a.topic).filter(Boolean));
    let nextPos = ((existing ?? [])[0]?.queue_position ?? 0) + 1;

    const created: any[] = [];
    for (let i = 0; i < target; i++) {
      const topic =
        topicHint && i === 0
          ? topicHint
          : TOPICS.filter((t) => !usedTopics.has(t))[0] ??
            TOPICS[Math.floor(Math.random() * TOPICS.length)];
      usedTopics.add(topic);

      const article = await callAI(topic);
      const { data, error } = await admin
        .from("newsletter_articles")
        .insert({
          topic,
          subject_zh_tw: article.subject_zh_tw ?? "",
          subject_en: article.subject_en ?? "",
          body_zh_tw: article.body_zh_tw ?? "",
          body_en: article.body_en ?? "",
          queue_position: nextPos++,
          status: "draft",
          created_by: userData.user.id,
        })
        .select()
        .single();
      if (error) throw error;
      created.push(data);

      if (i < target - 1) await new Promise((r) => setTimeout(r, 800));
    }

    return new Response(JSON.stringify({ ok: true, created }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    const status = e?.status && Number(e.status) >= 400 ? Number(e.status) : 500;
    console.error("newsletter-generate error", e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || "Generation failed" }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
