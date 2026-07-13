export const SUPPORTED_LOCALES = ['id', 'en'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function localeName(locale: Locale): string {
  return locale === 'id' ? 'Bahasa Indonesia' : 'English';
}

export function t(locale: Locale, idText: string, enText: string): string {
  return locale === 'id' ? idText : enText;
}

export function parseLocaleFromHeader(headerValue: string | null): Locale {
  if (!headerValue) {
    return DEFAULT_LOCALE;
  }

  const lower = headerValue.toLowerCase();
  if (lower.includes('id')) {
    return 'id';
  }

  return 'en';
}
