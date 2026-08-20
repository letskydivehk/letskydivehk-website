// Bi-weekly newsletter sender. Cron entry point + admin test/manual send.
// Bounded batches, single-flight lease, idempotent per (article, email), pausable circuit breaker.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";
import { renderNewsletterEmail, SITE_URL } from "../_shared/newsletter-email.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

const BATCH_SIZE = 50; // recipients per invocation
const MIN_DAYS_BETWEEN_SENDS = 13; // guard against weekly cron double-send
const LEASE_MINUTES = 10;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function sendMail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY is not configured");
  const res = await fetch("https://api.resend.com/emails", {
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
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend failed [${res.status}]: ${body}`);
  }
}

function buildHtml(article: any, profile: { full_name?: string | null; unsubscribe_token?: string | null }) {
  return renderNewsletterEmail({
    fullName: profile.full_name,
    subjectZh: article.subject_zh_tw,
    subjectEn: article.subject_en,
    bodyZh: article.body_zh_tw,
    bodyEn: article.body_en,
    heroImageUrl: article.hero_image_url,
    unsubscribeUrl: profile.unsubscribe_token
      ? `${SITE_URL}/unsubscribe?token=${profile.unsubscribe_token}`
      : null,
  });
}

async function requireAdmin(req: Request) {
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  if (!token) return null;
  const { data } = await admin.auth.getUser(token);
  if (!data?.user) return null;
  const { data: isAdmin } = await admin.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
  return isAdmin ? data.user : null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const body = await req.json().catch(() => ({} as any));

  try {
    // ---- Admin test send to a single address ----
    if (body?.test_to) {
      const user = await requireAdmin(req);
      if (!user) return json({ error: "Unauthorized" }, 401);

      const { data: article, error } = await admin
        .from("newsletter_articles")
        .select("*")
        .eq("id", body.article_id)
        .maybeSingle();
      if (error) throw error;
      if (!article) return json({ error: "Article not found" }, 404);

      await sendMail(
        String(body.test_to),
        `[測試 Test] ${article.subject_zh_tw || article.subject_en}`,
        buildHtml(article, { full_name: "測試會員 / Test member", unsubscribe_token: null }),
      );
      return json({ ok: true, test: true, to: body.test_to });
    }

    // ---- Job state / pause guard ----
    const { data: state } = await admin
      .from("newsletter_job_state")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    const manual = body?.manual === true;
    let adminUser = null;
    if (manual) {
      adminUser = await requireAdmin(req);
      if (!adminUser) return json({ error: "Unauthorized" }, 401);
    }

    if (state?.paused && !manual) {
      return json({ ok: true, skipped: "paused", reason: state.pause_reason });
    }

    const now = new Date();

    // Single-flight lease
    if (state?.lease_expires_at && new Date(state.lease_expires_at) > now) {
      return json({ ok: true, skipped: "locked" });
    }
    await admin
      .from("newsletter_job_state")
      .update({
        lease_expires_at: new Date(now.getTime() + LEASE_MINUTES * 60_000).toISOString(),
        last_run_at: now.toISOString(),
      })
      .eq("id", 1);

    try {
      // Next approved, unsent article
      const { data: article } = await admin
        .from("newsletter_articles")
        .select("*")
        .eq("status", "approved")
        .order("queue_position", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!article) {
        return json({ ok: true, skipped: "no_approved_article" });
      }

      // 14-day cadence guard: only when starting a brand new article
      const { count: alreadySent } = await admin
        .from("newsletter_sends")
        .select("id", { count: "exact", head: true })
        .eq("article_id", article.id);

      if (!manual && (alreadySent ?? 0) === 0 && state?.last_sent_article_at) {
        const days =
          (now.getTime() - new Date(state.last_sent_article_at).getTime()) / 86_400_000;
        if (days < MIN_DAYS_BETWEEN_SENDS) {
          return json({ ok: true, skipped: "cadence", days_since_last: Math.floor(days) });
        }
      }

      // Recipients: opted-in profiles that have not received this article yet
      const { data: sentRows } = await admin
        .from("newsletter_sends")
        .select("email")
        .eq("article_id", article.id);
      const done = new Set((sentRows ?? []).map((r: any) => String(r.email).toLowerCase()));

      const { data: profiles } = await admin
        .from("profiles")
        .select("user_id, email, full_name, unsubscribe_token")
        .eq("newsletter_opt_in", true)
        .not("email", "is", null)
        .limit(5000);

      const pending = (profiles ?? []).filter(
        (p: any) => p.email && !done.has(String(p.email).toLowerCase()),
      );
      const batch = pending.slice(0, BATCH_SIZE);

      let sent = 0;
      let failed = 0;
      for (const p of batch) {
        const subject = article.subject_zh_tw || article.subject_en;
        try {
          await sendMail(p.email, subject, buildHtml(article, p));
          sent++;
          await admin.from("newsletter_sends").insert({
            article_id: article.id,
            user_id: p.user_id,
            email: p.email,
            status: "sent",
          });
        } catch (e: any) {
          failed++;
          console.error("newsletter send failed", p.email, e?.message || e);
          await admin.from("newsletter_sends").insert({
            article_id: article.id,
            user_id: p.user_id,
            email: p.email,
            status: "failed",
            error: String(e?.message || e).slice(0, 500),
          });
        }
        await new Promise((r) => setTimeout(r, 120));
      }

      const remaining = pending.length - batch.length;
      const totalCount = (alreadySent ?? 0) + sent;

      if (remaining <= 0) {
        await admin
          .from("newsletter_articles")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            recipients_count: totalCount,
          })
          .eq("id", article.id);
        await admin
          .from("newsletter_job_state")
          .update({ last_sent_article_at: new Date().toISOString(), consecutive_failures: 0 })
          .eq("id", 1);
      } else {
        await admin
          .from("newsletter_articles")
          .update({ recipients_count: totalCount })
          .eq("id", article.id);
      }

      // Circuit breaker: everything in the batch failed
      if (batch.length > 0 && sent === 0) {
        const fails = (state?.consecutive_failures ?? 0) + 1;
        await admin
          .from("newsletter_job_state")
          .update({
            consecutive_failures: fails,
            paused: fails >= 3,
            pause_reason: fails >= 3 ? "Repeated email delivery failures" : null,
          })
          .eq("id", 1);
      }

      return json({ ok: true, article_id: article.id, sent, failed, remaining });
    } finally {
      await admin.from("newsletter_job_state").update({ lease_expires_at: null }).eq("id", 1);
    }
  } catch (e: any) {
    console.error("newsletter-send error", e?.message || e);
    return json({ error: e?.message || "Send failed" }, 500);
  }
});
