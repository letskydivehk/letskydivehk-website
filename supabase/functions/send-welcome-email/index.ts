import { corsHeaders } from "npm:@supabase/supabase-js@2.95.0/cors";
import { z } from "npm:zod@3.23.8";

const BodySchema = z.object({
  email: z.string().trim().email().max(255).transform((s) => s.toLowerCase()),
  full_name: z.string().trim().min(1).max(100).optional().nullable(),
  language: z.string().max(10).optional().nullable(),
});

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

// In-memory throttle (per cold start) — 5 min per email
const recent = new Map<string, number>();
const THROTTLE_MS = 5 * 60_000;

const ALLOWED_ORIGINS = new Set([
  "https://letskydivehk.com",
  "https://letskydivehk.lovable.app",
]);

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
    const { email, full_name, language } = parsed.data;

    const last = recent.get(email) || 0;
    if (Date.now() - last < THROTTLE_MS) {
      return new Response(JSON.stringify({ ok: true, throttled: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    recent.set(email, Date.now());

    const rawOrigin = req.headers.get("origin") || "";
    const origin = ALLOWED_ORIGINS.has(rawOrigin) ? rawOrigin : "https://letskydivehk.com";
    const membershipLink = `${origin}/membership`;

    const isZh = (language || "").startsWith("zh");
    const name = full_name?.trim() || (isZh ? "跳傘朋友" : "there");

    const subject = isZh
      ? "歡迎加入 Let's Skydive HK — 您的 $200 現金券已到手 🎁"
      : "Welcome to Let's Skydive HK — Your $200 cash voucher is ready 🎁";

    const body = isZh
      ? `<p>${name} 您好，</p>
         <p>歡迎加入 Let's Skydive HK！我們已為您存入 <strong>$200 HKD 現金券</strong>，可用於首次預訂跳傘。</p>
         <p>點擊下方按鈕即可登入會員專頁，查看您的現金券並預約跳傘：</p>`
      : `<p>Hi ${name},</p>
         <p>Welcome to Let's Skydive HK! We've credited a <strong>$200 HKD cash voucher</strong> to your account, ready for your first skydive.</p>
         <p>Click below to log in to your member page, view your voucher and book your jump:</p>`;

    const buttonLabel = isZh ? "$200 現金券 — 立即使用" : "$200 Cash Voucher — Redeem Now";

    const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f7fafc;padding:32px;color:#1a202c">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px">
        <h1 style="margin:0 0 16px;font-size:22px">${subject}</h1>
        ${body}
        <p style="text-align:center;margin:28px 0">
          <a href="${membershipLink}" style="background:#f97316;color:#fff;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:bold;display:inline-block;font-size:16px">${buttonLabel}</a>
        </p>
        <p style="font-size:12px;color:#718096">${isZh ? "如按鈕無效，請複製此連結到瀏覽器：" : "If the button doesn't work, paste this link into your browser:"}<br><span style="word-break:break-all">${membershipLink}</span></p>
        <p style="font-size:12px;color:#a0aec0;margin-top:24px">Let's Skydive HK</p>
      </div></body></html>`;

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ ok: false, error: "email_not_configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Let's Skydive HK <onboarding@resend.dev>",
        to: [email],
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const text = await resendRes.text();
      console.error("resend send failed", resendRes.status, text);
      return new Response(
        JSON.stringify({ error: "email_send_failed", status: resendRes.status, details: text }),
        { status: resendRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-welcome-email error", (e as Error).message);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
