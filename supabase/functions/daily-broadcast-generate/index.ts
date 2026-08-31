// Generates the daily WhatsApp group broadcast draft (AI copy + live site data).
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const SITE = "https://letskydivehk.com";

const DEFAULT_TOPICS: Record<string, string> = {
  "0": "學員故事與跳傘體驗分享",
  "1": "跳傘安全知識與裝備解構",
  "2": "第一次跳傘的準備與心理建設",
  "3": "出團提醒：下次深圳 iFLY 與各基地檔期",
  "4": "天氣與適跳指數小知識",
  "5": "優惠、推薦碼與會員獎勵提醒",
  "6": "週末跳傘號召與拍攝小貼士",
};

function hkToday(): string {
  const now = new Date(Date.now() + 8 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

function weatherLabel(code: number): string {
  if (code === 0) return "☀️ 晴朗";
  if (code <= 2) return "🌤️ 大致晴朗";
  if (code === 3) return "☁️ 陰天";
  if (code <= 48) return "🌫️ 有霧";
  if (code <= 55) return "🌦️ 毛毛雨";
  if (code <= 65) return "🌧️ 有雨";
  if (code <= 82) return "🌧️ 陣雨";
  if (code >= 95) return "⛈️ 雷暴";
  return "🌤️";
}

async function fetchWeather(lat: number, lon: number) {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_probability_max` +
      `&timezone=Asia%2FHong_Kong&forecast_days=3`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const j = await res.json();
    const d = j?.daily;
    if (!d?.time?.length) return null;
    return d.time.slice(0, 3).map((t: string, i: number) => ({
      date: t,
      code: d.weather_code?.[i] ?? 0,
      tmax: Math.round(d.temperature_2m_max?.[i] ?? 0),
      tmin: Math.round(d.temperature_2m_min?.[i] ?? 0),
      wind: Math.round(d.wind_speed_10m_max?.[i] ?? 0),
      rain: Math.round(d.precipitation_probability_max?.[i] ?? 0),
    }));
  } catch {
    return null;
  }
}

/** Live facts pulled from the site's own data. */
async function collectFacts() {
  const today = hkToday();

  // Upcoming departures (next 3 open ones) with seats left
  const { data: departures } = await admin
    .from("service_departures")
    .select(
      "departure_date, capacity, status, location_service_id, location_services(service_name, location_id, locations(Name, City))",
    )
    .gte("departure_date", today)
    .eq("status", "open")
    .order("departure_date", { ascending: true })
    .limit(3);

  const departureLines: string[] = [];

  for (const d of departures ?? []) {
    const svc: any = (d as any).location_services;
    const loc: any = svc?.locations;
    const { data: booked } = await admin
      .from("bookings")
      .select("participants")
      .eq("service_id", (d as any).location_service_id)
      .eq("preferred_date", (d as any).departure_date)
      .neq("status", "cancelled");
    const taken = (booked ?? []).reduce((s: number, b: any) => s + (b.participants || 0), 0);
    const left = Math.max(0, ((d as any).capacity ?? 0) - taken);
    const where = loc?.City || loc?.Name || "";
    departureLines.push(
      `• ${(d as any).departure_date}｜${where} ${svc?.service_name ?? ""}｜餘 ${left} 位`,
    );
  }

  // Weather for EVERY active location that has coordinates
  const { data: locs } = await admin
    .from("locations")
    .select("Name, City, weather_lat, weather_lon, display_order")
    .eq("is_active", true)
    .not("weather_lat", "is", null)
    .not("weather_lon", "is", null)
    .order("display_order", { ascending: true });

  const weatherBlocks: { name: string; lines: string[] }[] = [];
  for (const l of locs ?? []) {
    const name = (l as any).City || (l as any).Name || "";
    const w = await fetchWeather(Number((l as any).weather_lat), Number((l as any).weather_lon));
    if (!w) continue;
    weatherBlocks.push({
      name,
      lines: w.map(
        (x: any) =>
          `• ${x.date.slice(5)}｜${weatherLabel(x.code)} ${x.tmin}-${x.tmax}°C｜風 ${x.wind}km/h｜降雨 ${x.rain}%`,
      ),
    });
  }

  return {
    departureLines,
    weatherBlocks,
  };
}


async function callAI(topic: string, facts: any, includeEn: boolean) {
  const system =
    "你為香港跳傘公司「Let's Skydive HK」撰寫每日 WhatsApp 群組訊息。" +
    "語氣親切、地道港式繁體中文，短句、易讀，適合手機閱讀。" +
    "長度 90-150 字，2-4 個短段落或 emoji 條列。先提供有用資訊或知識，最後一句輕鬆邀請預約。" +
    "不要杜撰價格、日期或安全數據。不要用 markdown 標題；WhatsApp 只支援 *粗體*、_斜體_。" +
    (includeEn ? "同時提供一個同樣長度的英文版本。" : "英文版本可留空字串。");

  const context = [
    facts.departureLines.length ? `未來出團：\n${facts.departureLines.join("\n")}` : "",
    facts.weatherBlocks?.length
      ? "各基地未來天氣：\n" +
        facts.weatherBlocks
          .map((b: any) => `${b.name}\n${b.lines.join("\n")}`)
          .join("\n")
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");


  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content:
            `今日主題：${topic}\n\n` +
            (context ? `可參考的真實資料（唔需要全部照抄）：\n${context}` : "今日沒有額外即時資料。"),
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "submit_message",
            description: "Submit the daily WhatsApp broadcast copy",
            parameters: {
              type: "object",
              properties: {
                body_zh_tw: { type: "string" },
                body_en: { type: "string" },
              },
              required: ["body_zh_tw", "body_en"],
              additionalProperties: false,
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "submit_message" } },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`AI gateway failed [${res.status}]: ${body}`);
    throw Object.assign(new Error(body), { status: res.status });
  }
  const json = await res.json();
  const call = json?.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) throw new Error("AI returned no message");
  return JSON.parse(call.function.arguments);
}

function compose(main: string, facts: any, lang: "zh" | "en") {
  const parts: string[] = [];
  parts.push(main.trim());

  if (facts.departureLines.length) {
    parts.push(
      (lang === "zh" ? "*🗓️ 最近出團*\n" : "*🗓️ Upcoming departures*\n") +
        facts.departureLines.join("\n"),
    );
  }
  if (facts.weatherLines.length) {
    parts.push(
      (lang === "zh" ? `*🌤️ ${facts.weatherSpotName} 天氣*\n` : `*🌤️ ${facts.weatherSpotName} weather*\n`) +
        facts.weatherLines.join("\n"),
    );
  }
  parts.push(
    lang === "zh"
      ? `*🎁 會員著數*\n新會員即送 $200 現金券，推薦朋友再賺 $100。\n\n立即預約 👉 ${SITE}`
      : `*🎁 Member perks*\nHK$200 welcome credit for new members, HK$100 per referral.\n\nBook now 👉 ${SITE}`,
  );

  return parts.join("\n\n");
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

    const body = await req.json().catch(() => ({}));
    const isCron = body?.cron === true;

    if (!isCron) {
      const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
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
    }

    const { data: settings } = await admin
      .from("daily_broadcast_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (isCron && settings && settings.enabled === false) {
      return new Response(JSON.stringify({ skipped: "disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const date = hkToday();
    const force = body?.force === true;

    const { data: existing } = await admin
      .from("daily_broadcasts")
      .select("id, status")
      .eq("broadcast_date", date)
      .maybeSingle();

    if (existing && !force) {
      return new Response(JSON.stringify({ skipped: "already_generated", id: existing.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const weekday = String(new Date(`${date}T00:00:00Z`).getUTCDay());
    const topicMap = (settings?.weekday_topics as Record<string, string>) ?? DEFAULT_TOPICS;
    const topic = body?.topic
      ? String(body.topic).slice(0, 200)
      : topicMap[weekday] || DEFAULT_TOPICS[weekday];
    const includeEn = body?.include_en ?? settings?.include_en ?? false;

    const facts = await collectFacts();
    const ai = await callAI(topic, facts, includeEn);

    const bodyZh = compose(ai.body_zh_tw || "", facts, "zh");
    const bodyEn = includeEn && ai.body_en ? compose(ai.body_en, facts, "en") : "";

    const { data, error } = await admin
      .from("daily_broadcasts")
      .upsert(
        {
          broadcast_date: date,
          topic,
          body_zh_tw: bodyZh,
          body_en: bodyEn,
          status: "draft",
          posted_at: null,
        },
        { onConflict: "broadcast_date" },
      )
      .select()
      .single();
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, broadcast: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    const status = e?.status && Number(e.status) >= 400 ? Number(e.status) : 500;
    console.error("daily-broadcast-generate error", e?.message || e);
    return new Response(JSON.stringify({ error: e?.message || "Generation failed" }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
