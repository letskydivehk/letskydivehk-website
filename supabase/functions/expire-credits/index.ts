// Daily job: expire aged credits + send 30-day expiry reminders.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const SITE_URL = "https://letskydivehk.com";
const LOGO_URL = `${SITE_URL}/__l5e/assets-v1/5262a898-3cb8-4025-8445-2e1cb0ea6103/skydive-hk-logo.png`;
const HERO_URL = `${SITE_URL}/__l5e/assets-v1/69053dd0-8d61-45d5-a033-903cc2385a64/email-hero-skydive.jpg`;

function formatDateZh(d: Date) {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

function renderExpiryEmail(opts: { fullName?: string | null; amount: number; expiresAt: Date }) {
  const name = (opts.fullName && opts.fullName.trim()) || "跳傘朋友";
  const dateStr = formatDateZh(opts.expiresAt);
  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Microsoft JhengHei',sans-serif;color:#1a2540;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr><td align="center" style="padding:28px 24px 8px 24px;">
          <img src="${LOGO_URL}" alt="Let's Skydive HK" height="80" style="height:80px;width:auto;display:block;" />
        </td></tr>
        <tr><td style="padding:12px 24px 0 24px;">
          <img src="${HERO_URL}" alt="Skydive HK" width="552" style="width:100%;max-width:552px;height:auto;display:block;border-radius:8px;" />
        </td></tr>
        <tr><td style="padding:24px 32px 8px 32px;">
          <p style="margin:0 0 12px 0;font-size:16px;line-height:1.6;">親愛的 ${name}，</p>
          <p style="margin:0 0 20px 0;font-size:16px;line-height:1.7;">
            你的會員積分中有 <strong style="color:#0f6fff;">${opts.amount} 分</strong>將於 <strong>${dateStr}</strong> 到期。每 1 分 = $1，可用於下次跳傘尾款或加購服務。立即登入預訂你的下一次冒險！
          </p>
        </td></tr>
        <tr><td align="center" style="padding:8px 24px 28px 24px;">
          <a href="${SITE_URL}/membership" style="display:inline-block;background:#0f6fff;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:8px;">按此登入帳戶</a>
        </td></tr>
        <tr><td style="padding:16px 32px 28px 32px;border-top:1px solid #eef1f5;">
          <p style="margin:0;font-size:12px;color:#8792a4;text-align:center;">Let's Skydive HK · <a href="${SITE_URL}" style="color:#8792a4;text-decoration:none;">letskydivehk.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

async function sendMail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return;
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Let's Skydive HK <no-reply@letskydivehk.com>",
        reply_to: "letskydivehk@gmail.com",
        to: [to],
        subject,
        html,
      }),
    });
  } catch (e) {
    console.error("mail send failed", e);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Preview mode: send a sample reminder email to a specified address
  try {
    if (req.method === "POST") {
      const ct = req.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const body = await req.clone().json().catch(() => ({}));
        if (body?.preview_to) {
          const to = String(body.preview_to);
          const amount = Number(body.amount ?? 200);
          const days = Number(body.days ?? 30);
          const expiresAt = new Date(Date.now() + days * 86400_000);
          const fullName = body.full_name ? String(body.full_name) : null;
          await sendMail(
            to,
            "你的跳傘積分就到期啦，快啲預約跳傘用咗佢啦！",
            renderExpiryEmail({ fullName, amount, expiresAt }),
          );
          return new Response(JSON.stringify({ ok: true, preview: true, to }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }
  } catch (e) {
    console.error("preview send error", e);
  }



  try {
    // 1) Expire due credits: insert offsetting -amount entry + mark original expired_at
    const { data: dueRows, error: dueErr } = await admin
      .from("credit_transactions")
      .select("id, user_id, amount, description, expires_at")
      .eq("status", "approved")
      .is("expired_at", null)
      .gt("amount", 0)
      .not("expires_at", "is", null)
      .lte("expires_at", new Date().toISOString());
    if (dueErr) throw dueErr;

    let expiredCount = 0;
    for (const row of dueRows ?? []) {
      const { error: insErr } = await admin.from("credit_transactions").insert({
        user_id: row.user_id,
        amount: -row.amount,
        type: "admin_adjustment",
        description: `積分到期歸零 (原交易 #${String(row.id).slice(0, 8)})`,
        status: "approved",
      });
      if (insErr) {
        console.error("expire insert failed", insErr);
        continue;
      }
      await admin
        .from("credit_transactions")
        .update({ expired_at: new Date().toISOString() })
        .eq("id", row.id);
      expiredCount++;
    }

    // 2) Send 30-day reminders (once per row)
    const in30 = new Date(Date.now() + 30 * 86400_000).toISOString();
    const { data: soonRows } = await admin
      .from("credit_transactions")
      .select("id, user_id, amount, expires_at, email, full_name")
      .eq("status", "approved")
      .is("expired_at", null)
      .is("expiry_notified_at", null)
      .gt("amount", 0)
      .not("expires_at", "is", null)
      .gt("expires_at", new Date().toISOString())
      .lte("expires_at", in30);

    let notified = 0;
    for (const r of soonRows ?? []) {
      if (r.email) {
        const days = Math.max(
          1,
          Math.round((new Date(r.expires_at).getTime() - Date.now()) / 86400_000),
        );
        await sendMail(
          r.email,
          `你的 ${r.amount} 積分將於 ${days} 天後到期`,
          `<p>${r.full_name || ""} 你好，</p>
           <p>你的 <strong>${r.amount} 積分</strong>將於 ${new Date(r.expires_at).toLocaleDateString("zh-HK")} 到期。</p>
           <p>登入會員帳戶查看並使用積分：<a href="https://letskydivehk.com/membership">letskydivehk.com/membership</a></p>
           <p>Let's Skydive HK</p>`,
        );
      }
      await admin
        .from("credit_transactions")
        .update({ expiry_notified_at: new Date().toISOString() })
        .eq("id", r.id);
      notified++;
    }

    return new Response(
      JSON.stringify({ ok: true, expired: expiredCount, notified }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("expire-credits error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
