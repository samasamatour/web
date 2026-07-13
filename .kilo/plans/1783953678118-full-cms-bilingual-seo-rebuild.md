# Rencana Implementasi: Rombak Total Website + Full CMS + SEO Bilingual

## 1) Tujuan
Membangun ulang website `samasamatour.com` menjadi platform corporate outing bilingual (ID/EN) berbasis Supabase dengan:
- Konten awal dari 5 dokumen di `docs-informasi`.
- Admin CMS penuh untuk semua halaman utama + blog + setting SEO.
- SEO technical lengkap untuk market global.
- Tetap memakai WhatsApp sebagai kanal konversi utama.

## 2) Keputusan Final (hasil klarifikasi)
- Konten lama (Bali/Lombok/etc) **diganti total** mengikuti dokumen.
- Admin auth: **Supabase Auth** + role berbasis database, bootstrap otomatis dari env.
- Bahasa: **path locale** (`/id`, `/en`) + `hreflang` + canonical.
- Root `/`: auto-detect `Accept-Language`, fallback ke `/en`.
- Domain canonical final: **`https://samasamatour.com`**.
- Data dokumen yang bentrok: prioritaskan bagian **TOTAL/PRICE + itinerary inti**, sisanya editable via admin.
- CMS scope: **lengkap** (Home semua section, Package detail, Blog, Navbar/Footer, Contact, Privacy, Terms, global SEO settings).
- Blog: workflow **draft/published**.
- Harga: tampilkan **IDR + estimasi USD**, kurs manual dari admin setting.
- Car rental: **tetap ada** sebagai modul produk add-on.
- Media: admin input link Google Drive publik; DB simpan link; frontend via **image proxy + cache** (tidak upload manual ke Supabase Storage).
- Redirect legacy URL: **aktifkan 301**.
- Lead management: **tetap WhatsApp-only** (tanpa form inquiry DB).
- Sinkronisasi dokumen: **import awal satu kali**, selanjutnya edit lewat CMS.

## 3) Kondisi Saat Ini (yang perlu dirombak)
- Schema Supabase masih sangat sederhana (`destinations`, `testimonials`) dan belum cocok untuk itinerary/cost breakdown/bilingual/CMS.
- Frontend masih hard-coded generic tourism + metadata lama (`samamatour.com`).
- Halaman destination masih itinerary dummy 3 hari.
- SEO belum lengkap: belum ada dynamic sitemap/hreflang/canonical per locale/redirect strategy.
- `src/app/page.tsx` memakai `force-dynamic` dan query `select('*')` tanpa optimasi kolom.

## 4) Arsitektur Target

### 4.1 Routing publik
- `/` -> middleware redirect ke `/id` atau `/en`.
- `/{locale}`: homepage CMS-driven.
- `/{locale}/packages`
- `/{locale}/packages/{slug}`
- `/{locale}/blog`
- `/{locale}/blog/{slug}`
- `/{locale}/privacy-policy`
- `/{locale}/terms`
- Legacy redirect: `/destination/{id}` -> path baru relevan via tabel redirect.

### 4.2 Routing admin (1 app, `/admin`)
- `/admin/login`
- `/admin` dashboard
- `/admin/pages` (block-based sections)
- `/admin/packages`
- `/admin/car-rentals`
- `/admin/blog`
- `/admin/menus`
- `/admin/settings` (SEO global, contact, kurs USD)
- `/admin/redirects`

### 4.3 Data model Supabase (baru, bertahap)
Tambahkan migration baru (tanpa drop tabel lama dulu):

- Auth/role
  - `user_roles(user_id, role, assigned_at)`

- Global settings
  - `site_settings` (singleton): `canonical_base_url`, `default_locale`, `whatsapp_number`, `usd_to_idr`, `last_fx_update`, dll.

- CMS umum
  - `cms_pages`
  - `cms_page_i18n` (title, slug, seo_title, seo_desc, robots, canonical_override)
  - `cms_sections`
  - `cms_section_i18n` (block content per locale)

- Paket outing
  - `packages` (status, duration, pax, price_idr, featured, hero_image)
  - `package_i18n` (name, slug, summary, overview, includes, excludes, seo fields)
  - `package_itinerary_days`
  - `package_itinerary_items_i18n` (jam, aktivitas, deskripsi)
  - `package_cost_items` (kategori day/total, amount_idr)

- Car rental add-on
  - `car_rentals`
  - `car_rental_i18n`

- Blog
  - `blog_posts` (status, published_at, cover_image)
  - `blog_post_i18n` (slug, title, excerpt, content, seo fields)
  - `blog_categories`, `blog_category_i18n`, `blog_post_categories`

- Menu/footer
  - `menus`, `menu_items`, `menu_item_i18n`

- SEO/redirect
  - `redirects(from_path, to_path, status_code)`

- Optional operasional
  - `content_audit_logs` (jejak perubahan admin)

### 4.4 RLS & keamanan
- Public hanya bisa `SELECT` konten `published`.
- Semua write CMS hanya role `admin/editor`.
- `site_settings`, `redirects`, publish action: admin-only.
- Bootstrap admin awal dari env (mis. `CMS_ADMIN_EMAILS`) saat login pertama.
- Middleware guard untuk `/admin/*`.

