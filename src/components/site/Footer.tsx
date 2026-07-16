import Link from 'next/link';
import Image from 'next/image';
import { Locale, t } from '@/lib/i18n';
import { MenuItem, SiteSettings } from '@/lib/cms/queries';

export function SiteFooter({
  locale,
  items,
  settings,
}: {
  locale: Locale;
  items: MenuItem[];
  settings?: SiteSettings;
}) {
  const currentYear = new Date().getFullYear();
  const phone = settings?.contact_phone || '+62 822-3603-7774';
  const email = settings?.contact_email || 'info@samasamatour.com';
  const waNumber = settings?.whatsapp_number || '6282236037774';

  return (
    <footer className="mt-20 bg-brand-dark text-white">
      {/* Main footer grid */}
      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Sama Sama Tour logo"
                width={52}
                height={52}
                className="rounded-full object-cover"
              />
              <span className="text-2xl font-bold tracking-tight">
                Sama Sama <span className="text-brand-primary">Tour</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {t(
                locale,
                'Spesialis program corporate outing & team building di Indonesia. Kami merancang pengalaman yang memperkuat tim Anda dengan itinerary terstruktur dan layanan profesional.',
                'Specialists in corporate outing & team-building programs across Indonesia. We design experiences that strengthen your team with structured itineraries and professional service.'
              )}
            </p>
            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300">
                🇮🇩 Indonesia Based
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300">
                🌏 Bilingual (ID/EN)
              </span>
              <span className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300">
                👥 50+ Pax
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-400">
              {t(locale, 'Navigasi', 'Navigation')}
            </h4>
            <div className="flex flex-col gap-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-bold uppercase tracking-widest text-slate-400">
              {t(locale, 'Kontak', 'Contact')}
            </h4>
            <div className="flex flex-col gap-4 text-sm text-slate-400">
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-[#25D366]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                </span>
                <span>{phone}</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 transition-colors hover:text-white"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
                <span>{email}</span>
              </a>

              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-slate-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </span>
                <span>Indonesia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-slate-500 md:flex-row md:px-6">
          <p>© {currentYear} Sama Sama Tour. {t(locale, 'Seluruh hak cipta dilindungi.', 'All rights reserved.')}</p>
          <div className="flex gap-5">
            <Link href={`/${locale}/privacy-policy`} className="transition-colors hover:text-slate-300">
              {t(locale, 'Kebijakan Privasi', 'Privacy Policy')}
            </Link>
            <Link href={`/${locale}/terms`} className="transition-colors hover:text-slate-300">
              {t(locale, 'Syarat & Ketentuan', 'Terms & Conditions')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
