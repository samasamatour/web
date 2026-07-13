import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPackageDetail, getSiteSettings } from '@/lib/cms/queries';
import { Locale, isLocale, t } from '@/lib/i18n';
import { metadataAlternates } from '@/lib/site';
import { estimateUSD, formatIDR } from '@/lib/currency';
import { toImageProxyUrl } from '@/lib/media';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const packageDetail = await getPackageDetail(locale, slug);

  if (!packageDetail) {
    return {
      title: 'Package not found',
      robots: 'noindex,nofollow',
    };
  }

  const title = packageDetail.seoTitle || packageDetail.name;
  const description =
    packageDetail.seoDescription ||
    packageDetail.summary ||
    'Corporate outing package by Sama Sama Tour.';

  return {
    title,
    description,
    alternates: metadataAlternates(locale, `/packages/${packageDetail.slug}`),
    openGraph: {
      type: 'article',
      title,
      description,
      images: packageDetail.heroImageUrl ? [toImageProxyUrl(packageDetail.heroImageUrl)] : undefined,
      locale: locale === 'id' ? 'id_ID' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: packageDetail.heroImageUrl ? [toImageProxyUrl(packageDetail.heroImageUrl)] : undefined,
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  const [packageDetail, settings] = await Promise.all([
    getPackageDetail(locale, slug),
    getSiteSettings(),
  ]);

  if (!packageDetail) {
    notFound();
  }

  const whatsappText = encodeURIComponent(
    locale === 'id'
      ? `Halo Sama Sama Tour, saya tertarik dengan paket ${packageDetail.name}. Mohon info detail dan penawaran final.`
      : `Hello Sama Sama Tour, I am interested in the ${packageDetail.name} package. Please share full details and final quotation.`
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: packageDetail.name,
    description: packageDetail.summary || packageDetail.overview || packageDetail.name,
    image: packageDetail.heroImageUrl ? [toImageProxyUrl(packageDetail.heroImageUrl)] : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'IDR',
      price: packageDetail.priceIdr,
      availability: 'https://schema.org/InStock',
      url: `/packages/${packageDetail.slug}`,
    },
    brand: {
      '@type': 'Brand',
      name: 'Sama Sama Tour',
    },
  };

  return (
    <article className="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="space-y-4">
        <Link href={`/${locale}/packages`} className="text-sm text-brand-primary hover:underline">
          {t(locale, '← Kembali ke daftar paket', '← Back to package list')}
        </Link>

        <div className="relative h-[280px] w-full overflow-hidden rounded-2xl md:h-[420px]">
          <Image
            src={toImageProxyUrl(packageDetail.heroImageUrl)}
            alt={packageDetail.heroImageAlt || packageDetail.name}
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-brand-dark md:text-4xl">{packageDetail.name}</h1>
          <p className="mt-2 text-muted-foreground">{packageDetail.summary}</p>
        </div>

        <div className="grid gap-4 rounded-xl bg-brand-light p-5 md:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">IDR</p>
            <p className="text-xl font-bold text-brand-dark">{formatIDR(packageDetail.priceIdr)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">USD (est.)</p>
            <p className="text-xl font-bold text-brand-dark">
              {estimateUSD(packageDetail.priceIdr, settings.usd_to_idr)}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {t(locale, 'Durasi', 'Duration')}
            </p>
            <p className="text-xl font-bold text-brand-dark">
              {packageDetail.durationDays}D/{packageDetail.durationNights}N
            </p>
          </div>
        </div>

        <a
          href={`https://wa.me/${settings.whatsapp_number}?text=${whatsappText}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-md bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
        >
          {t(locale, 'Konsultasi via WhatsApp', 'Consult via WhatsApp')}
        </a>
      </div>

      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-2xl font-bold text-brand-dark">{t(locale, 'Ringkasan Program', 'Program Overview')}</h2>
        <p className="whitespace-pre-line text-muted-foreground">{packageDetail.overview}</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-xl font-bold text-brand-dark">{t(locale, 'Include', 'Included')}</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {packageDetail.includes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h3 className="text-xl font-bold text-brand-dark">{t(locale, 'Exclude', 'Excluded')}</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {packageDetail.excludes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-2xl font-bold text-brand-dark">{t(locale, 'Itinerary', 'Itinerary')}</h2>
        <div className="space-y-6">
          {packageDetail.itinerary.map((day) => (
            <div key={day.dayNumber} className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold text-brand-dark">
                {t(locale, 'Hari', 'Day')} {day.dayNumber}: {day.title}
              </h3>
              <div className="mt-3 space-y-3">
                {day.items.map((item) => (
                  <div key={`${day.dayNumber}-${item.position}`} className="rounded-md bg-brand-light p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-dark">
                      {item.timeLabel || '-'}
                    </p>
                    <p className="text-sm font-semibold text-brand-dark">{item.activity}</p>
                    {item.details ? <p className="text-sm text-muted-foreground">{item.details}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-2xl font-bold text-brand-dark">{t(locale, 'Rincian Biaya', 'Cost Breakdown')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 pr-3">{t(locale, 'Kategori', 'Category')}</th>
                <th className="py-2 pr-3">{t(locale, 'Label', 'Label')}</th>
                <th className="py-2 text-right">{t(locale, 'Jumlah', 'Amount')}</th>
              </tr>
            </thead>
            <tbody>
              {packageDetail.costs.map((cost) => (
                <tr key={cost.id} className="border-b">
                  <td className="py-2 pr-3 uppercase text-xs text-muted-foreground">{cost.costGroup}</td>
                  <td className="py-2 pr-3">{cost.label}</td>
                  <td className="py-2 text-right font-medium">{formatIDR(cost.amountIdr)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-2xl font-bold text-brand-dark">
          {t(locale, 'Add-on Car Rental', 'Car Rental Add-ons')}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {packageDetail.carRentals.map((car) => (
            <div key={car.id} className="rounded-lg border p-4">
              <div className="relative h-36 w-full overflow-hidden rounded-md">
                <Image
                  src={toImageProxyUrl(car.imageUrl)}
                  alt={car.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <h3 className="mt-3 font-semibold text-brand-dark">{car.name}</h3>
              <p className="text-xs text-muted-foreground">{car.description}</p>
              <p className="mt-2 text-sm font-medium">{formatIDR(car.priceIdr)} / day</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
