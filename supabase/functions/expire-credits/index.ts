// Daily job: expire aged credits + send 30-day expiry reminders.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

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
