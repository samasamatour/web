import Link from 'next/link';
import Image from 'next/image';
import { PackageListItem } from '@/lib/cms/queries';
import { Locale, t } from '@/lib/i18n';
import { toImageProxyUrl } from '@/lib/media';
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
  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-52 w-full overflow-hidden">
        <Image
          src={toImageProxyUrl(packageItem.heroImageUrl)}
          alt={packageItem.heroImageAlt || packageItem.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="space-y-3 p-5">
        <h3 className="text-xl font-bold text-brand-dark">{packageItem.name}</h3>
        <p className="text-sm text-muted-foreground">{packageItem.summary}</p>

        <div className="space-y-1 rounded-md bg-brand-light p-3 text-sm">
          <p className="font-semibold text-brand-dark">{formatIDR(packageItem.priceIdr)}</p>
          <p className="text-muted-foreground">~ {estimateUSD(packageItem.priceIdr, usdToIdr)}</p>
          <p className="text-xs text-muted-foreground">
            {t(locale, 'Harga estimasi USD mengikuti kurs setting admin.', 'USD estimate follows admin exchange-rate settings.')}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {packageItem.durationDays}D/{packageItem.durationNights}N
          </span>
          {packageItem.maxPax ? <span>{packageItem.maxPax} pax</span> : null}
        </div>

        <Link
          href={`/${locale}/packages/${packageItem.slug}`}
          className="inline-block rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {t(locale, 'Lihat Detail', 'View Details')}
        </Link>
      </div>
    </article>
  );
}
