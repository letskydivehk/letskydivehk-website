import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage, Language } from "@/contexts/LanguageContext";

function getLocalizedField(row: any, field: string, language: Language): string {
  if (language === "zh-TW" && row[`${field}_zh_tw`]) return row[`${field}_zh_tw`];
  if (language === "zh-CN" && row[`${field}_zh_cn`]) return row[`${field}_zh_cn`];
  return row[field] || "";
}

export function LatestBlog() {
  const { t, language } = useLanguage();

  const { data: posts = [] } = useQuery({
    queryKey: ["latest-blog-posts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(3);
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  if (posts.length === 0) return null;

  const categoryLabels: Record<string, string> = {
    guide: t("blog.category.guide"),
    tips: t("blog.category.tips"),
    news: t("blog.category.news"),
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <BookOpen className="w-3 h-3 mr-1" />
            {t("blog.badge")}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            {t("blog.title")}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("blog.subtitle")}
          </p>
        </motion.div>

        {/* Posts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any, index: number) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} className="group block h-full">
                <div className="rounded-xl overflow-hidden bg-card border border-border hover:border-primary/30 transition-all hover:shadow-lg h-full flex flex-col">
                  {post.cover_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={getLocalizedField(post, "title", language)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {categoryLabels[post.category] || post.category}
                      </Badge>
                      {post.published_at && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {getLocalizedField(post, "title", language)}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                      {getLocalizedField(post, "excerpt", language)}
                    </p>
                    <span className="text-sm text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      {t("blog.readMore")} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all"
          >
            {t("blog.viewAll")} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
