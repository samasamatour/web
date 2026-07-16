import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  getPageByKey,
  getPublishedPackages,
  getSiteSettings,
  getBlogPosts,
  type PackageListItem,
} from '@/lib/cms/queries';
import { Locale, isLocale, t } from '@/lib/i18n';
import { metadataAlternates } from '@/lib/site';
import { SectionRenderer } from '@/components/site/SectionRenderer';
import { PackageCard } from '@/components/site/PackageCard';
import { BlogCard } from '@/components/site/BlogCard';
import { HeroCarousel, HeroSlide } from '@/components/site/HeroCarousel';
import { isProxyImageUrl, toImageProxyUrl } from '@/lib/media';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const [page, settings] = await Promise.all([
    getPageByKey(locale, 'home'),
    getSiteSettings(),
  ]);

  const title =
    page?.seoTitle ||
    (locale === 'id' ? settings.global_seo_title_id : settings.global_seo_title_en) ||
    'Sama Sama Tour';

  const description =
    page?.seoDescription ||
    (locale === 'id' ? settings.global_seo_description_id : settings.global_seo_description_en) ||
    'Corporate outing packages in Indonesia';

  return {
    title,
    description,
    alternates: metadataAlternates(locale),
    robots: page?.robots || 'index,follow',
    openGraph: {
      type: 'website',
      title,
      description,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

function inferLocationFromSlug(slug: string): string {
  if (slug.includes('bromo')) return 'East Java';
  if (slug.includes('borobudur')) return 'Central Java';
  if (slug.includes('karimunjawa')) return 'Java Sea';
  if (slug.includes('pangalengan') || slug.includes('bandung')) return 'West Java';
  return 'Indonesia';
}

// ─── Stats ─────────────────────────────────────────────────────────────────
function StatsBar({ locale }: { locale: Locale }) {
  const stats = [
    { value: '5', label: t(locale, 'Destinasi', 'Destinations'), icon: '🗺️' },
    { value: '50', label: t(locale, 'Pax / Grup', 'Pax / Group'), icon: '👥' },
    { value: '4D3N', label: t(locale, 'Paket Terlama', 'Longest Package'), icon: '📅' },
    { value: '2', label: t(locale, 'Bahasa', 'Languages'), icon: '🌏' },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white px-6 py-8 shadow-sm">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
            <span className="text-3xl">{stat.icon}</span>
            <span className="text-3xl font-extrabold tracking-tight text-brand-dark">
              {stat.value}
            </span>
            <span className="text-sm font-medium text-slate-500">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Destinations grid ─────────────────────────────────────────────────────
function DestinationsSection({
  locale,
  packages,
}: {
  locale: Locale;
  packages: PackageListItem[];
}) {
  const destinations = packages
    .filter((pkg) => pkg.heroImageUrl)
    .slice(0, 4)
    .map((pkg) => ({
      name: pkg.name,
      tag: inferLocationFromSlug(pkg.slug),
      image: pkg.heroImageUrl,
      cacheKey: pkg.imageCacheKey,
      slug: pkg.slug,
    }));

  if (!destinations.length) {
    return null;
  }

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-primary">
            {t(locale, 'Jelajahi Indonesia', 'Explore Indonesia')}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
            {t(locale, 'Destinasi Unggulan', 'Featured Destinations')}
          </h2>
        </div>
        <Link
          href={`/${locale}/packages`}
          className="hidden items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-brand-primary hover:text-brand-primary md:flex"
        >
          {t(locale, 'Semua Paket', 'All Packages')}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((dest) => {
          const destinationSrc = toImageProxyUrl(dest.image, dest.cacheKey);

          return (
          <Link
            key={dest.slug}
            href={`/${locale}/packages/${dest.slug}`}
            className="group relative overflow-hidden rounded-2xl"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                key={`${dest.slug}:${dest.cacheKey}`}
                src={destinationSrc}
                alt={dest.name}
                fill
                unoptimized={isProxyImageUrl(destinationSrc)}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/70">{dest.tag}</p>
              <h3 className="text-lg font-bold text-white">{dest.name}</h3>
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-brand-secondary opacity-0 transition-all duration-300 group-hover:opacity-100">
                {t(locale, 'Lihat Paket', 'View Package')}
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </div>
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────
export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  const [page, packages, settings, blogPosts] = await Promise.all([
    getPageByKey(locale, 'home'),
    getPublishedPackages(locale),
    getSiteSettings(),
    getBlogPosts(locale),
  ]);

  // Build sections with locale aware fallback
  const sections =
    page?.sections?.length
      ? page.sections
      : [
          {
            id: 'fallback-hero',
            sectionKey: 'hero',
            sectionType: 'hero',
            position: 1,
            config: {},
            content: {
              heading: t(
                locale,
                'Corporate Outing yang Berdampak Nyata untuk Tim Anda',
                'Corporate Outing Programs That Strengthen Teams'
              ),
              subheading: t(
                locale,
                'Program 50 pax dengan itinerary lengkap, aktivitas team building, dan support profesional di destinasi unggulan Indonesia.',
                '50-pax programs with complete itineraries, team-building activities, and professional on-ground support across Indonesia.'
              ),
              ctaLabel: t(locale, 'Lihat Paket', 'Explore Packages'),
              ctaHref: `/${locale}/packages`,
            },
          },
        ];

  // ── Section lookups (needed for hero content extraction below)
  const heroSection = sections.find((s) => s.sectionType === 'hero');
  const trustSection = sections.find((s) => s.sectionType === 'feature-list');
  const aboutSection = sections.find((s) => s.sectionType === 'text');
  const ctaSection = sections.find((s) => s.sectionType === 'cta');

  // ── Build hero slides from package images ──────────────
  // Fallback destination labels when no image metadata available
  const destinationLabels: Record<string, { name: string; location: string }> = {
    'jakarta-borobudur-50': { name: 'Romantic in Borobudur Villages', location: 'Central Java' },
    'jakarta-pangalengan-50': { name: 'Bonding at Cileunca Lake', location: 'West Java' },
    'surabaya-bromo-songa-50': { name: 'Magical Sunrise Bromo', location: 'East Java' },
    'jakarta-bromo-songa-50': { name: 'Magical Sunrise Bromo', location: 'East Java' },
    'jakarta-karimunjawa-50': { name: 'Traces of Harmony Karimunjawa', location: 'Java Sea' },
  };

  const heroSlides: HeroSlide[] = packages
    .filter((pkg) => pkg.heroImageUrl)
    .map((pkg) => ({
      imageUrl: toImageProxyUrl(pkg.heroImageUrl, pkg.imageCacheKey),
      packageName: pkg.name || destinationLabels[pkg.code]?.name || pkg.code,
      location:
        destinationLabels[pkg.code]?.location ||
        (pkg.slug?.includes('bromo') ? 'East Java' :
         pkg.slug?.includes('borobudur') ? 'Central Java' :
         pkg.slug?.includes('karimunjawa') ? 'Java Sea' : 'Indonesia'),
    }));

  // Fallback slides if no packages have images
  const fallbackSlides: HeroSlide[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80',
      packageName: 'Magical Sunrise Bromo',
      location: 'East Java',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?auto=format&fit=crop&w=1400&q=80',
      packageName: 'Romantic in Borobudur Villages',
      location: 'Central Java',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=1400&q=80',
      packageName: 'Traces of Harmony Karimunjawa',
      location: 'Java Sea',
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80',
      packageName: 'Bonding at Cileunca Lake',
      location: 'West Java',
    },
  ];

  const slides = heroSlides.length >= 2 ? heroSlides : fallbackSlides;

  // Extract hero content from CMS or use defaults
  const heroContent = heroSection?.content ?? {};
  const heroHeading =
    (heroContent.heading as string) ||
    t(locale, 'Corporate Outing yang Berdampak Nyata untuk Tim Anda', 'Corporate Outing Programs That Strengthen Teams');
  const heroSubheading =
    (heroContent.subheading as string) ||
    t(
      locale,
      'Program 50 pax dengan itinerary lengkap, aktivitas team building, dan support profesional di destinasi unggulan Indonesia.',
      '50-pax programs with complete itineraries, team-building activities, and professional on-ground support across Indonesia.'
    );
  const heroCtaLabel = (heroContent.ctaLabel as string) || t(locale, 'Lihat Paket', 'Explore Packages');
  const heroCtaHref = (heroContent.ctaHref as string) || `/${locale}/packages`;

  // Package display
  const featuredPackages = packages.filter((item) => item.featured);
  const displayPackages = featuredPackages.length ? featuredPackages : packages;
  const recentBlogs = blogPosts.slice(0, 3);



  return (
    <div className="flex flex-col gap-10">
      {/* ① HERO CAROUSEL */}
      <HeroCarousel
        slides={slides}
        heading={heroHeading}
        subheading={heroSubheading}
        ctaLabel={heroCtaLabel}
        ctaHref={heroCtaHref}
        locale={locale}
        waLabel={t(locale, 'Konsultasi WhatsApp', 'WhatsApp Consult')}
      />

      {/* ② STATS BAR */}
      <StatsBar locale={locale} />

      {/* ③ FEATURED PACKAGES */}
      <section className="space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-primary">
              {t(locale, 'Paket Terpilih', 'Our Packages')}
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
              {t(locale, 'Paket Corporate Outing Unggulan', 'Featured Corporate Outing Packages')}
            </h2>
            <p className="mt-2 text-base text-slate-500">
              {t(
                locale,
                'Semua paket dapat dikustom sesuai kebutuhan perusahaan Anda.',
                'All packages can be tailored to your company objectives.'
              )}
            </p>
          </div>
          <Link
            href={`/${locale}/packages`}
            className="hidden items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-brand-primary hover:text-brand-primary md:flex"
          >
            {t(locale, 'Lihat Semua', 'See All')}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {displayPackages.map((packageItem) => (
            <PackageCard
              key={packageItem.id}
              locale={locale}
              packageItem={packageItem}
              usdToIdr={settings.usd_to_idr}
            />
          ))}

          {!packages.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-400">
              {t(
                locale,
                'Belum ada paket terpublikasi. Pastikan migration dan seed SQL sudah dijalankan.',
                'No published packages found. Make sure SQL migrations and seed are applied.'
              )}
            </div>
          )}
        </div>

        <div className="flex justify-center md:hidden">
          <Link
            href={`/${locale}/packages`}
            className="rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition-all hover:border-brand-primary hover:text-brand-primary"
          >
            {t(locale, 'Lihat Semua Paket →', 'See All Packages →')}
          </Link>
        </div>
      </section>

      {/* ④ TRUST POINTS */}
      {trustSection && <SectionRenderer section={trustSection} locale={locale} />}

      {/* ⑤ DESTINATIONS */}
      <DestinationsSection locale={locale} packages={displayPackages.length ? displayPackages : packages} />

      {/* ⑥ ABOUT */}
      {aboutSection && (
        <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-12">
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-primary">
                {t(locale, 'Tentang Kami', 'About Us')}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
                {(aboutSection.content.heading as string) || 'Sama Sama Tour'}
              </h2>
              <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-slate-600">
                {aboutSection.content.body as string}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  t(locale, '✓ Itinerary Terstruktur', '✓ Structured Itinerary'),
                  t(locale, '✓ Tim Profesional', '✓ Professional Team'),
                  t(locale, '✓ Transparan', '✓ Transparent Pricing'),
                ].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative hidden min-h-[320px] overflow-hidden md:block">
              <Image
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
                alt={t(locale, 'Tim Sama Sama Tour', 'Sama Sama Tour Team')}
                fill
                className="object-cover"
                sizes="50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>
        </section>
      )}

      {/* ⑦ BLOG PREVIEW */}
      {recentBlogs.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-primary">
                {t(locale, 'Artikel & Insight', 'Articles & Insights')}
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-brand-dark md:text-4xl">
                {t(locale, 'Tips & Inspirasi Outing', 'Outing Tips & Inspiration')}
              </h2>
            </div>
            <Link
              href={`/${locale}/blog`}
              className="hidden items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-brand-primary hover:text-brand-primary md:flex"
            >
              {t(locale, 'Semua Artikel', 'All Articles')}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {recentBlogs.map((post) => (
              <BlogCard key={post.id} locale={locale} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* ⑧ CTA FINAL */}
      {ctaSection && <SectionRenderer section={ctaSection} locale={locale} />}
    </div>
  );
}
