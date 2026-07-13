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
  const page = await getPageByKey(locale, 'privacy-policy');

  return {
    title: page?.seoTitle || t(locale, 'Kebijakan Privasi', 'Privacy Policy'),
    description:
      page?.seoDescription ||
      t(
        locale,
        'Kebijakan privasi penggunaan website Sama Sama Tour.',
        'Privacy policy for using the Sama Sama Tour website.'
      ),
    alternates: metadataAlternates(locale, '/privacy-policy'),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const page = await getPageByKey(locale, 'privacy-policy');

  const title = page?.title || t(locale, 'Kebijakan Privasi', 'Privacy Policy');

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
              'Kami hanya menggunakan data yang diperlukan untuk layanan konsultasi paket dan komunikasi operasional melalui kanal resmi.',
              'We only process data required for package consultation and operational communication through official channels.'
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            {t(
              locale,
              'Konten halaman ini dapat diperbarui dari panel admin sesuai kebijakan terbaru.',
              'This page content can be updated from the admin panel according to the latest policies.'
            )}
          </p>
        </>
      )}
    </article>
  );
}
