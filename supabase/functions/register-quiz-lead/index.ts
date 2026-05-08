import { createClient } from "npm:@supabase/supabase-js@2.95.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2.95.0/cors";
import { z } from "npm:zod@3.23.8";

const BodySchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(6).max(30),
  email: z.string().trim().email().max(255).transform((s) => s.toLowerCase()),
  answer_code: z.string().max(200).optional().nullable(),
  recommended_service: z.string().max(100).optional().nullable(),
  recommended_location_slug: z.string().max(100).optional().nullable(),
  language: z.string().max(10).optional().nullable(),
});

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Simple in-memory throttle (per cold start)
const recent = new Map<string, number>();
const THROTTLE_MS = 60_000;

async function findUserByEmail(email: string) {
  // Paginate through up to a few pages to find the user
  for (let page = 1; page <= 5; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => (u.email || "").toLowerCase() === email);
    if (match) return match;
    if (data.users.length < 200) break;
  }
  return null;
}

async function sendMagicEmail(opts: {
  email: string;
  fullName: string;
  link: string;
  language?: string | null;
  isNew: boolean;
}) {
  if (!RESEND_API_KEY) return;
  const isZh = (opts.language || "").startsWith("zh");
  const subject = opts.isNew
    ? isZh
      ? "您的 $100 跳傘信用額已準備好 🎁"
      : "Your $100 skydiving credit is ready 🎁"
    : isZh
      ? "歡迎回來 — 即時登入連結"
      : "Welcome back — your instant login link";

  const body = opts.isNew
    ? isZh
      ? `<p>${opts.fullName} 您好，</p><p>感謝您完成測驗！我們已為您建立帳戶，並存入 <strong>$100 HKD 信用額</strong>，可用於首次預訂。</p><p>點擊下方連結即可登入並查看您的個人化推薦：</p>`
      : `<p>Hi ${opts.fullName},</p><p>Thanks for taking the quiz! We've created an account for you and credited <strong>$100 HKD</strong> toward your first booking.</p><p>Click below to log in and see your personalised recommendation:</p>`
    : isZh
      ? `<p>${opts.fullName} 您好，</p><p>歡迎回來！點擊下方連結即可登入您的 Let's Skydive HK 帳戶。</p>`
      : `<p>Hi ${opts.fullName},</p><p>Welcome back! Click below to log in to your Let's Skydive HK account.</p>`;

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f7fafc;padding:32px;color:#1a202c">
    <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
      <h1 style="margin:0 0 16px;font-size:22px">${subject}</h1>
      ${body}
      <p style="text-align:center;margin:28px 0">
        <a href="${opts.link}" style="background:#f97316;color:#fff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:bold;display:inline-block">${isZh ? "登入帳戶" : "Log in to my account"}</a>
      </p>
      <p style="font-size:12px;color:#718096">${isZh ? "如果按鈕無效，請複製以下連結到瀏覽器：" : "If the button doesn't work, paste this link into your browser:"}<br><span style="word-break:break-all">${opts.link}</span></p>
      <p style="font-size:12px;color:#a0aec0;margin-top:24px">Let's Skydive HK</p>
    </div></body></html>`;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Let's Skydive HK <onboarding@resend.dev>",
      to: [opts.email],
      subject,
      html,
    }),
  }).catch(() => {});
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const json = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const input = parsed.data;

    // Throttle per email
    const last = recent.get(input.email) || 0;
    if (Date.now() - last < THROTTLE_MS) {
      return new Response(JSON.stringify({ error: "Please wait a moment before retrying." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    recent.set(input.email, Date.now());

    // SECURITY: Hardcode the redirect URL to prevent open-redirect / phishing via spoofed Origin header.
    const ALLOWED_ORIGINS = new Set([
      "https://letskydivehk.com",
      "https://letskydivehk.lovable.app",
    ]);
    const rawOrigin = req.headers.get("origin") || "";
    const origin = ALLOWED_ORIGINS.has(rawOrigin) ? rawOrigin : "https://letskydivehk.com";
    const redirectTo = `${origin}/auth/callback`;

    // 1. Find or create auth user
    let userId: string | null = null;
    let isNew = false;
    const existing = await findUserByEmail(input.email);
    if (existing) {
      userId = existing.id;
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: input.email,
        email_confirm: true,
        user_metadata: {
          full_name: input.full_name,
          phone: input.phone,
          signup_method: "quiz",
        },
      });
      if (createErr) {
        console.error("createUser error", createErr.message);
        return new Response(JSON.stringify({ error: "Could not create account" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      userId = created.user?.id ?? null;
      isNew = true;
    }

    // 2. Generate magic link and email it
    if (userId) {
      const { data: linkData } = await admin.auth.admin.generateLink({
        type: "magiclink",
        email: input.email,
        options: { redirectTo },
      });
      const link = linkData?.properties?.action_link;
      if (link) {
        await sendMagicEmail({
          email: input.email,
          fullName: input.full_name,
          link,
          language: input.language,
          isNew,
        });
      }
    }

    // 3. Insert quiz lead
    await admin.from("quiz_leads").insert({
      full_name: input.full_name,
      phone: input.phone,
      email: input.email,
      answer_code: input.answer_code ?? null,
      recommended_service: input.recommended_service ?? null,
      recommended_location_slug: input.recommended_location_slug ?? null,
      language: input.language ?? null,
      user_id: userId,
    });

    return new Response(JSON.stringify({ ok: true, isNew }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("register-quiz-lead error", (e as Error).message);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
