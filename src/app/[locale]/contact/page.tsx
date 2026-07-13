import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageByKey, getSiteSettings } from '@/lib/cms/queries';
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
  const page = await getPageByKey(locale, 'contact');

  return {
    title: page?.seoTitle || t(locale, 'Kontak', 'Contact'),
    description:
      page?.seoDescription ||
      t(locale, 'Hubungi Sama Sama Tour via WhatsApp.', 'Contact Sama Sama Tour via WhatsApp.'),
    alternates: metadataAlternates(locale, '/contact'),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const [settings, page] = await Promise.all([
    getSiteSettings(),
    getPageByKey(locale, 'contact'),
  ]);

  return (
    <section className="mx-auto max-w-3xl space-y-6 rounded-2xl border bg-white p-8">
      <h1 className="text-3xl font-bold text-brand-dark">{page?.title || t(locale, 'Kontak', 'Contact')}</h1>

      {page?.sections.length ? (
        <div className="space-y-4">
          {page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          {t(
            locale,
            'Untuk konsultasi paket outing, silakan hubungi tim kami melalui WhatsApp.',
            'For package consultation, please contact our team via WhatsApp.'
          )}
        </p>
      )}

      <div className="space-y-2 text-sm">
        <p>WhatsApp: +{settings.whatsapp_number}</p>
        <p>Email: {settings.contact_email || 'info@samasamatour.com'}</p>
        <p>{settings.contact_address || 'Indonesia'}</p>
      </div>
      <a
        href={`https://wa.me/${settings.whatsapp_number}`}
        target="_blank"
        rel="noreferrer"
        className="inline-block rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
      >
        {t(locale, 'Buka WhatsApp', 'Open WhatsApp')}
      </a>
    </section>
  );
}
