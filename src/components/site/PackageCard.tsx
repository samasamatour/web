import Link from 'next/link';
import Image from 'next/image';
import { PackageListItem } from '@/lib/cms/queries';
import { Locale, t } from '@/lib/i18n';
import { isProxyImageUrl, toImageProxyUrl } from '@/lib/media';
import { estimateUSD, formatIDR } from '@/lib/currency';

export function PackageCard({
  locale,
  packageItem,
  usdToIdr,
}: {
  locale: Locale;
  packageItem: PackageListItem;
  usdToIdr: number;
}) {
  const waMessage = encodeURIComponent(
    t(locale,
      `Halo, saya tertarik dengan paket ${packageItem.name}. Bisa info lebih lanjut?`,
      `Hello, I'm interested in the ${packageItem.name} package. Could I get more info?`
    )
  );
  const heroSrc = toImageProxyUrl(packageItem.heroImageUrl, packageItem.imageCacheKey);

  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-transparent">
      {/* Image */}
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          key={`${packageItem.id}:${packageItem.imageCacheKey}`}
          src={heroSrc}
          alt={packageItem.heroImageAlt || packageItem.name}
          fill
          unoptimized={isProxyImageUrl(heroSrc)}
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Featured badge */}
        {packageItem.featured && (
          <div className="absolute left-4 top-4 rounded-full bg-brand-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
            ⭐ {t(locale, 'Unggulan', 'Featured')}
          </div>
        )}

        {/* Duration badge (bottom-left of image) */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          {packageItem.durationDays}D / {packageItem.durationNights}N
        </div>

        {/* Pax badge (bottom-right of image) */}
        {packageItem.maxPax && (
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            {packageItem.maxPax} pax
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="line-clamp-2 text-xl font-bold leading-snug tracking-tight text-brand-dark transition-colors group-hover:text-brand-primary">
            {packageItem.name}
          </h3>
          {packageItem.summary && (
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
              {packageItem.summary}
            </p>
          )}
        </div>

        {/* Price block */}
        <div className="mt-auto rounded-2xl border border-slate-100 bg-gradient-to-r from-slate-50 to-orange-50 p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {t(locale, 'Mulai dari', 'Starting from')}
              </p>
              <p className="text-2xl font-extrabold leading-tight text-brand-dark">
                {formatIDR(packageItem.priceIdr)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-slate-500">
                ~ {estimateUSD(packageItem.priceIdr, usdToIdr)}
              </p>
              <p className="text-xs text-slate-400">per pax</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <Link
            href={`/${locale}/packages/${packageItem.slug}`}
            className="flex-1 rounded-xl bg-brand-primary py-3 text-center text-sm font-bold text-white shadow-sm shadow-brand-primary/20 transition-all hover:bg-orange-600 hover:shadow-md hover:shadow-brand-primary/30"
          >
            {t(locale, 'Lihat Detail', 'View Details')}
          </Link>
          <Link
            href={`https://wa.me/6282236037774?text=${waMessage}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center rounded-xl border border-[#25D366] bg-[#25D366]/10 px-3 py-3 text-[#25D366] transition-all hover:bg-[#25D366] hover:text-white"
            title="WhatsApp"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
