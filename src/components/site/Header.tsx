import Link from 'next/link';
import { Locale, t } from '@/lib/i18n';
import { MenuItem } from '@/lib/cms/queries';
import { LocaleSwitcher } from '@/components/site/LocaleSwitcher';

export function SiteHeader({
  locale,
  items,
}: {
  locale: Locale;
  items: MenuItem[];
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
        <Link href={`/${locale}`} className="text-lg font-bold text-brand-dark">
          Sama Sama <span className="text-brand-primary">Tour</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`text-sm font-medium ${item.kind === 'cta' ? 'text-brand-primary' : 'text-brand-dark hover:text-brand-primary'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <Link
            href={`https://wa.me/6282236037774`}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-md bg-[#25D366] px-3 py-2 text-sm font-semibold text-white md:inline-block"
          >
            {t(locale, 'WhatsApp', 'WhatsApp')}
          </Link>
        </div>
      </div>
    </header>
  );
}