### 4.5 SEO global
- Metadata locale-aware per halaman.
- `alternates.languages` + `hreflang` (`id-ID`, `en`).
- Canonical dari `site_settings.canonical_base_url` (`https://samasamatour.com`).
- Dynamic `sitemap.xml` (pages + packages + blog + images jika tersedia).
- Dynamic `robots.txt` (allow + sitemap URL).
- JSON-LD:
  - Organization/TravelAgency (global)
  - Product/Offer + Trip itinerary (package detail)
  - BlogPosting (article)
  - BreadcrumbList
- Redirect 301 untuk URL lama.

### 4.6 Media Google Drive
- Admin input URL Drive publik.
- Simpan `source_url` + `drive_file_id` di DB.
- Gunakan route proxy image (cache + content-type check + fallback placeholder).
- Next Image pakai URL internal proxy agar performa lebih stabil.

## 5) Rencana Implementasi Berurutan

1. **Fondasi schema & auth admin**
   - Buat migration tabel baru + indexes + constraints.
   - Tambah helper role check + policy RLS.
   - Implement bootstrap role admin dari env.

2. **Refactor routing i18n + shell layout**
   - Pindahkan frontend ke locale segment (`/[locale]`).
   - Implement middleware language detection + admin protection.
   - Update metadata base URL ke `samasamatour.com`.

3. **Bangun admin CMS penuh (block-based)**
   - CRUD page/section/menu/settings.
   - CRUD packages, itinerary, costs, includes/excludes.
   - CRUD car rental add-on.
   - CRUD blog + kategori + publish workflow.

4. **Import konten awal dari 5 dokumen**
   - Buat script impor satu kali: parsing dokumen -> mapping tabel baru.
   - Prioritaskan total/price + itinerary inti bila ada konflik data.
   - Isi konten EN awal manual placeholder-draft (agar admin bisa lengkapi).

5. **Render frontend dari CMS data**
   - Home, package listing/detail, blog listing/detail, legal pages dari DB.
   - WhatsApp CTA tetap utama di seluruh funnel.
   - Tampilkan harga IDR + estimasi USD (kurs dari settings).

6. **Implement SEO lengkap + redirects**
   - Dynamic sitemap/robots/hreflang/canonical/JSON-LD.
   - Generate dan apply legacy redirects (`/destination/*` -> slug baru).

7. **Performa & hardening Supabase query**
   - Ganti query `select('*')` ke kolom spesifik.
   - Tambahkan index untuk slug/status/published_at/locale.
   - Hapus penggunaan `force-dynamic` yang tidak perlu; pakai revalidate/cache tag.

8. **QA end-to-end & go-live checklist**
   - Validasi admin CRUD, i18n route, SEO tags, redirects, image proxy.
   - Final content pass ID+EN di admin sebelum publish penuh.

## 6) Mapping Data Awal dari Dokumen
- Buat 5 package record utama:
  - Jakarta - Borobudur (50 pax)
  - Jakarta - Bandung/Pangalengan (50 pax)
  - Surabaya - Bromo Songa (50 pax)
  - Jakarta - Bromo Songa (50 pax)
  - Jakarta - Karimunjawa (50 pax)
- Untuk tiap package import:
  - overview
  - itinerary per day
  - cost breakdown day-by-day + total
  - include/exclude
  - price per pax
  - catatan khusus
- Data yang kontradiktif disimpan dengan nilai prioritas (TOTAL/PRICE), lalu admin bisa koreksi dari panel.

## 7) Risiko & Mitigasi
- **Drive hotlink/down** -> image proxy + cache + fallback placeholder.
- **RLS salah konfigurasi (admin terkunci)** -> seed admin env + SQL emergency script.
- **Konten EN belum lengkap** -> status draft sampai SEO fields minimal terisi.
- **Broken internal links setelah rombak** -> tabel redirect + crawler check sebelum publish.
- **Kualitas SEO turun saat migrasi** -> canonical konsisten + 301 + sitemap baru di-submit.

## 8) Validasi Wajib
- Build/lint/typecheck sukses.
- Semua route ID/EN terbuka dan canonical tepat.
- `sitemap.xml` berisi URL published ID+EN.
- `robots.txt` menunjuk sitemap final.
- JSON-LD valid (Organization, Package/Product, BlogPosting).
- Admin dapat CRUD semua modul yang disepakati.
- Redirect URL lama bekerja (301).
- Harga USD berubah saat kurs di admin settings diubah.

## 9) Rollout & Transisi
- Tahap 1: deploy schema + admin + route baru (tetap simpan tabel lama).
- Tahap 2: import konten dokumen + review admin.
- Tahap 3: publish full bilingual + aktifkan redirects.
- Tahap 4: monitor Search Console (coverage, hreflang, crawl error) dan perbaiki cepat.

## 10) Out of Scope (fase ini)
- Payment gateway / checkout online.
- Form lead non-WhatsApp.
- Integrasi Google Drive OAuth private file.
