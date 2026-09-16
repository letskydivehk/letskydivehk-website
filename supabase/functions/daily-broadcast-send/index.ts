// Sends today's daily broadcast to the configured WhatsApp recipients.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const WHATSAPP_API_KEY = Deno.env.get("WHATSAPP_API_KEY");

const GATEWAY_URL = "https://connector-gateway.lovable.dev/whatsapp";

const admin = createClient(SUPABASE_URL, SERVICE_KEY);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function hkToday(): string {
  return new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/** E.164 digits only, no leading +. */
function normalisePhone(raw: string): string | null {
  const digits = String(raw ?? "").replace(/[^\d]/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return digits;
}

interface Recipient {
  phone: string;
  label?: string;
  lang?: string;
}

async function sendTemplate(
  phone: string,
  templateName: string,
  templateLanguage: string,
  bodyText: string,
) {
  const res = await fetch(`${GATEWAY_URL}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": WHATSAPP_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "template",
      template: {
        name: templateName,
        language: { code: templateLanguage },
        components: [
          {
            type: "body",
            parameters: [{ type: "text", text: bodyText }],
          },
        ],
      },
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    console.error(`WhatsApp send failed [${res.status}]: ${raw}`);
    return { ok: false, error: `[${res.status}] ${raw}`.slice(0, 1000) };
  }
  let messageId: string | null = null;
  try {
    messageId = JSON.parse(raw)?.messages?.[0]?.id ?? null;
  } catch {
    // non-JSON success body: ignore
  }
  return { ok: true, messageId };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const isCron = body?.cron === true;

    if (!isCron) {
      const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
      if (!token) return json({ error: "Unauthorized" }, 401);
      const { data: userData, error: userErr } = await admin.auth.getUser(token);
      if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
      const { data: isAdmin } = await admin.rpc("has_role", {
        _user_id: userData.user.id,
        _role: "admin",
      });
      if (!isAdmin) return json({ error: "Forbidden: admin only" }, 403);
    }

    if (!LOVABLE_API_KEY) return json({ error: "LOVABLE_API_KEY is not configured" }, 500);
    if (!WHATSAPP_API_KEY) {
      return json(
        { error: "WhatsApp is not connected yet. Link the WhatsApp Business connector first." },
        400,
      );
    }

    const { data: settings } = await admin
      .from("daily_broadcast_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (isCron && !settings?.auto_send) {
      return json({ skipped: "auto_send_disabled" });
    }

    const templateName = (settings as any)?.template_name;
    if (!templateName) {
      return json({ error: "No approved WhatsApp template name configured" }, 400);
    }
    const templateLanguage = (settings as any)?.template_language || "zh_HK";

    const rawRecipients = ((settings as any)?.recipients ?? []) as Recipient[];
    const recipients = rawRecipients
      .map((r) => ({ ...r, phone: normalisePhone(r.phone) }))
      .filter((r): r is Recipient & { phone: string } => !!r.phone);

    if (!recipients.length) return json({ error: "No recipients configured" }, 400);

    const date = body?.date ? String(body.date).slice(0, 10) : hkToday();
    const { data: broadcast } = await admin
      .from("daily_broadcasts")
      .select("id, body_zh_tw, body_en, status")
      .eq("broadcast_date", date)
      .maybeSingle();

    if (!broadcast) return json({ error: `No broadcast draft for ${date}` }, 404);
    if (isCron && broadcast.status === "posted") {
      return json({ skipped: "already_sent" });
    }

    const results: { phone: string; status: string; error?: string }[] = [];

    for (const r of recipients) {
      const wantsEn = String(r.lang || "").toLowerCase().startsWith("en");
      const text = (wantsEn && broadcast.body_en ? broadcast.body_en : broadcast.body_zh_tw) || "";
      // WhatsApp template parameters cannot contain newlines; keep the layout readable.
      const param = text.replace(/\n{2,}/g, " / ").replace(/\n/g, " · ").slice(0, 1000);

      const out = await sendTemplate(r.phone, templateName, templateLanguage, param);

      await admin.from("daily_broadcast_sends").insert({
        broadcast_id: broadcast.id,
        phone: r.phone,
        label: r.label ?? null,
        status: out.ok ? "sent" : "failed",
        error: out.ok ? null : out.error,
        provider_message_id: out.ok ? out.messageId : null,
      });

      results.push({ phone: r.phone, status: out.ok ? "sent" : "failed", error: out.ok ? undefined : out.error });
    }

    const sentCount = results.filter((r) => r.status === "sent").length;
    if (sentCount > 0) {
      await admin
        .from("daily_broadcasts")
        .update({ status: "posted", posted_at: new Date().toISOString() })
        .eq("id", broadcast.id);
    }

    return json({ ok: true, sent: sentCount, failed: results.length - sentCount, results });
  } catch (e: any) {
    console.error("daily-broadcast-send error", e?.message || e);
    return json({ error: e?.message || "Send failed" }, 500);
  }
});
