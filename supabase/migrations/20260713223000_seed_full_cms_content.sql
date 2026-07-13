/*
  # Seed initial CMS content from docs-informasi

  Notes:
  - Initial package content is normalized from proposal docs.
  - Conflicting values follow agreed rule: TOTAL/PRICE + core itinerary priority.
  - EN content is provided as publish-ready baseline and can be edited from admin.
*/

UPDATE public.site_settings
SET
  organization_name = 'Sama Sama Tour',
  canonical_base_url = 'https://samasamatour.com',
  default_locale = 'en',
  whatsapp_number = '6282236037774',
  contact_email = 'info@samasamatour.com',
  contact_phone = '+62 822-3603-7774',
  contact_address = 'Indonesia',
  usd_to_idr = 16000,
  usd_last_updated = now(),
  global_seo_title_id = 'Sama Sama Tour - Paket Corporate Outing Indonesia',
  global_seo_title_en = 'Sama Sama Tour - Corporate Outing Packages in Indonesia',
  global_seo_description_id = 'Paket corporate outing 50 pax di Indonesia: Bromo, Borobudur, Karimunjawa, Bandung. Itinerary lengkap dan tim profesional.',
  global_seo_description_en = 'Corporate outing packages for 50 pax across Indonesia: Bromo, Borobudur, Karimunjawa, Bandung with complete itineraries.',
  updated_at = now()
WHERE id = 1;

INSERT INTO public.cms_pages (page_key, status, show_in_sitemap)
VALUES
  ('home', 'published', true),
  ('packages', 'published', true),
  ('blog', 'published', true),
  ('contact', 'published', true),
  ('privacy-policy', 'published', true),
  ('terms', 'published', true)
ON CONFLICT (page_key)
DO UPDATE SET
  status = EXCLUDED.status,
  show_in_sitemap = EXCLUDED.show_in_sitemap,
  updated_at = now();

INSERT INTO public.cms_page_i18n (page_id, locale, title, seo_title, seo_description, canonical_path)
SELECT id, 'id',
  CASE page_key
    WHEN 'home' THEN 'Sama Sama Tour'
    WHEN 'packages' THEN 'Paket Outing'
    WHEN 'blog' THEN 'Blog'
    WHEN 'contact' THEN 'Kontak'
    WHEN 'privacy-policy' THEN 'Kebijakan Privasi'
    WHEN 'terms' THEN 'Syarat dan Ketentuan'
    ELSE page_key
  END,
  CASE page_key
    WHEN 'home' THEN 'Sama Sama Tour - Paket Corporate Outing Indonesia'
    WHEN 'packages' THEN 'Paket Corporate Outing 50 Pax | Sama Sama Tour'
    WHEN 'blog' THEN 'Blog Corporate Outing & Team Building | Sama Sama Tour'
    WHEN 'contact' THEN 'Kontak Sama Sama Tour'
    WHEN 'privacy-policy' THEN 'Kebijakan Privasi | Sama Sama Tour'
    WHEN 'terms' THEN 'Syarat dan Ketentuan | Sama Sama Tour'
    ELSE page_key
  END,
  CASE page_key
    WHEN 'home' THEN 'Program outing dan team building untuk perusahaan di Indonesia dengan itinerary terstruktur dan biaya transparan.'
    WHEN 'packages' THEN 'Pilih paket outing perusahaan untuk Bromo, Borobudur, Bandung, dan Karimunjawa.'
    WHEN 'blog' THEN 'Insight team building, outing perusahaan, dan tips persiapan perjalanan grup.'
    WHEN 'contact' THEN 'Hubungi tim Sama Sama Tour via WhatsApp untuk konsultasi paket.'
    WHEN 'privacy-policy' THEN 'Informasi kebijakan privasi pengguna situs Sama Sama Tour.'
    WHEN 'terms' THEN 'Syarat penggunaan layanan Sama Sama Tour.'
    ELSE page_key
  END,
  CASE page_key
    WHEN 'home' THEN '/id'
    WHEN 'packages' THEN '/id/packages'
    WHEN 'blog' THEN '/id/blog'
    WHEN 'contact' THEN '/id/contact'
    WHEN 'privacy-policy' THEN '/id/privacy-policy'
    WHEN 'terms' THEN '/id/terms'
    ELSE '/id'
  END
FROM public.cms_pages
ON CONFLICT (page_id, locale)
DO UPDATE SET
  title = EXCLUDED.title,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  canonical_path = EXCLUDED.canonical_path;

INSERT INTO public.cms_page_i18n (page_id, locale, title, seo_title, seo_description, canonical_path)
SELECT id, 'en',
  CASE page_key
    WHEN 'home' THEN 'Sama Sama Tour'
    WHEN 'packages' THEN 'Outing Packages'
    WHEN 'blog' THEN 'Blog'
    WHEN 'contact' THEN 'Contact'
    WHEN 'privacy-policy' THEN 'Privacy Policy'
    WHEN 'terms' THEN 'Terms and Conditions'
    ELSE page_key
  END,
  CASE page_key
    WHEN 'home' THEN 'Sama Sama Tour - Corporate Outing Packages in Indonesia'
    WHEN 'packages' THEN '50-Pax Corporate Outing Packages | Sama Sama Tour'
    WHEN 'blog' THEN 'Corporate Outing & Team Building Blog | Sama Sama Tour'
    WHEN 'contact' THEN 'Contact Sama Sama Tour'
    WHEN 'privacy-policy' THEN 'Privacy Policy | Sama Sama Tour'
    WHEN 'terms' THEN 'Terms and Conditions | Sama Sama Tour'
    ELSE page_key
  END,
  CASE page_key
    WHEN 'home' THEN 'Corporate outing and team-building programs across Indonesia with complete itineraries and transparent pricing.'
    WHEN 'packages' THEN 'Choose 50-pax corporate outing packages for Bromo, Borobudur, Bandung, and Karimunjawa.'
    WHEN 'blog' THEN 'Practical insights for team building, corporate outing planning, and group travel preparation.'
    WHEN 'contact' THEN 'Contact Sama Sama Tour on WhatsApp for package consultation.'
    WHEN 'privacy-policy' THEN 'Privacy policy for users of the Sama Sama Tour website.'
    WHEN 'terms' THEN 'Terms and conditions for Sama Sama Tour services.'
    ELSE page_key
  END,
  CASE page_key
    WHEN 'home' THEN '/en'
    WHEN 'packages' THEN '/en/packages'
    WHEN 'blog' THEN '/en/blog'
    WHEN 'contact' THEN '/en/contact'
    WHEN 'privacy-policy' THEN '/en/privacy-policy'
    WHEN 'terms' THEN '/en/terms'
    ELSE '/en'
  END
