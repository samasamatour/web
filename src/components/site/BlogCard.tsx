import Link from 'next/link';
import Image from 'next/image';
import { BlogListItem } from '@/lib/cms/queries';
import { Locale, t } from '@/lib/i18n';
import { toImageProxyUrl } from '@/lib/media';

export function BlogCard({ locale, post }: { locale: Locale; post: BlogListItem }) {
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '-';

  return (
    <article className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative h-48 w-full">
        <Image
          src={toImageProxyUrl(post.coverImageUrl)}
          alt={post.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-3 p-5">
        <p className="text-xs text-muted-foreground">{dateLabel}</p>
        <h3 className="text-xl font-bold text-brand-dark">{post.title}</h3>
        <p className="text-sm text-muted-foreground">{post.excerpt}</p>
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="inline-block rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          {t(locale, 'Baca Artikel', 'Read Article')}
        </Link>
      </div>
    </article>
  );
}
