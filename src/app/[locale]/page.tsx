import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByKey, getPublishedPackages, getSiteSettings } from '@/lib/cms/queries';
import { Locale, isLocale, t } from '@/lib/i18n';
import { metadataAlternates } from '@/lib/site';
import { SectionRenderer } from '@/components/site/SectionRenderer';
import { PackageCard } from '@/components/site/PackageCard';

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

  const [page, packages, settings] = await Promise.all([
    getPageByKey(locale, 'home'),
    getPublishedPackages(locale),
    getSiteSettings(),
  ]);

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
                'Sama Sama Tour - Corporate Outing Indonesia',
                'Sama Sama Tour - Corporate Outing Indonesia'
              ),
              subheading: t(
                locale,
                'Konten CMS belum tersedia di database lokal. Jalankan migration Supabase untuk memuat konten penuh.',
                'CMS content is not available in the local database yet. Run Supabase migrations to load full content.'
              ),
              ctaLabel: t(locale, 'Lihat Paket', 'Explore Packages'),
              ctaHref: `/${locale}/packages`,
            },
          },
        ];

  const featuredPackages = packages.filter((item) => item.featured);

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-brand-dark md:text-3xl">
            {t(locale, 'Paket Corporate Outing Unggulan', 'Featured Corporate Outing Packages')}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {t(
              locale,
              'Semua paket dapat dikustom sesuai kebutuhan perusahaan Anda.',
              'All packages can be tailored to your company objectives.'
            )}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(featuredPackages.length ? featuredPackages : packages).map((packageItem) => (
            <PackageCard
              key={packageItem.id}
              locale={locale}
              packageItem={packageItem}
              usdToIdr={settings.usd_to_idr}
            />
          ))}

          {!packages.length ? (
            <div className="rounded-xl border border-dashed bg-white p-6 text-sm text-muted-foreground">
              {t(
                locale,
                'Belum ada paket terpublikasi di database lokal. Pastikan migration dan seed SQL sudah dijalankan.',
                'No published packages found in local database. Make sure SQL migrations and seed are applied.'
              )}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
