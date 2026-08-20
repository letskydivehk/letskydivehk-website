// Admin-only: draft skydiving-knowledge newsletter articles (TC + EN) with Lovable AI.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const TOPICS = [
  "跳傘安全：雙人跳傘的安全紀錄與程序",
  "跳傘裝備解構：主傘、備用傘與 AAD 自動開傘器",
  "第一次跳傘會有甚麼感覺？從登機到落地",
  "跳傘前一晚應該做甚麼準備？衣著、飲食、睡眠",
  "為甚麼跳傘不會「失重嘔吐」？自由落體的科學",
  "天氣如何影響跳傘？風速、雲層與能見度",
  "A-Licence 考證之路：由 AFF 到單人跳傘",
  "跳傘常見迷思大破解：耳朵、心跳、呼吸",
  "如何拍出最好的跳傘照片與影片",
  "深圳 iFLY 室內跳傘 vs 高空跳傘：分別在哪？",
  "跳傘後的身體感覺與恢復小貼士",
  "帶家人朋友一齊跳傘：如何說服身邊人",
];

async function callAI(topic: string) {
  const system =
    "You write short, friendly, factual email newsletters for a Hong Kong skydiving company (Let's Skydive HK). " +
    "Tone: warm, encouraging, Cantonese-flavoured Traditional Chinese for the zh-TW fields, natural English for the en fields. " +
    "Each article: 200-320 words per language, 3-5 short paragraphs or bullet points, educational first, then a gentle invitation to book a jump. " +
    "Do not invent prices, dates or safety statistics you are not sure of. No markdown headings; you may use '- ' bullets and **bold**.";

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
