import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Save, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { SEO } from "@/components/SEO";
import { PageNavbar } from "@/components/PageNavbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  title_zh_tw: string | null;
  title_zh_cn: string | null;
  content: string;
  content_zh_tw: string | null;
  content_zh_cn: string | null;
  excerpt: string | null;
  excerpt_zh_tw: string | null;
  excerpt_zh_cn: string | null;
  cover_image: string | null;
  category: string;
  tags: string[];
  is_published: boolean;
  published_at: string | null;
  author_name: string | null;
  display_order: number;
}

const emptyPost: Omit<BlogPost, "id"> = {
  slug: "",
  title: "",
  title_zh_tw: "",
  title_zh_cn: "",
  content: "",
  content_zh_tw: "",
  content_zh_cn: "",
  excerpt: "",
  excerpt_zh_tw: "",
  excerpt_zh_cn: "",
  cover_image: "",
  category: "guide",
  tags: [],
  is_published: false,
  published_at: null,
  author_name: "Let's Skydive HK",
  display_order: 0,
};

export default function AdminBlog() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingPost, setEditingPost] = useState<(BlogPost | Omit<BlogPost, "id">) | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);

  const checkAdmin = useCallback(async (userId: string) => {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    setIsAdmin(!!data);
    if (!data) navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/", { replace: true }); return; }
    checkAdmin(user.id);
  }, [authLoading, user, navigate, checkAdmin]);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("blog_posts")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data || []) as BlogPost[];
    },
    enabled: isAdmin,
  });

  const handleSave = async () => {
    if (!editingPost) return;
    setSaving(true);
    try {
      const postData = {
        ...editingPost,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
        published_at: editingPost.is_published && !editingPost.published_at ? new Date().toISOString() : editingPost.published_at,
      };

      if ("id" in editingPost) {
        const { error } = await (supabase as any)
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id);
        if (error) throw error;
        toast.success("Post updated");
      } else {
        const { error } = await supabase
          .from("blog_posts" as any)
          .insert(postData as any);
        if (error) throw error;
        toast.success("Post created");
      }
      queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
      setEditingPost(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts" as any).delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Post deleted");
    queryClient.invalidateQueries({ queryKey: ["admin-blog-posts"] });
  };

  const startEditing = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setTagsInput(post.tags?.join(", ") || "");
    } else {
      setEditingPost({ ...emptyPost });
      setTagsInput("");
    }
    setShowPreview(false);
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Admin - Blog" path="/admin/blog" />
      <PageNavbar />

      <main className="pt-24 pb-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/membership">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Blog Management</h1>
            </div>
            {!editingPost && (
              <Button onClick={() => startEditing()} className="gap-2">
                <Plus className="w-4 h-4" /> New Post
              </Button>
            )}
          </div>

          {editingPost ? (
            <Card>
              <CardHeader>
                <CardTitle>{"id" in editingPost ? "Edit Post" : "New Post"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Slug (URL)</Label>
                    <Input value={editingPost.slug} onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })} placeholder="my-blog-post" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <select
                      value={editingPost.category}
                      onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="guide">Guide</option>
                      <option value="tips">Tips</option>
                      <option value="news">News</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Title (English)</Label>
                  <Input value={editingPost.title} onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Title (繁體中文)</Label>
                    <Input value={editingPost.title_zh_tw || ""} onChange={(e) => setEditingPost({ ...editingPost, title_zh_tw: e.target.value })} />
                  </div>
                  <div>
                    <Label>Title (简体中文)</Label>
                    <Input value={editingPost.title_zh_cn || ""} onChange={(e) => setEditingPost({ ...editingPost, title_zh_cn: e.target.value })} />
                  </div>
                </div>

                <div>
                  <Label>Excerpt (English)</Label>
                  <Textarea value={editingPost.excerpt || ""} onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })} rows={2} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Excerpt (繁體中文)</Label>
                    <Textarea value={editingPost.excerpt_zh_tw || ""} onChange={(e) => setEditingPost({ ...editingPost, excerpt_zh_tw: e.target.value })} rows={2} />
                  </div>
                  <div>
                    <Label>Excerpt (简体中文)</Label>
                    <Textarea value={editingPost.excerpt_zh_cn || ""} onChange={(e) => setEditingPost({ ...editingPost, excerpt_zh_cn: e.target.value })} rows={2} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label>Content (English, Markdown)</Label>
                    <Button variant="ghost" size="sm" onClick={() => setShowPreview(!showPreview)}>
                      {showPreview ? <Edit className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                      {showPreview ? "Edit" : "Preview"}
                    </Button>
                  </div>
                  {showPreview ? (
                    <div className="prose dark:prose-invert max-w-none p-4 border border-border rounded-md min-h-[200px]">
                      <ReactMarkdown>{editingPost.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <Textarea value={editingPost.content} onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })} rows={12} className="font-mono text-sm" />
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Content (繁體中文)</Label>
                    <Textarea value={editingPost.content_zh_tw || ""} onChange={(e) => setEditingPost({ ...editingPost, content_zh_tw: e.target.value })} rows={8} className="font-mono text-sm" />
                  </div>
                  <div>
                    <Label>Content (简体中文)</Label>
                    <Textarea value={editingPost.content_zh_cn || ""} onChange={(e) => setEditingPost({ ...editingPost, content_zh_cn: e.target.value })} rows={8} className="font-mono text-sm" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Cover Image URL</Label>
                    <Input value={editingPost.cover_image || ""} onChange={(e) => setEditingPost({ ...editingPost, cover_image: e.target.value })} placeholder="https://..." />
                  </div>
                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="safety, beginners, tips" />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label>Author</Label>
                    <Input value={editingPost.author_name || ""} onChange={(e) => setEditingPost({ ...editingPost, author_name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Display Order</Label>
                    <Input type="number" value={editingPost.display_order} onChange={(e) => setEditingPost({ ...editingPost, display_order: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="flex items-center gap-3 pt-6">
                    <Switch
                      checked={editingPost.is_published}
                      onCheckedChange={(checked) => setEditingPost({ ...editingPost, is_published: checked })}
                    />
                    <Label>Published</Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setEditingPost(null)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-10 text-muted-foreground">Loading...</div>
              ) : posts.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">No blog posts yet.</div>
              ) : (
                posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        {post.cover_image && (
                          <img src={post.cover_image} alt="" className="w-16 h-12 rounded object-cover flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">{post.title}</p>
                            {post.is_published ? (
                              <Badge className="bg-green-500/20 text-green-600 border-green-500/30 text-xs">Published</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">Draft</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{post.category} · /{post.slug}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditing(post)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(post.id)} className="text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
