/**
 * Read-only preview that mirrors the delivered newsletter email layout
 * (see supabase/functions/_shared/newsletter-email.ts).
 */

const SITE_URL = "https://letskydivehk.com";
const LOGO_URL = `${SITE_URL}/__l5e/assets-v1/5262a898-3cb8-4025-8445-2e1cb0ea6103/skydive-hk-logo.png`;
const HERO_URL = `${SITE_URL}/__l5e/assets-v1/69053dd0-8d61-45d5-a033-903cc2385a64/email-hero-skydive.jpg`;

function Inline({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} style={{ color: "#0f6fff" }}>
            {p}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function Body({ text }: { text: string }) {
  const blocks = (text || "").trim().split(/\n\s*\n/);
  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^[-*•]\s+/.test(l));
        if (isList) {
          return (
            <ul key={bi} style={{ margin: "0 0 16px", paddingLeft: 20, listStyle: "disc" }}>
              {lines.map((l, li) => (
                <li key={li} style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.7 }}>
                  <Inline text={l.replace(/^[-*•]\s+/, "")} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.75 }}>
            {lines.map((l, li) => (
              <span key={li}>
                {li > 0 && <br />}
                <Inline text={l} />
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}

export function NewsletterPreview({
  subjectZh,
  subjectEn,
  bodyZh,
  bodyEn,
  heroImageUrl,
  fullName = "跳傘朋友",
}: {
  subjectZh: string;
  subjectEn: string;
  bodyZh: string;
  bodyEn: string;
  heroImageUrl?: string | null;
  fullName?: string;
}) {
  const hero = heroImageUrl || HERO_URL;
  return (
    <div style={{ background: "#f4f6f8", padding: 12, borderRadius: 12 }}>
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "#ffffff",
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
          color: "#1a2540",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang TC', 'Microsoft JhengHei', sans-serif",
        }}
      >
        <div style={{ padding: "28px 24px 8px", textAlign: "center" }}>
          <img
            src={LOGO_URL}
            alt="Let's Skydive HK"
            style={{ width: "100%", maxWidth: 276, height: "auto", display: "block", margin: "0 auto" }}
          />
        </div>
        <div style={{ padding: "12px 24px 0" }}>
          <img
            src={hero}
            alt="Skydive HK"
            style={{ width: "100%", maxWidth: 552, height: "auto", display: "block", borderRadius: 8 }}
          />
        </div>

        <div style={{ padding: "24px 32px 0" }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 12,
              letterSpacing: 1,
              color: "#8792a4",
              textTransform: "uppercase",
            }}
          >
            跳傘知識 · 中文
          </p>
          <h1 style={{ margin: "0 0 16px", fontSize: 21, lineHeight: 1.4 }}>{subjectZh}</h1>
          <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.75 }}>親愛的 {fullName}，</p>
          <Body text={bodyZh} />
        </div>

        <div style={{ padding: "8px 32px" }}>
          <div style={{ height: 1, background: "#eef1f5" }} />
        </div>

        <div style={{ padding: "16px 32px 0" }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 12,
              letterSpacing: 1,
              color: "#8792a4",
              textTransform: "uppercase",
            }}
          >
            Skydiving knowledge · English
          </p>
          <h2 style={{ margin: "0 0 16px", fontSize: 19, lineHeight: 1.4 }}>{subjectEn}</h2>
          <Body text={bodyEn} />
        </div>

        <div style={{ padding: "16px 24px 28px", textAlign: "center" }}>
          <span
            style={{
              display: "inline-block",
              background: "#0f6fff",
              color: "#ffffff",
              fontWeight: 700,
              fontSize: 16,
              padding: "14px 28px",
              borderRadius: 8,
            }}
          >
            立即預約跳傘 / Book your jump
          </span>
        </div>

        <div style={{ padding: "16px 32px 28px", borderTop: "1px solid #eef1f5" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#8792a4", textAlign: "center" }}>
            Let's Skydive HK · letskydivehk.com
          </p>
        </div>
      </div>
    </div>
  );
}
