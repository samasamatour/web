import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByKey } from '@/lib/cms/queries';
import { Locale, isLocale, t } from '@/lib/i18n';
import { metadataAlternates } from '@/lib/site';
import { SectionRenderer } from '@/components/site/SectionRenderer';

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
  const page = await getPageByKey(locale, 'terms');

  return {
    title: page?.seoTitle || t(locale, 'Syarat dan Ketentuan', 'Terms and Conditions'),
    description:
      page?.seoDescription ||
      t(
        locale,
        'Syarat penggunaan layanan Sama Sama Tour.',
        'Terms for using Sama Sama Tour services.'
      ),
    alternates: metadataAlternates(locale, '/terms'),
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const page = await getPageByKey(locale, 'terms');

  const title = page?.title || t(locale, 'Syarat dan Ketentuan', 'Terms and Conditions');

  return (
    <article className="mx-auto max-w-4xl space-y-4 rounded-2xl border bg-white p-8">
      <h1 className="text-3xl font-bold text-brand-dark">{title}</h1>

      {page?.sections.length ? (
        <div className="space-y-4">
          {page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            {t(
              locale,
              'Semua informasi harga pada website merupakan estimasi awal dan dapat berubah berdasarkan finalisasi itinerary, tanggal, serta kebutuhan teknis grup.',
              'All prices on the website are initial estimates and may change based on itinerary finalization, dates, and technical group requirements.'
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(
              locale,
              'Konfirmasi akhir dilakukan melalui komunikasi resmi dengan tim Sama Sama Tour.',
              'Final confirmation is handled through official communication with the Sama Sama Tour team.'
            )}
          </p>
        </>
      )}
    </article>
  );
}
