import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES, isLocale } from '@/lib/i18n';
import { getMenuItems, getSiteSettings } from '@/lib/cms/queries';
import { SiteHeader } from '@/components/site/Header';
import { SiteFooter } from '@/components/site/Footer';

export const revalidate = 300;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  const [headerMenu, footerMenu, settings] = await Promise.all([
    getMenuItems(locale, 'header-main'),
    getMenuItems(locale, 'footer-main'),
    getSiteSettings(),
  ]);

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: settings.organization_name,
    url: settings.canonical_base_url,
    telephone: settings.contact_phone,
    email: settings.contact_email,
    address: settings.contact_address,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <SiteHeader locale={locale} items={headerMenu} />
      <main className="container mx-auto px-4 py-8 md:px-6">{children}</main>
      <SiteFooter locale={locale} items={footerMenu} settings={settings} />
    </>
  );
}