FROM public.cms_pages
ON CONFLICT (page_id, locale)
DO UPDATE SET
  title = EXCLUDED.title,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  canonical_path = EXCLUDED.canonical_path;

WITH home_page AS (
  SELECT id FROM public.cms_pages WHERE page_key = 'home'
),
upsert_sections AS (
  INSERT INTO public.cms_sections (page_id, section_key, section_type, position, enabled, config)
  SELECT home_page.id, s.section_key, s.section_type, s.position, true, '{}'::jsonb
  FROM home_page
  CROSS JOIN (
    VALUES
      ('hero', 'hero', 1),
      ('trust_points', 'feature-list', 2),
      ('about', 'text', 3),
      ('cta', 'cta', 4)
  ) AS s(section_key, section_type, position)
  ON CONFLICT (page_id, section_key)
  DO UPDATE SET
    section_type = EXCLUDED.section_type,
    position = EXCLUDED.position,
    enabled = true,
    updated_at = now()
  RETURNING id, section_key
)
INSERT INTO public.cms_section_i18n (section_id, locale, content)
SELECT us.id, 'id',
  CASE us.section_key
    WHEN 'hero' THEN jsonb_build_object(
      'heading', 'Corporate Outing yang Berdampak Nyata untuk Tim Anda',
      'subheading', 'Program 50 pax dengan itinerary lengkap, aktivitas team building, dan support tim profesional di destinasi unggulan Indonesia.',
      'ctaLabel', 'Lihat Paket',
      'ctaHref', '/id/packages'
    )
    WHEN 'trust_points' THEN jsonb_build_object(
      'items', jsonb_build_array(
        'Paket detail dengan rundown + cost breakdown',
        'Fokus team building dan bonding perusahaan',
        'Pendampingan profesional tour leader + multimedia',
        'Bisa kustom sesuai kebutuhan perusahaan'
      )
    )
    WHEN 'about' THEN jsonb_build_object(
      'heading', 'Tentang Sama Sama Tour',
      'body', 'Sama Sama Tour mengelola program outing perusahaan dengan pendekatan terstruktur: tujuan kegiatan, alur aktivitas, manajemen logistik, dan evaluasi hasil. Semua paket dapat disesuaikan dengan profil tim dan objektif organisasi.'
    )
    ELSE jsonb_build_object(
      'heading', 'Siap Menyusun Program Outing Perusahaan Anda?',
      'body', 'Diskusikan kebutuhan tim Anda bersama kami. Konsultasi cepat via WhatsApp.',
      'ctaLabel', 'Hubungi via WhatsApp',
      'ctaHref', 'https://wa.me/6282236037774'
    )
  END
FROM upsert_sections us
ON CONFLICT (section_id, locale)
DO UPDATE SET content = EXCLUDED.content;

WITH home_page AS (
  SELECT id FROM public.cms_pages WHERE page_key = 'home'
),
sections AS (
  SELECT cs.id, cs.section_key
  FROM public.cms_sections cs
  JOIN home_page hp ON hp.id = cs.page_id
)
INSERT INTO public.cms_section_i18n (section_id, locale, content)
SELECT s.id, 'en',
  CASE s.section_key
    WHEN 'hero' THEN jsonb_build_object(
      'heading', 'Corporate Outing Programs That Strengthen Teams',
      'subheading', '50-pax programs with complete itineraries, team-building activities, and professional on-ground support across Indonesia.',
      'ctaLabel', 'Explore Packages',
      'ctaHref', '/en/packages'
    )
    WHEN 'trust_points' THEN jsonb_build_object(
      'items', jsonb_build_array(
        'Detailed package with rundown and cost breakdown',
        'Corporate-focused team bonding programs',
        'Professional tour leader and multimedia support',
        'Customizable according to company goals'
      )
    )
    WHEN 'about' THEN jsonb_build_object(
      'heading', 'About Sama Sama Tour',
      'body', 'Sama Sama Tour delivers structured corporate outing programs with clear objectives, activity flow, logistics planning, and measurable outcomes. Every package can be tailored to your team profile and business goals.'
    )
    ELSE jsonb_build_object(
      'heading', 'Ready to Plan Your Company Outing?',
      'body', 'Discuss your team objectives with us and get quick recommendations via WhatsApp.',
      'ctaLabel', 'Chat on WhatsApp',
      'ctaHref', 'https://wa.me/6282236037774'
    )
  END
FROM sections s
ON CONFLICT (section_id, locale)
DO UPDATE SET content = EXCLUDED.content;

