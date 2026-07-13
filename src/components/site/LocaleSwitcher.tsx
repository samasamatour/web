'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale, SUPPORTED_LOCALES } from '@/lib/i18n';

function switchPathname(pathname: string, locale: Locale) {
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) {
    return `/${locale}`;
  }

  if (SUPPORTED_LOCALES.includes(parts[0] as Locale)) {
    parts[0] = locale;
    return `/${parts.join('/')}`;
  }

  return `/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 text-sm">
      <Link
        href={switchPathname(pathname || '/', 'id')}
        className={`px-2 py-1 rounded ${locale === 'id' ? 'bg-brand-primary text-white' : 'hover:bg-brand-light'}`}
      >
        ID
      </Link>
      <Link
        href={switchPathname(pathname || '/', 'en')}
        className={`px-2 py-1 rounded ${locale === 'en' ? 'bg-brand-primary text-white' : 'hover:bg-brand-light'}`}
      >
        EN
      </Link>
    </div>
  );
}
