/*
  # Full CMS Rebuild Schema

  This migration introduces a new, production-ready schema for:
  - Bilingual content (id/en)
  - Full CMS (pages, sections, menus)
  - Corporate tour packages + itinerary + cost breakdown
  - Blog CMS
  - Car rental add-ons
  - SEO settings + redirects
  - Admin/editor role model with RLS
*/

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('admin', 'editor')),
  assigned_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.can_edit_content()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.role IN ('admin', 'editor')
  );
$$;

CREATE TABLE IF NOT EXISTS public.site_settings (
  id integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  organization_name text NOT NULL DEFAULT 'Sama Sama Tour',
  canonical_base_url text NOT NULL DEFAULT 'https://samasamatour.com',
  default_locale text NOT NULL DEFAULT 'en' CHECK (default_locale IN ('id', 'en')),
  whatsapp_number text NOT NULL DEFAULT '6282236037774',
  contact_email text,
  contact_phone text,
  contact_address text,
  usd_to_idr numeric(12,2) NOT NULL DEFAULT 16000,
  usd_last_updated timestamptz NOT NULL DEFAULT now(),
  global_seo_title_id text,
  global_seo_title_en text,
  global_seo_description_id text,
  global_seo_description_en text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type text NOT NULL DEFAULT 'gdrive' CHECK (source_type IN ('gdrive', 'external')),
  source_url text NOT NULL,
  drive_file_id text,
  mime_type text,
  width integer,
  height integer,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_media_assets_drive_file_id
  ON public.media_assets(drive_file_id)
  WHERE drive_file_id IS NOT NULL;

CREATE TRIGGER trg_media_assets_updated_at
BEFORE UPDATE ON public.media_assets
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.media_asset_i18n (
  media_id uuid NOT NULL REFERENCES public.media_assets(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  alt_text text,
  caption text,
  PRIMARY KEY (media_id, locale)
);

CREATE TABLE IF NOT EXISTS public.cms_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  show_in_sitemap boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_cms_pages_updated_at
BEFORE UPDATE ON public.cms_pages
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.cms_page_i18n (
  page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  title text NOT NULL,
  seo_title text,
  seo_description text,
  robots text NOT NULL DEFAULT 'index,follow',
  canonical_path text,
  schema_json jsonb,
  PRIMARY KEY (page_id, locale)
);

CREATE TABLE IF NOT EXISTS public.cms_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.cms_pages(id) ON DELETE CASCADE,
  section_key text NOT NULL,
  section_type text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (page_id, section_key)
);

CREATE INDEX IF NOT EXISTS idx_cms_sections_page_position
  ON public.cms_sections(page_id, position);

CREATE TRIGGER trg_cms_sections_updated_at
BEFORE UPDATE ON public.cms_sections
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.cms_section_i18n (
  section_id uuid NOT NULL REFERENCES public.cms_sections(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  PRIMARY KEY (section_id, locale)
);

CREATE TABLE IF NOT EXISTS public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  duration_days integer NOT NULL DEFAULT 1,
  duration_nights integer NOT NULL DEFAULT 0,
  min_pax integer,
  max_pax integer,
  price_idr bigint NOT NULL CHECK (price_idr > 0),
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  hero_media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_packages_status_sort
  ON public.packages(status, featured DESC, sort_order ASC, created_at DESC);

CREATE TRIGGER trg_packages_updated_at
BEFORE UPDATE ON public.packages
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.package_i18n (
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  slug text NOT NULL,
  name text NOT NULL,
  summary text,
  overview text,
  includes jsonb NOT NULL DEFAULT '[]'::jsonb,
  excludes jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  seo_title text,
  seo_description text,
  schema_json jsonb,
  PRIMARY KEY (package_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS public.package_itinerary_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  day_number integer NOT NULL CHECK (day_number > 0),
  UNIQUE (package_id, day_number)
);

CREATE TABLE IF NOT EXISTS public.package_itinerary_day_i18n (
  day_id uuid NOT NULL REFERENCES public.package_itinerary_days(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  title text NOT NULL,
  PRIMARY KEY (day_id, locale)
);

CREATE TABLE IF NOT EXISTS public.package_itinerary_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id uuid NOT NULL REFERENCES public.package_itinerary_days(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  time_label text,
  UNIQUE (day_id, position)
);

CREATE TABLE IF NOT EXISTS public.package_itinerary_item_i18n (
  item_id uuid NOT NULL REFERENCES public.package_itinerary_items(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  activity text NOT NULL,
  details text,
  PRIMARY KEY (item_id, locale)
);

CREATE TABLE IF NOT EXISTS public.package_cost_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  cost_group text NOT NULL CHECK (cost_group IN ('day', 'summary', 'fee', 'total')),
  day_number integer,
  position integer NOT NULL DEFAULT 0,
  label text NOT NULL,
  amount_idr bigint NOT NULL CHECK (amount_idr >= 0),
  notes text
);

CREATE INDEX IF NOT EXISTS idx_package_cost_items_package_group
  ON public.package_cost_items(package_id, cost_group, day_number, position);

CREATE TABLE IF NOT EXISTS public.car_rentals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  price_idr bigint NOT NULL CHECK (price_idr > 0),
  seats integer,
  transmission text,
  has_ac boolean NOT NULL DEFAULT true,
  luggage_capacity integer,
  image_media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_car_rentals_updated_at
BEFORE UPDATE ON public.car_rentals
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.car_rental_i18n (
  car_rental_id uuid NOT NULL REFERENCES public.car_rentals(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  seo_title text,
  seo_description text,
  PRIMARY KEY (car_rental_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS public.package_car_rentals (
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  car_rental_id uuid NOT NULL REFERENCES public.car_rentals(id) ON DELETE CASCADE,
  position integer NOT NULL DEFAULT 0,
  PRIMARY KEY (package_id, car_rental_id)
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  cover_media_id uuid REFERENCES public.media_assets(id) ON DELETE SET NULL,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published
  ON public.blog_posts(status, published_at DESC NULLS LAST, created_at DESC);

CREATE TRIGGER trg_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.blog_post_i18n (
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  slug text NOT NULL,
  title text NOT NULL,
  excerpt text,
  content_markdown text NOT NULL DEFAULT '',
  seo_title text,
  seo_description text,
  robots text NOT NULL DEFAULT 'index,follow',
  canonical_path text,
  schema_json jsonb,
  PRIMARY KEY (post_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.blog_category_i18n (
  category_id uuid NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  slug text NOT NULL,
  name text NOT NULL,
  PRIMARY KEY (category_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE IF NOT EXISTS public.blog_post_categories (
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id uuid NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

CREATE TABLE IF NOT EXISTS public.menus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  location text NOT NULL CHECK (location IN ('header', 'footer')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_menus_updated_at
BEFORE UPDATE ON public.menus
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id uuid NOT NULL REFERENCES public.menus(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES public.menu_items(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('internal', 'external', 'cta')),
  href text,
  page_key text,
  position integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_menu_parent_pos
  ON public.menu_items(menu_id, parent_id, position);

CREATE TRIGGER trg_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.menu_item_i18n (
  menu_item_id uuid NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  locale text NOT NULL CHECK (locale IN ('id', 'en')),
  label text NOT NULL,
  href_override text,
  PRIMARY KEY (menu_item_id, locale)
);

CREATE TABLE IF NOT EXISTS public.redirects (
  from_path text PRIMARY KEY,
  to_path text NOT NULL,
  status_code integer NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302)),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_redirects_updated_at
BEFORE UPDATE ON public.redirects
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE IF NOT EXISTS public.content_audit_logs (
  id bigserial PRIMARY KEY,
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  table_name text NOT NULL,
  row_primary_key text,
  action text NOT NULL CHECK (action IN ('insert', 'update', 'delete', 'publish', 'unpublish')),
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_audit_logs_created_at
  ON public.content_audit_logs(created_at DESC);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_asset_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_page_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_section_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_itinerary_day_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_itinerary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_itinerary_item_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_cost_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_rental_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_car_rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_category_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_item_i18n ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "roles_admin_read" ON public.user_roles;
CREATE POLICY "roles_admin_read"
  ON public.user_roles FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "roles_self_read" ON public.user_roles;
CREATE POLICY "roles_self_read"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "roles_admin_write" ON public.user_roles;
CREATE POLICY "roles_admin_write"
  ON public.user_roles FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "settings_public_read" ON public.site_settings;
CREATE POLICY "settings_public_read"
  ON public.site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "settings_admin_write" ON public.site_settings;
CREATE POLICY "settings_admin_write"
  ON public.site_settings FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "media_public_read" ON public.media_assets;
CREATE POLICY "media_public_read"
  ON public.media_assets FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "media_editor_write" ON public.media_assets;
CREATE POLICY "media_editor_write"
  ON public.media_assets FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "media_i18n_public_read" ON public.media_asset_i18n;
CREATE POLICY "media_i18n_public_read"
  ON public.media_asset_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.media_assets ma
    WHERE ma.id = media_asset_i18n.media_id
      AND ma.is_active = true
  ));

DROP POLICY IF EXISTS "media_i18n_editor_write" ON public.media_asset_i18n;
CREATE POLICY "media_i18n_editor_write"
  ON public.media_asset_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "cms_pages_public_read" ON public.cms_pages;
CREATE POLICY "cms_pages_public_read"
  ON public.cms_pages FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "cms_pages_editor_write" ON public.cms_pages;
CREATE POLICY "cms_pages_editor_write"
  ON public.cms_pages FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "cms_page_i18n_public_read" ON public.cms_page_i18n;
CREATE POLICY "cms_page_i18n_public_read"
  ON public.cms_page_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.cms_pages cp
    WHERE cp.id = cms_page_i18n.page_id
      AND cp.status = 'published'
  ));

DROP POLICY IF EXISTS "cms_page_i18n_editor_write" ON public.cms_page_i18n;
CREATE POLICY "cms_page_i18n_editor_write"
  ON public.cms_page_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "cms_sections_public_read" ON public.cms_sections;
CREATE POLICY "cms_sections_public_read"
  ON public.cms_sections FOR SELECT
  USING (enabled = true AND EXISTS (
    SELECT 1
    FROM public.cms_pages cp
    WHERE cp.id = cms_sections.page_id
      AND cp.status = 'published'
  ));

DROP POLICY IF EXISTS "cms_sections_editor_write" ON public.cms_sections;
CREATE POLICY "cms_sections_editor_write"
  ON public.cms_sections FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "cms_section_i18n_public_read" ON public.cms_section_i18n;
CREATE POLICY "cms_section_i18n_public_read"
  ON public.cms_section_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.cms_sections cs
    JOIN public.cms_pages cp ON cp.id = cs.page_id
    WHERE cs.id = cms_section_i18n.section_id
      AND cs.enabled = true
      AND cp.status = 'published'
  ));

DROP POLICY IF EXISTS "cms_section_i18n_editor_write" ON public.cms_section_i18n;
CREATE POLICY "cms_section_i18n_editor_write"
  ON public.cms_section_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "packages_public_read" ON public.packages;
CREATE POLICY "packages_public_read"
  ON public.packages FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "packages_editor_write" ON public.packages;
CREATE POLICY "packages_editor_write"
  ON public.packages FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "package_i18n_public_read" ON public.package_i18n;
CREATE POLICY "package_i18n_public_read"
  ON public.package_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.packages p
    WHERE p.id = package_i18n.package_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "package_i18n_editor_write" ON public.package_i18n;
CREATE POLICY "package_i18n_editor_write"
  ON public.package_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "itinerary_days_public_read" ON public.package_itinerary_days;
CREATE POLICY "itinerary_days_public_read"
  ON public.package_itinerary_days FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.packages p
    WHERE p.id = package_itinerary_days.package_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "itinerary_days_editor_write" ON public.package_itinerary_days;
CREATE POLICY "itinerary_days_editor_write"
  ON public.package_itinerary_days FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "itinerary_day_i18n_public_read" ON public.package_itinerary_day_i18n;
CREATE POLICY "itinerary_day_i18n_public_read"
  ON public.package_itinerary_day_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.package_itinerary_days d
    JOIN public.packages p ON p.id = d.package_id
    WHERE d.id = package_itinerary_day_i18n.day_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "itinerary_day_i18n_editor_write" ON public.package_itinerary_day_i18n;
CREATE POLICY "itinerary_day_i18n_editor_write"
  ON public.package_itinerary_day_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "itinerary_items_public_read" ON public.package_itinerary_items;
CREATE POLICY "itinerary_items_public_read"
  ON public.package_itinerary_items FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.package_itinerary_days d
    JOIN public.packages p ON p.id = d.package_id
    WHERE d.id = package_itinerary_items.day_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "itinerary_items_editor_write" ON public.package_itinerary_items;
CREATE POLICY "itinerary_items_editor_write"
  ON public.package_itinerary_items FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "itinerary_item_i18n_public_read" ON public.package_itinerary_item_i18n;
CREATE POLICY "itinerary_item_i18n_public_read"
  ON public.package_itinerary_item_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.package_itinerary_items i
    JOIN public.package_itinerary_days d ON d.id = i.day_id
    JOIN public.packages p ON p.id = d.package_id
    WHERE i.id = package_itinerary_item_i18n.item_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "itinerary_item_i18n_editor_write" ON public.package_itinerary_item_i18n;
CREATE POLICY "itinerary_item_i18n_editor_write"
  ON public.package_itinerary_item_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "package_cost_public_read" ON public.package_cost_items;
CREATE POLICY "package_cost_public_read"
  ON public.package_cost_items FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.packages p
    WHERE p.id = package_cost_items.package_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "package_cost_editor_write" ON public.package_cost_items;
CREATE POLICY "package_cost_editor_write"
  ON public.package_cost_items FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "car_rentals_public_read" ON public.car_rentals;
CREATE POLICY "car_rentals_public_read"
  ON public.car_rentals FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "car_rentals_editor_write" ON public.car_rentals;
CREATE POLICY "car_rentals_editor_write"
  ON public.car_rentals FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "car_rental_i18n_public_read" ON public.car_rental_i18n;
CREATE POLICY "car_rental_i18n_public_read"
  ON public.car_rental_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.car_rentals cr
    WHERE cr.id = car_rental_i18n.car_rental_id
      AND cr.status = 'published'
  ));

DROP POLICY IF EXISTS "car_rental_i18n_editor_write" ON public.car_rental_i18n;
CREATE POLICY "car_rental_i18n_editor_write"
  ON public.car_rental_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "package_car_rentals_public_read" ON public.package_car_rentals;
CREATE POLICY "package_car_rentals_public_read"
  ON public.package_car_rentals FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.packages p
    WHERE p.id = package_car_rentals.package_id
      AND p.status = 'published'
  ));

DROP POLICY IF EXISTS "package_car_rentals_editor_write" ON public.package_car_rentals;
CREATE POLICY "package_car_rentals_editor_write"
  ON public.package_car_rentals FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "blog_posts_public_read" ON public.blog_posts;
CREATE POLICY "blog_posts_public_read"
  ON public.blog_posts FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "blog_posts_editor_write" ON public.blog_posts;
CREATE POLICY "blog_posts_editor_write"
  ON public.blog_posts FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "blog_post_i18n_public_read" ON public.blog_post_i18n;
CREATE POLICY "blog_post_i18n_public_read"
  ON public.blog_post_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.blog_posts bp
    WHERE bp.id = blog_post_i18n.post_id
      AND bp.status = 'published'
  ));

DROP POLICY IF EXISTS "blog_post_i18n_editor_write" ON public.blog_post_i18n;
CREATE POLICY "blog_post_i18n_editor_write"
  ON public.blog_post_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "blog_categories_public_read" ON public.blog_categories;
CREATE POLICY "blog_categories_public_read"
  ON public.blog_categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "blog_categories_editor_write" ON public.blog_categories;
CREATE POLICY "blog_categories_editor_write"
  ON public.blog_categories FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "blog_category_i18n_public_read" ON public.blog_category_i18n;
CREATE POLICY "blog_category_i18n_public_read"
  ON public.blog_category_i18n FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "blog_category_i18n_editor_write" ON public.blog_category_i18n;
CREATE POLICY "blog_category_i18n_editor_write"
  ON public.blog_category_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "blog_post_categories_public_read" ON public.blog_post_categories;
CREATE POLICY "blog_post_categories_public_read"
  ON public.blog_post_categories FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.blog_posts bp
    WHERE bp.id = blog_post_categories.post_id
      AND bp.status = 'published'
  ));

DROP POLICY IF EXISTS "blog_post_categories_editor_write" ON public.blog_post_categories;
CREATE POLICY "blog_post_categories_editor_write"
  ON public.blog_post_categories FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "menus_public_read" ON public.menus;
CREATE POLICY "menus_public_read"
  ON public.menus FOR SELECT
  USING (active = true);

DROP POLICY IF EXISTS "menus_editor_write" ON public.menus;
CREATE POLICY "menus_editor_write"
  ON public.menus FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "menu_items_public_read" ON public.menu_items;
CREATE POLICY "menu_items_public_read"
  ON public.menu_items FOR SELECT
  USING (enabled = true AND EXISTS (
    SELECT 1 FROM public.menus m WHERE m.id = menu_items.menu_id AND m.active = true
  ));

DROP POLICY IF EXISTS "menu_items_editor_write" ON public.menu_items;
CREATE POLICY "menu_items_editor_write"
  ON public.menu_items FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "menu_item_i18n_public_read" ON public.menu_item_i18n;
CREATE POLICY "menu_item_i18n_public_read"
  ON public.menu_item_i18n FOR SELECT
  USING (EXISTS (
    SELECT 1
    FROM public.menu_items mi
    JOIN public.menus m ON m.id = mi.menu_id
    WHERE mi.id = menu_item_i18n.menu_item_id
      AND mi.enabled = true
      AND m.active = true
  ));

DROP POLICY IF EXISTS "menu_item_i18n_editor_write" ON public.menu_item_i18n;
CREATE POLICY "menu_item_i18n_editor_write"
  ON public.menu_item_i18n FOR ALL
  USING (public.can_edit_content())
  WITH CHECK (public.can_edit_content());

DROP POLICY IF EXISTS "redirects_public_read" ON public.redirects;
CREATE POLICY "redirects_public_read"
  ON public.redirects FOR SELECT
  USING (enabled = true);

DROP POLICY IF EXISTS "redirects_admin_write" ON public.redirects;
CREATE POLICY "redirects_admin_write"
  ON public.redirects FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_admin_read" ON public.content_audit_logs;
CREATE POLICY "audit_logs_admin_read"
  ON public.content_audit_logs FOR SELECT
  USING (public.is_admin());

DROP POLICY IF EXISTS "audit_logs_editor_insert" ON public.content_audit_logs;
CREATE POLICY "audit_logs_editor_insert"
  ON public.content_audit_logs FOR INSERT
  WITH CHECK (public.can_edit_content());

INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;
