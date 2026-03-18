
-- =============================================
-- Part A: Blog Posts table
-- =============================================
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  title_zh_tw text,
  title_zh_cn text,
  content text NOT NULL DEFAULT '',
  content_zh_tw text,
  content_zh_cn text,
  excerpt text,
  excerpt_zh_tw text,
  excerpt_zh_cn text,
  cover_image text,
  category text NOT NULL DEFAULT 'guide',
  tags text[] DEFAULT '{}'::text[],
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  author_name text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can view published posts
CREATE POLICY "Published blog posts are publicly viewable"
  ON public.blog_posts FOR SELECT
  TO public
  USING (is_published = true);

-- Admins can view all (including drafts)
CREATE POLICY "Admins can view all blog posts"
  ON public.blog_posts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert
CREATE POLICY "Admins can insert blog posts"
  ON public.blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update
CREATE POLICY "Admins can update blog posts"
  ON public.blog_posts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete
CREATE POLICY "Admins can delete blog posts"
  ON public.blog_posts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- Part B: Membership Tiers table
-- =============================================
CREATE TABLE public.membership_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_zh_tw text,
  name_zh_cn text,
  min_jumps integer NOT NULL DEFAULT 0,
  credit_multiplier numeric NOT NULL DEFAULT 1.0,
  perks text[] DEFAULT '{}'::text[],
  perks_zh_tw text[] DEFAULT '{}'::text[],
  perks_zh_cn text[] DEFAULT '{}'::text[],
  color text DEFAULT '#888888',
  icon text DEFAULT 'award',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.membership_tiers ENABLE ROW LEVEL SECURITY;

-- Tiers are publicly viewable
CREATE POLICY "Membership tiers are publicly viewable"
  ON public.membership_tiers FOR SELECT
  TO public
  USING (true);

-- Only admins can manage tiers
CREATE POLICY "Admins can manage membership tiers"
  ON public.membership_tiers FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- Add columns to profiles
-- =============================================
ALTER TABLE public.profiles
  ADD COLUMN total_jumps integer NOT NULL DEFAULT 0,
  ADD COLUMN tier_id uuid REFERENCES public.membership_tiers(id),
  ADD COLUMN date_of_birth date;
