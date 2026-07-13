import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByKey, getPublishedPackages, getSiteSettings } from '@/lib/cms/queries';
import { Locale, isLocale, t } from '@/lib/i18n';
import { metadataAlternates } from '@/lib/site';
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
  const page = await getPageByKey(locale, 'packages');

  return {
    title: page?.seoTitle || t(locale, 'Paket Outing', 'Outing Packages'),
    description:
      page?.seoDescription ||
      t(
        locale,
        'Paket outing perusahaan lengkap untuk 50 pax dengan itinerary dan biaya transparan.',
        'Complete corporate outing packages for 50 pax with itinerary and transparent pricing.'
      ),
    alternates: metadataAlternates(locale, '/packages'),
    robots: page?.robots || 'index,follow',
  };
}

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  const [packages, settings] = await Promise.all([
    getPublishedPackages(locale),
    getSiteSettings(),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-dark md:text-4xl">
          {t(locale, 'Paket Corporate Outing', 'Corporate Outing Packages')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t(
            locale,
            'Semua paket berbasis dokumen operasional dan dapat disesuaikan lewat konsultasi.',
            'All packages are based on operational documents and can be tailored through consultation.'
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {packages.map((packageItem) => (
          <PackageCard
            key={packageItem.id}
            locale={locale}
            packageItem={packageItem}
            usdToIdr={settings.usd_to_idr}
          />
        ))}
      </div>
    </section>
  );
}
