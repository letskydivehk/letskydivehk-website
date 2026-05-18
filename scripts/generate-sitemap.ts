// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.

import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://letskydivehk.com";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/services/tandem-skydive", changefreq: "weekly", priority: "0.9" },
  { path: "/services/a-licence", changefreq: "weekly", priority: "0.9" },
  { path: "/gallery", changefreq: "weekly", priority: "0.7" },
  { path: "/promotions", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "weekly", priority: "0.7" },
  { path: "/membership", changefreq: "monthly", priority: "0.5" },
  { path: "/membership/tiers", changefreq: "monthly", priority: "0.6" },
  { path: "/quiz", changefreq: "monthly", priority: "0.6" },
  { path: "/compare", changefreq: "monthly", priority: "0.6" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  { path: "/disclaimer", changefreq: "yearly", priority: "0.3" },
];

async function fetchDynamicEntries(): Promise<SitemapEntry[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const supabase = createClient(url, key);
    const [{ data: locs }, { data: posts }] = await Promise.all([
      supabase.from("locations").select("slug"),
      supabase.from("blog_posts").select("slug, updated_at").eq("is_published", true),
    ]);
    const entries: SitemapEntry[] = [];
    (locs || []).forEach((l: any) =>
      entries.push({ path: `/location/${l.slug}`, changefreq: "monthly", priority: "0.8" })
    );
    (posts || []).forEach((p: any) =>
      entries.push({
        path: `/blog/${p.slug}`,
        lastmod: p.updated_at ? new Date(p.updated_at).toISOString().split("T")[0] : undefined,
        changefreq: "monthly",
        priority: "0.6",
      })
    );
    return entries;
  } catch (e) {
    console.warn("sitemap: failed to fetch dynamic entries", e);
    return [];
  }
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

(async () => {
  const dynamic = await fetchDynamicEntries();
  const all = [...staticEntries, ...dynamic];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(all));
  console.log(`sitemap.xml written (${all.length} entries)`);
})();
