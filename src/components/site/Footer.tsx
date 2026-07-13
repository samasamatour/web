import Link from 'next/link';
import { Locale, t } from '@/lib/i18n';
import { MenuItem } from '@/lib/cms/queries';

export function SiteFooter({
  locale,
  items,
}: {
  locale: Locale;
  items: MenuItem[];
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 bg-brand-dark py-10 text-white">
      <div className="container mx-auto grid gap-8 px-4 md:grid-cols-3 md:px-6">
        <div>
          <h3 className="text-xl font-bold">Sama Sama Tour</h3>
          <p className="mt-3 text-sm text-gray-200">
            {t(
              locale,
              'Corporate outing & team building untuk perusahaan di Indonesia.',
              'Corporate outing and team-building programs across Indonesia.'
            )}
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-200">
            {t(locale, 'Navigasi', 'Navigation')}
          </h4>
          <div className="flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="text-gray-200 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-200">
            {t(locale, 'Kontak', 'Contact')}
          </h4>
          <div className="space-y-2 text-sm text-gray-200">
            <p>WhatsApp: +62 822-3603-7774</p>
            <p>Email: info@samasamatour.com</p>
            <p>{t(locale, 'Pasar global, operasi Indonesia', 'Global market, Indonesia operations')}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto mt-8 border-t border-white/20 px-4 pt-4 text-xs text-gray-300 md:px-6">
        <p>&copy; {currentYear} Sama Sama Tour. {t(locale, 'Seluruh hak cipta dilindungi.', 'All rights reserved.')}</p>
      </div>
    </footer>
  );
}