INSERT INTO public.media_assets (source_type, source_url, is_active)
VALUES
  ('external', 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=1400&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1610532984141-6c0f103f35d0?auto=format&fit=crop&w=1400&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', true),
  ('external', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.packages (
  code,
  status,
  duration_days,
  duration_nights,
  min_pax,
  max_pax,
  price_idr,
  featured,
  sort_order
)
VALUES
  ('jakarta-borobudur-50', 'published', 2, 1, 50, 50, 1750800, true, 1),
  ('jakarta-pangalengan-50', 'published', 2, 1, 50, 50, 1536000, true, 2),
  ('surabaya-bromo-songa-50', 'published', 2, 1, 50, 50, 1720800, true, 3),
  ('jakarta-bromo-songa-50', 'published', 2, 1, 50, 50, 2164800, true, 4),
  ('jakarta-karimunjawa-50', 'published', 4, 3, 50, 50, 3279600, true, 5)
ON CONFLICT (code)
DO UPDATE SET
  status = EXCLUDED.status,
  duration_days = EXCLUDED.duration_days,
  duration_nights = EXCLUDED.duration_nights,
  min_pax = EXCLUDED.min_pax,
  max_pax = EXCLUDED.max_pax,
  price_idr = EXCLUDED.price_idr,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

UPDATE public.packages p
SET hero_media_id = ma.id
FROM public.media_assets ma
WHERE p.code = 'jakarta-borobudur-50'
  AND ma.source_url = 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=1400&q=80';

UPDATE public.packages p
SET hero_media_id = ma.id
FROM public.media_assets ma
WHERE p.code = 'jakarta-pangalengan-50'
  AND ma.source_url = 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80';

UPDATE public.packages p
SET hero_media_id = ma.id
FROM public.media_assets ma
WHERE p.code = 'surabaya-bromo-songa-50'
  AND ma.source_url = 'https://images.unsplash.com/photo-1610532984141-6c0f103f35d0?auto=format&fit=crop&w=1400&q=80';

UPDATE public.packages p
SET hero_media_id = ma.id
FROM public.media_assets ma
WHERE p.code = 'jakarta-bromo-songa-50'
  AND ma.source_url = 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80';

UPDATE public.packages p
SET hero_media_id = ma.id
FROM public.media_assets ma
WHERE p.code = 'jakarta-karimunjawa-50'
  AND ma.source_url = 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80';

INSERT INTO public.package_i18n (
  package_id,
  locale,
  slug,
  name,
  summary,
  overview,
  includes,
  excludes,
  notes,
  seo_title,
  seo_description
)
SELECT
  p.id,
  'id',
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'jakarta-borobudur-50-pax'
    WHEN 'jakarta-pangalengan-50' THEN 'jakarta-bandung-pangalengan-50-pax'
    WHEN 'surabaya-bromo-songa-50' THEN 'surabaya-bromo-songa-50-pax'
    WHEN 'jakarta-bromo-songa-50' THEN 'jakarta-bromo-songa-50-pax'
    ELSE 'jakarta-karimunjawa-50-pax'
  END,
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'Romantic in Borobudur Villages'
    WHEN 'jakarta-pangalengan-50' THEN 'Bonding at Cileunca Lake'
    WHEN 'surabaya-bromo-songa-50' THEN 'Magical Sunrise Bromo - Start Surabaya'
    WHEN 'jakarta-bromo-songa-50' THEN 'Magical Sunrise Bromo - Start Jakarta'
    ELSE 'Traces of Harmony Karimunjawa'
  END,
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'Program 2D1N dengan outbound, VW village trip, gala dinner, dan rafting Elo River.'
    WHEN 'jakarta-pangalengan-50' THEN 'Program 2D1N outbound + paintball + rafting Situ Cileunca untuk peningkatan kekompakan tim.'
    WHEN 'surabaya-bromo-songa-50' THEN 'Program 2D1N rafting Songa dan sunrise Bromo dengan gala dinner tim.'
    WHEN 'jakarta-bromo-songa-50' THEN 'Program 2D1N jalur Jakarta dengan kombinasi rafting Songa, Bromo sunrise, dan team games.'
    ELSE 'Program 4D3N Jepara-Karimunjawa dengan island hopping, team building, dan gala dinner.'
  END,
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'Paket outing ini dirancang untuk mempererat hubungan tim melalui aktivitas kolaboratif di kawasan Borobudur. Agenda utama meliputi outbound, eksplorasi desa wisata dengan VW, gala dinner interaktif, dan rafting Elo River.'
    WHEN 'jakarta-pangalengan-50' THEN 'Fokus kegiatan pada capacity building dan bonding melalui outbound, paintball, gala dinner, serta rafting di kawasan Cileunca. Cocok untuk perusahaan yang ingin membangun budaya kerja kolaboratif.'
    WHEN 'surabaya-bromo-songa-50' THEN 'Paket singkat untuk perusahaan berbasis Surabaya yang ingin pengalaman intens: rafting Songa, fun team games, gala dinner, lalu sunrise trip Bromo.'
    WHEN 'jakarta-bromo-songa-50' THEN 'Paket keberangkatan Jakarta dengan pengalaman adventure dan bonding: perjalanan darat, rafting Songa, aktivitas tim, gala dinner, dan eksplorasi Bromo.'
    ELSE 'Program corporate gathering 4 hari yang menggabungkan wisata bahari Karimunjawa, island hopping, sesi team building pantai, dan gala dinner.'
  END,
  CASE p.code
    WHEN 'jakarta-karimunjawa-50' THEN '["Transportasi darat + kapal PP","Akomodasi 2 malam","Island hopping + snorkeling","Gala dinner","Asuransi perjalanan"]'::jsonb
    ELSE '["Transportasi utama","Akomodasi sesuai paket","Aktivitas utama sesuai itinerary","Team building facilitation","Dokumentasi dasar"]'::jsonb
  END,
  '["Biaya pribadi","Spot foto berbayar tambahan","Obat-obatan pribadi"]'::jsonb,
  'Harga dan aktivitas dapat disesuaikan kembali berdasarkan kebutuhan akhir perusahaan.',
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'Paket Outing Jakarta-Borobudur 50 Pax | Sama Sama Tour'
    WHEN 'jakarta-pangalengan-50' THEN 'Paket Outing Jakarta-Pangalengan 50 Pax | Sama Sama Tour'
    WHEN 'surabaya-bromo-songa-50' THEN 'Paket Outing Surabaya-Bromo 50 Pax | Sama Sama Tour'
    WHEN 'jakarta-bromo-songa-50' THEN 'Paket Outing Jakarta-Bromo 50 Pax | Sama Sama Tour'
    ELSE 'Paket Outing Jakarta-Karimunjawa 50 Pax | Sama Sama Tour'
  END,
  CASE p.code
    WHEN 'jakarta-karimunjawa-50' THEN 'Paket corporate outing 4D3N Karimunjawa untuk 50 pax dengan itinerary laut, team building, dan gala dinner.'
    ELSE 'Paket corporate outing untuk 50 pax dengan rundown kegiatan, team building, dan biaya terstruktur.'
  END
FROM public.packages p
ON CONFLICT (package_id, locale)
DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  summary = EXCLUDED.summary,
  overview = EXCLUDED.overview,
  includes = EXCLUDED.includes,
  excludes = EXCLUDED.excludes,
  notes = EXCLUDED.notes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

INSERT INTO public.package_i18n (
  package_id,
  locale,
  slug,
  name,
  summary,
  overview,
  includes,
  excludes,
  notes,
  seo_title,
  seo_description
)
SELECT
  p.id,
  'en',
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'jakarta-borobudur-50-pax'
    WHEN 'jakarta-pangalengan-50' THEN 'jakarta-bandung-pangalengan-50-pax'
    WHEN 'surabaya-bromo-songa-50' THEN 'surabaya-bromo-songa-50-pax'
    WHEN 'jakarta-bromo-songa-50' THEN 'jakarta-bromo-songa-50-pax'
    ELSE 'jakarta-karimunjawa-50-pax'
  END,
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'Romantic in Borobudur Villages'
    WHEN 'jakarta-pangalengan-50' THEN 'Bonding at Cileunca Lake'
    WHEN 'surabaya-bromo-songa-50' THEN 'Magical Sunrise Bromo - Surabaya Departure'
    WHEN 'jakarta-bromo-songa-50' THEN 'Magical Sunrise Bromo - Jakarta Departure'
    ELSE 'Traces of Harmony Karimunjawa'
  END,
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN '2D1N program with outbound, VW village trip, gala dinner, and Elo River rafting.'
    WHEN 'jakarta-pangalengan-50' THEN '2D1N outbound + paintball + Cileunca rafting program for stronger team cohesion.'
    WHEN 'surabaya-bromo-songa-50' THEN '2D1N program combining Songa rafting and Bromo sunrise with team gala dinner.'
    WHEN 'jakarta-bromo-songa-50' THEN '2D1N Jakarta route with Songa rafting, Bromo sunrise, and interactive team games.'
    ELSE '4D3N Jepara-Karimunjawa program with island hopping, beach team building, and gala dinner.'
  END,
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'Designed to strengthen team relationships through collaborative activities around Borobudur. The program includes outbound sessions, VW village exploration, interactive gala dinner, and Elo River rafting.'
    WHEN 'jakarta-pangalengan-50' THEN 'Focused on capacity building and team bonding through outbound activities, paintball, gala dinner, and rafting in the Cileunca area.'
    WHEN 'surabaya-bromo-songa-50' THEN 'A compact program for Surabaya-based teams: Songa rafting, team games, gala dinner, and Bromo sunrise trip.'
    WHEN 'jakarta-bromo-songa-50' THEN 'Jakarta departure package combining land travel, Songa rafting, team activities, gala dinner, and Bromo exploration.'
    ELSE 'A 4-day corporate gathering that combines Karimunjawa marine exploration, island hopping, beach team building, and gala dinner.'
  END,
  CASE p.code
    WHEN 'jakarta-karimunjawa-50' THEN '["Land transport and round-trip ferry","2-night accommodation","Island hopping and snorkeling","Gala dinner","Trip insurance"]'::jsonb
    ELSE '["Main transportation","Accommodation as per package","Core activities as per itinerary","Team building facilitation","Basic documentation"]'::jsonb
  END,
  '["Personal expenses","Additional paid photo spots","Personal medicine"]'::jsonb,
  'Pricing and activity details can be adjusted based on final company requirements.',
  CASE p.code
    WHEN 'jakarta-borobudur-50' THEN 'Jakarta-Borobudur Outing Package 50 Pax | Sama Sama Tour'
    WHEN 'jakarta-pangalengan-50' THEN 'Jakarta-Pangalengan Outing Package 50 Pax | Sama Sama Tour'
    WHEN 'surabaya-bromo-songa-50' THEN 'Surabaya-Bromo Outing Package 50 Pax | Sama Sama Tour'
    WHEN 'jakarta-bromo-songa-50' THEN 'Jakarta-Bromo Outing Package 50 Pax | Sama Sama Tour'
    ELSE 'Jakarta-Karimunjawa Outing Package 50 Pax | Sama Sama Tour'
  END,
  CASE p.code
    WHEN 'jakarta-karimunjawa-50' THEN '4D3N corporate outing package for 50 pax in Karimunjawa with marine activities, team building, and gala dinner.'
    ELSE 'Corporate outing package for 50 pax with structured itinerary, team-building sessions, and transparent costs.'
  END
FROM public.packages p
ON CONFLICT (package_id, locale)
DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  summary = EXCLUDED.summary,
  overview = EXCLUDED.overview,
  includes = EXCLUDED.includes,
  excludes = EXCLUDED.excludes,
  notes = EXCLUDED.notes,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

-- Itinerary (core version)
DO $$
DECLARE
  pkg record;
  d1 uuid;
  d2 uuid;
  d3 uuid;
  d4 uuid;
BEGIN
  FOR pkg IN SELECT id, code FROM public.packages LOOP
    DELETE FROM public.package_itinerary_item_i18n
    WHERE item_id IN (
      SELECT i.id
      FROM public.package_itinerary_items i
      JOIN public.package_itinerary_days d ON d.id = i.day_id
      WHERE d.package_id = pkg.id
    );

    DELETE FROM public.package_itinerary_items
    WHERE day_id IN (
      SELECT id FROM public.package_itinerary_days WHERE package_id = pkg.id
    );

    DELETE FROM public.package_itinerary_day_i18n
    WHERE day_id IN (
      SELECT id FROM public.package_itinerary_days WHERE package_id = pkg.id
    );

    DELETE FROM public.package_itinerary_days WHERE package_id = pkg.id;

    IF pkg.code = 'jakarta-borobudur-50' THEN
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 1) RETURNING id INTO d1;
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 2) RETURNING id INTO d2;

      INSERT INTO public.package_itinerary_day_i18n(day_id, locale, title)
      VALUES
        (d1, 'id', 'Day 1 - Transfer, Outbound, VW Village, Gala Dinner'),
        (d1, 'en', 'Day 1 - Transfer, Outbound, VW Village, Gala Dinner'),
        (d2, 'id', 'Day 2 - Rafting Elo River dan Kembali ke Jakarta'),
        (d2, 'en', 'Day 2 - Elo River Rafting and Return to Jakarta');

      INSERT INTO public.package_itinerary_items(day_id, position, time_label) VALUES
        (d1, 1, '06:00'), (d1, 2, '08:00'), (d1, 3, '11:00'), (d1, 4, '18:30'),
        (d2, 1, '08:00'), (d2, 2, '12:00'), (d2, 3, '21:00');

    ELSIF pkg.code = 'jakarta-pangalengan-50' THEN
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 1) RETURNING id INTO d1;
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 2) RETURNING id INTO d2;

      INSERT INTO public.package_itinerary_day_i18n(day_id, locale, title)
      VALUES
        (d1, 'id', 'Day 1 - Outbound, Paintball, Gala Dinner Cileunca'),
        (d1, 'en', 'Day 1 - Outbound, Paintball, Cileunca Gala Dinner'),
        (d2, 'id', 'Day 2 - Rafting Situ Cileunca dan Return Jakarta'),
        (d2, 'en', 'Day 2 - Situ Cileunca Rafting and Return to Jakarta');

      INSERT INTO public.package_itinerary_items(day_id, position, time_label) VALUES
        (d1, 1, '06:00'), (d1, 2, '11:00'), (d1, 3, '18:00'),
        (d2, 1, '08:00'), (d2, 2, '13:00'), (d2, 3, '18:00');

    ELSIF pkg.code = 'surabaya-bromo-songa-50' THEN
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 1) RETURNING id INTO d1;
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 2) RETURNING id INTO d2;

      INSERT INTO public.package_itinerary_day_i18n(day_id, locale, title)
      VALUES
        (d1, 'id', 'Day 1 - Songa Rafting, Team Games, Gala Dinner'),
        (d1, 'en', 'Day 1 - Songa Rafting, Team Games, Gala Dinner'),
        (d2, 'id', 'Day 2 - Sunrise Bromo dan Return Surabaya'),
        (d2, 'en', 'Day 2 - Bromo Sunrise and Return to Surabaya');

      INSERT INTO public.package_itinerary_items(day_id, position, time_label) VALUES
        (d1, 1, '09:00'), (d1, 2, '12:00'), (d1, 3, '18:30'),
        (d2, 1, '03:00'), (d2, 2, '04:30'), (d2, 3, '13:00');

    ELSIF pkg.code = 'jakarta-bromo-songa-50' THEN
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 1) RETURNING id INTO d1;
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 2) RETURNING id INTO d2;

      INSERT INTO public.package_itinerary_day_i18n(day_id, locale, title)
      VALUES
        (d1, 'id', 'Day 1 - Transfer Jakarta, Rafting Songa, Gala Dinner'),
        (d1, 'en', 'Day 1 - Jakarta Transfer, Songa Rafting, Gala Dinner'),
        (d2, 'id', 'Day 2 - Sunrise Bromo dan Return Jakarta'),
        (d2, 'en', 'Day 2 - Bromo Sunrise and Return to Jakarta');

      INSERT INTO public.package_itinerary_items(day_id, position, time_label) VALUES
        (d1, 1, '15:00'), (d1, 2, '10:00'), (d1, 3, '18:30'),
        (d2, 1, '03:00'), (d2, 2, '04:30'), (d2, 3, '13:00');

    ELSE
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 1) RETURNING id INTO d1;
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 2) RETURNING id INTO d2;
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 3) RETURNING id INTO d3;
      INSERT INTO public.package_itinerary_days(package_id, day_number) VALUES (pkg.id, 4) RETURNING id INTO d4;

      INSERT INTO public.package_itinerary_day_i18n(day_id, locale, title)
      VALUES
        (d1, 'id', 'Day 1 - Transfer ke Jepara'),
        (d1, 'en', 'Day 1 - Transfer to Jepara'),
        (d2, 'id', 'Day 2 - Ferry dan Explore Karimunjawa'),
        (d2, 'en', 'Day 2 - Ferry and Karimunjawa Exploration'),
        (d3, 'id', 'Day 3 - Island Hopping dan Team Building Pantai'),
        (d3, 'en', 'Day 3 - Island Hopping and Beach Team Building'),
        (d4, 'id', 'Day 4 - Return Jepara dan Kembali ke Jakarta'),
        (d4, 'en', 'Day 4 - Return to Jepara and Transfer to Jakarta');

      INSERT INTO public.package_itinerary_items(day_id, position, time_label) VALUES
        (d1, 1, '21:00'),
        (d2, 1, '07:00'), (d2, 2, '12:00'), (d2, 3, '19:00'),
        (d3, 1, '08:00'), (d3, 2, '12:00'), (d3, 3, '19:00'),
        (d4, 1, '11:00'), (d4, 2, '15:00'), (d4, 3, '23:00');
    END IF;

    INSERT INTO public.package_itinerary_item_i18n (item_id, locale, activity, details)
    SELECT i.id, 'id',
      CASE i.position
        WHEN 1 THEN 'Sesi awal kegiatan'
        WHEN 2 THEN 'Aktivitas utama paket'
        WHEN 3 THEN 'Sesi penutup hari'
        ELSE 'Aktivitas tambahan'
      END,
      'Detail aktivitas dapat disesuaikan sesuai kebutuhan perusahaan.'
    FROM public.package_itinerary_items i
    JOIN public.package_itinerary_days d ON d.id = i.day_id
    WHERE d.package_id = pkg.id;

    INSERT INTO public.package_itinerary_item_i18n (item_id, locale, activity, details)
    SELECT i.id, 'en',
      CASE i.position
        WHEN 1 THEN 'Initial session'
        WHEN 2 THEN 'Core package activity'
        WHEN 3 THEN 'Day closing session'
        ELSE 'Additional activity'
      END,
      'Activity details can be adjusted based on company requirements.'
    FROM public.package_itinerary_items i
    JOIN public.package_itinerary_days d ON d.id = i.day_id
    WHERE d.package_id = pkg.id;

    DELETE FROM public.package_cost_items WHERE package_id = pkg.id;

    IF pkg.code = 'jakarta-borobudur-50' THEN
      INSERT INTO public.package_cost_items(package_id, cost_group, day_number, position, label, amount_idr)
      VALUES
        (pkg.id, 'day', 1, 1, 'Total biaya Day 1', 59600000),
        (pkg.id, 'day', 2, 1, 'Total biaya Day 2', 13350000),
        (pkg.id, 'summary', null, 1, 'Total akomodasi perjalanan', 72950000),
        (pkg.id, 'fee', null, 1, 'Coordination fee, insurance, crew', 14590000),
        (pkg.id, 'total', null, 1, 'Grand total', 87540000);

    ELSIF pkg.code = 'jakarta-pangalengan-50' THEN
      INSERT INTO public.package_cost_items(package_id, cost_group, day_number, position, label, amount_idr)
      VALUES
        (pkg.id, 'day', 1, 1, 'Total biaya Day 1', 43750000),
        (pkg.id, 'day', 2, 1, 'Total biaya Day 2', 20250000),
        (pkg.id, 'summary', null, 1, 'Total biaya perjalanan', 64000000),
        (pkg.id, 'fee', null, 1, 'Coordination fee + tax + service', 12800000),
        (pkg.id, 'total', null, 1, 'Grand total', 76800000);

    ELSIF pkg.code = 'surabaya-bromo-songa-50' THEN
      INSERT INTO public.package_cost_items(package_id, cost_group, day_number, position, label, amount_idr)
      VALUES
        (pkg.id, 'day', 1, 1, 'Total biaya Day 1', 57000000),
        (pkg.id, 'day', 2, 1, 'Total biaya Day 2', 14700000),
        (pkg.id, 'summary', null, 1, 'Total perjalanan', 71700000),
        (pkg.id, 'fee', null, 1, 'Coordination fee + service', 14340000),
        (pkg.id, 'total', null, 1, 'Grand total', 86040000);

    ELSIF pkg.code = 'jakarta-bromo-songa-50' THEN
      INSERT INTO public.package_cost_items(package_id, cost_group, day_number, position, label, amount_idr)
      VALUES
        (pkg.id, 'day', 1, 1, 'Total biaya Day 1', 73500000),
        (pkg.id, 'day', 2, 1, 'Total biaya Day 2', 16700000),
        (pkg.id, 'summary', null, 1, 'Total perjalanan', 90200000),
        (pkg.id, 'fee', null, 1, 'Coordination fee + service', 18040000),
        (pkg.id, 'total', null, 1, 'Grand total', 108240000);

    ELSE
      INSERT INTO public.package_cost_items(package_id, cost_group, day_number, position, label, amount_idr)
      VALUES
        (pkg.id, 'day', 1, 1, 'Total biaya Day 1', 19250000),
        (pkg.id, 'day', 2, 1, 'Total biaya Day 2', 93050000),
        (pkg.id, 'day', 3, 1, 'Total biaya Day 3', 18750000),
        (pkg.id, 'day', 4, 1, 'Total biaya Day 4', 5600000),
        (pkg.id, 'summary', null, 1, 'Total akomodasi perjalanan', 136650000),
        (pkg.id, 'fee', null, 1, 'Coordination fee, insurance, service', 27330000),
        (pkg.id, 'total', null, 1, 'Grand total', 163980000);
    END IF;
  END LOOP;
