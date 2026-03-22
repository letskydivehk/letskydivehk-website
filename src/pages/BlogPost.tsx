import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Tag, Clock, Rocket } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState, useEffect, useRef, useCallback } from "react";
import { SEO } from "@/components/SEO";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { BackgroundDecorations } from "@/components/BackgroundDecorations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Language } from "@/contexts/LanguageContext";

function getLocalizedField(row: any, field: string, language: Language): string {
  if (language === "zh-TW" && row[`${field}_zh_tw`]) return row[`${field}_zh_tw`];
  if (language === "zh-CN" && row[`${field}_zh_cn`]) return row[`${field}_zh_cn`];
  return row[field] || "";
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractTocFromContent(content: string): TocItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const id = match[2].toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/gi, "-").replace(/(^-|-$)/g, "");
    items.push({ id, text: match[2], level: match[1].length });
  }
  return items;
}

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  if (items.length === 0) return null;
  return (
    <nav className="space-y-0.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contents</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={`toc-link ${item.level === 3 ? "pl-6" : ""} ${activeId === item.id ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {item.text}
        </a>
      ))}
    </nav>
  );
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeading, setActiveHeading] = useState("");
  const articleRef = useRef<HTMLDivElement>(null);

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["blog-related", slug],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("blog_posts")
        .select("id, slug, title, title_zh_tw, title_zh_cn, cover_image, published_at, category")
        .eq("is_published", true)
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data || []) as any[];
    },
    enabled: !!slug,
  });

  const content = post ? getLocalizedField(post, "content", language) : "";
  const tocItems = extractTocFromContent(content);

  // Scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active heading observer
  useEffect(() => {
    if (!articleRef.current || tocItems.length === 0) return;
    const headings = articleRef.current.querySelectorAll("h2[id], h3[id]");
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [content, tocItems]);

  const categoryLabels: Record<string, string> = {
    guide: t("blog.category.guide"),
    tips: t("blog.category.tips"),
    news: t("blog.category.news"),
  };

  // Custom heading renderer to add IDs
  const headingRenderer = useCallback(
    ({ node, children, ...props }: any) => {
      const text = String(children);
      const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/gi, "-").replace(/(^-|-$)/g, "");
      const Tag = `h${node?.tagName?.match(/\d/)?.[0] || 2}` as keyof JSX.IntrinsicElements;
      return <Tag id={id} {...props}>{children}</Tag>;
    },
    []
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageNavbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-pulse space-y-4 max-w-3xl w-full px-4">
            <div className="h-64 bg-muted rounded-xl" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <PageNavbar />
        <div className="pt-24 text-center py-20">
          <h1 className="text-2xl font-bold text-foreground mb-4">{t("blog.notFound")}</h1>
          <Link to="/blog">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t("blog.backToList")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const title = getLocalizedField(post, "title", language);
  const excerpt = getLocalizedField(post, "excerpt", language);
  const readTime = estimateReadTime(content);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <SEO
        title={title}
        description={excerpt}
        path={`/blog/${slug}`}
        image={post.cover_image || undefined}
        type="article"
      />
      <PageNavbar />
      <BackgroundDecorations />

      {/* Reading Progress Bar */}
      <div className="reading-progress" style={{ width: `${scrollProgress}%` }} />

      {/* Hero Cover Image */}
      {post.cover_image && (
        <div className="relative w-full h-[40vh] min-h-[320px] md:h-[50vh] md:min-h-[400px] overflow-hidden">
          <img
            src={post.cover_image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container max-w-5xl mx-auto">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-4 text-shadow-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("blog.backToList")}
              </Link>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge className="bg-primary text-primary-foreground">
                  {categoryLabels[post.category] || post.category}
                </Badge>
                {post.published_at && (
                  <span className="text-sm text-white/80 flex items-center gap-1 text-shadow-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.published_at).toLocaleDateString()}
                  </span>
                )}
                {post.author_name && (
                  <span className="text-sm text-white/80 flex items-center gap-1 text-shadow-medium">
                    <User className="w-3.5 h-3.5" />
                    {post.author_name}
                  </span>
                )}
                <span className="text-sm text-white/80 flex items-center gap-1 text-shadow-medium">
                  <Clock className="w-3.5 h-3.5" />
                  {readTime} min read
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white text-shadow-strong leading-tight max-w-3xl">
                {title}
              </h1>
            </div>
          </div>
        </div>
      )}

      <main className="relative z-10 pb-20">
        {/* If no cover image, show a simple header */}
        {!post.cover_image && (
          <div className="pt-24 container max-w-5xl mx-auto px-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("blog.backToList")}
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-primary text-primary-foreground">
                {categoryLabels[post.category] || post.category}
              </Badge>
              {post.published_at && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
              )}
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h1>
          </div>
        )}

        {/* Content Grid: Article + TOC Sidebar */}
        <div className="container max-w-5xl mx-auto px-4 mt-8 md:mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12">
            {/* Article */}
            <motion.article
              ref={articleRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="blog-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: headingRenderer,
                    h3: headingRenderer,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-border">
                  <Tag className="w-4 h-4 text-muted-foreground mt-0.5" />
                  {post.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </motion.article>

            {/* TOC Sidebar — desktop only */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={tocItems} activeId={activeHeading} />
              </div>
            </aside>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="container max-w-5xl mx-auto px-4 mt-16">
            <h2 className="text-xl font-bold text-foreground mb-6">{t("blog.relatedPosts")}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {relatedPosts.map((related: any) => (
                <Link key={related.id} to={`/blog/${related.slug}`} className="group">
                  <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
                    {related.cover_image && (
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={related.cover_image}
                          alt={getLocalizedField(related, "title", language)}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <div className="p-4">
                      <Badge variant="outline" className="text-xs mb-2">
                        {categoryLabels[related.category] || related.category}
                      </Badge>
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {getLocalizedField(related, "title", language)}
                      </h3>
                      {related.published_at && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(related.published_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="container max-w-5xl mx-auto px-4 mt-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 border border-primary/15 p-8 md:p-12 text-center">
            <div className="absolute top-4 right-8 opacity-10">
              <Rocket className="w-24 h-24 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">{t("blog.ctaTitle")}</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">{t("blog.ctaSubtitle")}</p>
            <Link to="/#booking">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8">
                {t("common.bookNow")}
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
