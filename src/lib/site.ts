import { Locale } from '@/lib/i18n';

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://samasamatour.com';

export const SITE_URL = rawSiteUrl.endsWith('/')
  ? rawSiteUrl.slice(0, -1)
  : rawSiteUrl;

export function localizedPath(locale: Locale, path = ''): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (clean === '/') {
    return `/${locale}`;
  }

  return `/${locale}${clean}`;
}

export function localizedUrl(locale: Locale, path = ''): string {
  return `${SITE_URL}${localizedPath(locale, path)}`;
}

export function metadataAlternates(locale: Locale, path = '') {
  return {
    canonical: localizedUrl(locale, path),
    languages: {
      'id-ID': localizedUrl('id', path),
      'en-US': localizedUrl('en', path),
      'x-default': localizedUrl('en', path),
    },
  };
}