END $$;

INSERT INTO public.car_rentals (
  code,
  status,
  price_idr,
  seats,
  transmission,
  has_ac,
  luggage_capacity,
  image_media_id
)
SELECT
  c.code,
  'published',
  c.price_idr,
  c.seats,
  c.transmission,
  true,
  c.luggage,
  ma.id
FROM (
  VALUES
    ('toyota-avanza', 500000::bigint, 7, 'Manual', 3, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80'),
    ('toyota-innova', 700000::bigint, 7, 'Automatic', 4, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'),
    ('toyota-hiace', 1200000::bigint, 12, 'Manual', 8, 'https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80')
) AS c(code, price_idr, seats, transmission, luggage, image_url)
LEFT JOIN public.media_assets ma ON ma.source_url = c.image_url
ON CONFLICT (code)
DO UPDATE SET
  status = EXCLUDED.status,
  price_idr = EXCLUDED.price_idr,
  seats = EXCLUDED.seats,
  transmission = EXCLUDED.transmission,
  has_ac = EXCLUDED.has_ac,
  luggage_capacity = EXCLUDED.luggage_capacity,
  image_media_id = EXCLUDED.image_media_id,
  updated_at = now();

INSERT INTO public.car_rental_i18n (car_rental_id, locale, slug, name, description, seo_title, seo_description)
SELECT id, 'id',
  CASE code
    WHEN 'toyota-avanza' THEN 'toyota-avanza'
    WHEN 'toyota-innova' THEN 'toyota-innova'
    ELSE 'toyota-hiace'
  END,
  CASE code
    WHEN 'toyota-avanza' THEN 'Toyota Avanza'
    WHEN 'toyota-innova' THEN 'Toyota Innova'
    ELSE 'Toyota HiAce'
  END,
  'Armada add-on untuk mendukung mobilitas kegiatan perusahaan di destinasi.',
  'Sewa ' || CASE code WHEN 'toyota-avanza' THEN 'Toyota Avanza' WHEN 'toyota-innova' THEN 'Toyota Innova' ELSE 'Toyota HiAce' END || ' | Sama Sama Tour',
  'Layanan rental mobil add-on untuk paket outing perusahaan.'
FROM public.car_rentals
ON CONFLICT (car_rental_id, locale)
DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

INSERT INTO public.car_rental_i18n (car_rental_id, locale, slug, name, description, seo_title, seo_description)
SELECT id, 'en',
  CASE code
    WHEN 'toyota-avanza' THEN 'toyota-avanza'
    WHEN 'toyota-innova' THEN 'toyota-innova'
    ELSE 'toyota-hiace'
  END,
  CASE code
    WHEN 'toyota-avanza' THEN 'Toyota Avanza'
    WHEN 'toyota-innova' THEN 'Toyota Innova'
    ELSE 'Toyota HiAce'
  END,
  'Add-on fleet options to support team mobility during the outing program.',
  'Rent ' || CASE code WHEN 'toyota-avanza' THEN 'Toyota Avanza' WHEN 'toyota-innova' THEN 'Toyota Innova' ELSE 'Toyota HiAce' END || ' | Sama Sama Tour',
  'Add-on car rental service for corporate outing packages.'
FROM public.car_rentals
ON CONFLICT (car_rental_id, locale)
DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description;

INSERT INTO public.package_car_rentals (package_id, car_rental_id, position)
SELECT p.id, c.id, row_number() OVER (PARTITION BY p.id ORDER BY c.code)
FROM public.packages p
CROSS JOIN public.car_rentals c
ON CONFLICT (package_id, car_rental_id)
DO UPDATE SET position = EXCLUDED.position;

INSERT INTO public.blog_categories DEFAULT VALUES ON CONFLICT DO NOTHING;

-- Create a stable category set if still empty
DO $$
DECLARE
  cat1 uuid;
  cat2 uuid;
  post1 uuid;
  post2 uuid;
  cover1 uuid;
  cover2 uuid;
BEGIN
  SELECT id INTO cover1 FROM public.media_assets
  WHERE source_url = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1400&q=80'
  LIMIT 1;

  SELECT id INTO cover2 FROM public.media_assets
  WHERE source_url = 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80'
  LIMIT 1;

  INSERT INTO public.blog_categories DEFAULT VALUES RETURNING id INTO cat1;
  INSERT INTO public.blog_categories DEFAULT VALUES RETURNING id INTO cat2;

  INSERT INTO public.blog_category_i18n(category_id, locale, slug, name)
  VALUES
    (cat1, 'id', 'team-building', 'Team Building'),
    (cat1, 'en', 'team-building', 'Team Building'),
    (cat2, 'id', 'travel-planning', 'Perencanaan Perjalanan'),
    (cat2, 'en', 'travel-planning', 'Travel Planning');

  INSERT INTO public.blog_posts(status, cover_media_id, published_at)
  VALUES ('published', cover1, now())
  RETURNING id INTO post1;

  INSERT INTO public.blog_posts(status, cover_media_id, published_at)
  VALUES ('published', cover2, now())
  RETURNING id INTO post2;

  INSERT INTO public.blog_post_i18n(
    post_id, locale, slug, title, excerpt, content_markdown, seo_title, seo_description
  ) VALUES
    (
      post1,
      'id',
      'checklist-outing-perusahaan-50-pax',
      'Checklist Outing Perusahaan 50 Pax agar Program Lebih Efektif',
      'Panduan ringkas menyusun program outing 50 pax dengan tujuan yang jelas dan eksekusi terukur.',
      E'# Checklist Outing Perusahaan 50 Pax\n\nAgar outing perusahaan benar-benar berdampak, pastikan Anda menyusun tujuan program, komposisi aktivitas, pembagian peran panitia, dan skenario mitigasi risiko.\n\n## Prioritas Persiapan\n- Definisikan objective utama (bonding, leadership, problem solving).\n- Kunci timeline dan titik keputusan.\n- Pastikan alur komunikasi antar-divisi.\n\n## Saat Program Berjalan\n- Gunakan fasilitator profesional.\n- Dokumentasikan momen kunci untuk evaluasi internal.',
      'Checklist Outing Perusahaan 50 Pax | Sama Sama Tour',
      'Panduan persiapan outing 50 pax: objective, rundown, logistik, dan evaluasi program.'
    ),
    (
      post1,
      'en',
      'corporate-outing-50-pax-checklist',
      'Corporate Outing 50-Pax Checklist for Better Outcomes',
      'A practical guide to planning 50-pax outing programs with clear goals and measurable execution.',
      E'# Corporate Outing 50-Pax Checklist\n\nTo make your outing truly effective, define measurable goals, activity flow, role ownership, and risk mitigation early.\n\n## Preparation Priorities\n- Define core objectives (bonding, leadership, problem solving).\n- Lock timeline and decision points.\n- Build clear cross-team communication.\n\n## During Execution\n- Use professional facilitators.\n- Capture key moments for internal review.',
      'Corporate Outing 50-Pax Checklist | Sama Sama Tour',
      'Practical planning checklist for 50-pax corporate outing programs.'
    ),
    (
      post2,
      'id',
      'cara-membaca-rincian-biaya-paket-outing',
      'Cara Membaca Rincian Biaya Paket Outing agar Tidak Overbudget',
      'Tips memahami struktur biaya day-by-day, fee, dan total agar keputusan lebih tepat.',
      E'# Cara Membaca Rincian Biaya Paket Outing\n\nRincian biaya yang baik harus memisahkan komponen day cost, fee koordinasi, dan total keseluruhan. Dengan format ini, perusahaan dapat melakukan validasi anggaran lebih cepat.\n\n## Komponen Utama\n- Biaya aktivitas harian\n- Biaya akomodasi dan transportasi\n- Fee koordinasi, service, dan contingency\n\n## Rekomendasi\nLakukan final alignment biaya minimal H-14 sebelum keberangkatan.',
      'Cara Membaca Biaya Paket Outing | Sama Sama Tour',
      'Panduan memahami cost breakdown paket outing perusahaan agar kontrol budget lebih akurat.'
    ),
    (
      post2,
      'en',
      'how-to-read-outing-cost-breakdown',
      'How to Read an Outing Package Cost Breakdown',
      'Understand day-by-day costs, coordination fees, and total budget to avoid overrun.',
      E'# How to Read an Outing Package Cost Breakdown\n\nA reliable cost breakdown should separate day costs, coordination fees, and grand total. This structure helps companies validate budget decisions faster.\n\n## Core Components\n- Daily activity costs\n- Accommodation and transportation\n- Coordination, service, and contingency fees\n\n## Recommendation\nRun final budget alignment at least 14 days before departure.',
      'How to Read Outing Cost Breakdown | Sama Sama Tour',
      'Guide to understanding corporate outing cost structures and budget control.'
    );

  INSERT INTO public.blog_post_categories(post_id, category_id)
  VALUES
    (post1, cat1),
    (post2, cat2);
END $$;

INSERT INTO public.menus (code, location, active)
VALUES
  ('header-main', 'header', true),
  ('footer-main', 'footer', true)
ON CONFLICT (code)
DO UPDATE SET
  active = EXCLUDED.active,
  updated_at = now();

DO $$
DECLARE
  header_id uuid;
  footer_id uuid;
  item_home uuid;
  item_packages uuid;
  item_blog uuid;
  item_contact uuid;
  item_privacy uuid;
  item_terms uuid;
BEGIN
  SELECT id INTO header_id FROM public.menus WHERE code = 'header-main';
  SELECT id INTO footer_id FROM public.menus WHERE code = 'footer-main';

  DELETE FROM public.menu_item_i18n WHERE menu_item_id IN (
    SELECT id FROM public.menu_items WHERE menu_id IN (header_id, footer_id)
  );
  DELETE FROM public.menu_items WHERE menu_id IN (header_id, footer_id);

  INSERT INTO public.menu_items(menu_id, kind, href, position, enabled)
  VALUES (header_id, 'internal', '/{locale}', 1, true)
  RETURNING id INTO item_home;

  INSERT INTO public.menu_items(menu_id, kind, href, position, enabled)
  VALUES (header_id, 'internal', '/{locale}/packages', 2, true)
  RETURNING id INTO item_packages;

  INSERT INTO public.menu_items(menu_id, kind, href, position, enabled)
  VALUES (header_id, 'internal', '/{locale}/blog', 3, true)
  RETURNING id INTO item_blog;

  INSERT INTO public.menu_items(menu_id, kind, href, position, enabled)
  VALUES (header_id, 'cta', 'https://wa.me/6282236037774', 4, true)
  RETURNING id INTO item_contact;

  INSERT INTO public.menu_item_i18n(menu_item_id, locale, label)
  VALUES
    (item_home, 'id', 'Beranda'),
    (item_home, 'en', 'Home'),
    (item_packages, 'id', 'Paket'),
    (item_packages, 'en', 'Packages'),
    (item_blog, 'id', 'Blog'),
    (item_blog, 'en', 'Blog'),
    (item_contact, 'id', 'WhatsApp'),
    (item_contact, 'en', 'WhatsApp');

  INSERT INTO public.menu_items(menu_id, kind, href, position, enabled)
  VALUES (footer_id, 'internal', '/{locale}/privacy-policy', 1, true)
  RETURNING id INTO item_privacy;

  INSERT INTO public.menu_items(menu_id, kind, href, position, enabled)
  VALUES (footer_id, 'internal', '/{locale}/terms', 2, true)
  RETURNING id INTO item_terms;

  INSERT INTO public.menu_item_i18n(menu_item_id, locale, label)
  VALUES
    (item_privacy, 'id', 'Kebijakan Privasi'),
    (item_privacy, 'en', 'Privacy Policy'),
    (item_terms, 'id', 'Syarat & Ketentuan'),
    (item_terms, 'en', 'Terms & Conditions');
END $$;

INSERT INTO public.redirects (from_path, to_path, status_code, enabled)
VALUES
  ('/destination/bali', '/en/packages', 301, true),
  ('/destination/lombok', '/en/packages', 301, true),
  ('/destination/yogyakarta', '/en/packages/jakarta-borobudur-50-pax', 301, true),
  ('/destination/komodo', '/en/packages/jakarta-bromo-songa-50-pax', 301, true),
  ('/destination/raja-ampat', '/en/packages/jakarta-karimunjawa-50-pax', 301, true),
  ('/destination/toraja', '/en/packages/surabaya-bromo-songa-50-pax', 301, true)
ON CONFLICT (from_path)
DO UPDATE SET
  to_path = EXCLUDED.to_path,
  status_code = EXCLUDED.status_code,
  enabled = EXCLUDED.enabled,
  updated_at = now();
