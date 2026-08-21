// Shared branded HTML template for the bi-weekly knowledge newsletter (TC + EN in one email).

export const SITE_URL = "https://letskydivehk.com";
export const LOGO_URL = `${SITE_URL}/__l5e/assets-v1/5262a898-3cb8-4025-8445-2e1cb0ea6103/skydive-hk-logo.png`;
export const HERO_URL = `${SITE_URL}/__l5e/assets-v1/69053dd0-8d61-45d5-a033-903cc2385a64/email-hero-skydive.jpg`;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Very small markdown-ish renderer: paragraphs, "- " bullets and **bold**. */
export function renderBody(text: string) {
  const blocks = (text || "").trim().split(/\n\s*\n/);
  return blocks
    .map((block) => {
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
      const isList = lines.length > 0 && lines.every((l) => /^[-*•]\s+/.test(l));
      if (isList) {
        const items = lines
          .map(
            (l) =>
              `<li style="margin:0 0 8px 0;font-size:15px;line-height:1.7;">${inline(
                l.replace(/^[-*•]\s+/, ""),
              )}</li>`,
          )
          .join("");
        return `<ul style="margin:0 0 16px 0;padding-left:20px;">${items}</ul>`;
      }
      return `<p style="margin:0 0 16px 0;font-size:15px;line-height:1.75;">${inline(
        lines.join("<br />"),
      )}</p>`;
    })
    .join("");
}

function inline(s: string) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0f6fff;">$1</strong>');
}

export function renderNewsletterEmail(opts: {
  fullName?: string | null;
  subjectZh: string;
  subjectEn: string;
  bodyZh: string;
  bodyEn: string;
  heroImageUrl?: string | null;
  unsubscribeUrl?: string | null;
}) {
  const name = (opts.fullName && opts.fullName.trim()) || "跳傘朋友";
  const hero = opts.heroImageUrl || HERO_URL;
  const unsub = opts.unsubscribeUrl;

  return `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f6f8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang TC','Microsoft JhengHei',sans-serif;color:#1a2540;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.06);">
        <tr><td align="center" style="padding:28px 24px 8px 24px;">
          <img src="${LOGO_URL}" alt="Let's Skydive HK" width="276" style="width:100%;max-width:276px;height:auto;display:block;margin:0 auto;" />
        </td></tr>
        <tr><td style="padding:12px 24px 0 24px;">
          <img src="${hero}" alt="Skydive HK" width="552" style="width:100%;max-width:552px;height:auto;display:block;border-radius:8px;" />
        </td></tr>

        <!-- Traditional Chinese -->
        <tr><td style="padding:24px 32px 0 32px;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:1px;color:#8792a4;text-transform:uppercase;">跳傘知識 · 中文</p>
          <h1 style="margin:0 0 16px 0;font-size:21px;line-height:1.4;color:#1a2540;">${escapeHtml(
            opts.subjectZh,
          )}</h1>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.75;">親愛的 ${escapeHtml(name)}，</p>
          ${renderBody(opts.bodyZh)}
        </td></tr>

        <tr><td style="padding:8px 32px;"><div style="height:1px;background:#eef1f5;"></div></td></tr>

        <!-- English -->
        <tr><td style="padding:16px 32px 0 32px;">
          <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:1px;color:#8792a4;text-transform:uppercase;">Skydiving knowledge · English</p>
          <h2 style="margin:0 0 16px 0;font-size:19px;line-height:1.4;color:#1a2540;">${escapeHtml(
            opts.subjectEn,
          )}</h2>
          ${renderBody(opts.bodyEn)}
        </td></tr>

        <tr><td align="center" style="padding:16px 24px 28px 24px;">
          <a href="${SITE_URL}/#booking" style="display:inline-block;background:#0f6fff;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:8px;">立即預約跳傘 / Book your jump</a>
        </td></tr>

        <tr><td style="padding:16px 32px 28px 32px;border-top:1px solid #eef1f5;">
          <p style="margin:0 0 8px 0;font-size:12px;color:#8792a4;text-align:center;">Let's Skydive HK · <a href="${SITE_URL}" style="color:#8792a4;text-decoration:none;">letskydivehk.com</a></p>
          ${
            unsub
              ? `<p style="margin:0;font-size:11px;color:#a3adbb;text-align:center;">不想再收到跳傘知識電郵？<a href="${unsub}" style="color:#a3adbb;text-decoration:underline;">按此取消訂閱</a> · <a href="${unsub}" style="color:#a3adbb;text-decoration:underline;">Unsubscribe</a></p>`
              : ""
          }
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
