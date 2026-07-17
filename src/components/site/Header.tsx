import Link from 'next/link';
import Image from 'next/image';
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
    <header className="sticky top-0 z-40 w-full border-b border-white/20 bg-white/75 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <Image
            src="/logo.jpeg"
            alt="Sama Sama Tour & Exploration logo"
            width={44}
            height={44}
            className="rounded-full object-cover"
            priority
          />
          <span className="text-xl font-bold tracking-tight text-brand-dark">
            Sama Sama <span className="text-brand-primary">Tour</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Main navigation" className="hidden items-center gap-7 md:flex">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`text-sm font-medium transition-colors duration-200 ${
                item.kind === 'cta'
                  ? 'text-brand-primary font-semibold'
                  : 'text-slate-600 hover:text-brand-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <LocaleSwitcher locale={locale} />
          <Link
            href={`https://wa.me/6282236037774`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-[#25D366]/30 transition-all hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-md hover:shadow-[#25D366]/40 md:flex"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
            {t(locale, 'WhatsApp', 'WhatsApp')}
          </Link>
        </div>
      </div>
    </header>
  );
}
