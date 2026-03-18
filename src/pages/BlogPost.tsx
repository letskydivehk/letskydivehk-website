import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
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

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useLanguage();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts" as any)
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

  const { data: relatedPosts = [] } = useQuery({
    queryKey: ["blog-related", slug, post?.category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts" as any)
        .select("id, slug, title, title_zh_tw, title_zh_cn, cover_image, published_at, category")
        .eq("is_published", true)
        .eq("category", post?.category)
        .neq("slug", slug)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return data || [];
    },
    enabled: !!post?.category,
  });

  const categoryLabels: Record<string, string> = {
    guide: t("blog.category.guide"),
    tips: t("blog.category.tips"),
    news: t("blog.category.news"),
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageNavbar />
        <div className="pt-24 flex items-center justify-center">
          <div className="animate-pulse space-y-4 max-w-3xl w-full px-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-64 bg-muted rounded" />
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
  const content = getLocalizedField(post, "content", language);
  const excerpt = getLocalizedField(post, "excerpt", language);

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

      <main className="relative z-10 pt-24 pb-20">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Back link */}
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            {t("blog.backToList")}
          </Link>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Cover Image */}
            {post.cover_image && (
              <div className="rounded-xl overflow-hidden mb-8 aspect-video">
                <img
                  src={post.cover_image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">{categoryLabels[post.category] || post.category}</Badge>
              {post.published_at && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.published_at).toLocaleDateString()}
                </span>
              )}
              {post.author_name && (
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {post.author_name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">{title}</h1>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:text-foreground prose-p:text-foreground/80
              prose-a:text-primary prose-strong:text-foreground
              prose-li:text-foreground/80">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-border">
                <Tag className="w-4 h-4 text-muted-foreground" />
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </motion.article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold text-foreground mb-6">{t("blog.relatedPosts")}</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map((related: any) => (
                  <Link key={related.id} to={`/blog/${related.slug}`} className="group">
                    <div className="rounded-lg overflow-hidden bg-card border border-border hover:border-primary/30 transition-all">
                      {related.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={related.cover_image}
                            alt={getLocalizedField(related, "title", language)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {getLocalizedField(related, "title", language)}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 text-center p-8 rounded-xl bg-primary/5 border border-primary/10">
            <h2 className="text-xl font-bold text-foreground mb-2">{t("blog.ctaTitle")}</h2>
            <p className="text-muted-foreground mb-4">{t("blog.ctaSubtitle")}</p>
            <Link to="/#booking">
              <Button className="bg-primary text-primary-foreground">{t("common.bookNow")}</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
