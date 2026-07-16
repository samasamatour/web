import Link from 'next/link';
import Image from 'next/image';
import { BlogListItem } from '@/lib/cms/queries';
import { Locale, t } from '@/lib/i18n';
import { isProxyImageUrl, toImageProxyUrl } from '@/lib/media';

export function BlogCard({ locale, post }: { locale: Locale; post: BlogListItem }) {
  const coverSrc = toImageProxyUrl(post.coverImageUrl, post.id);
  const dateLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-transparent">
      {/* Cover image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={coverSrc}
          alt={post.title}
          fill
          unoptimized={isProxyImageUrl(coverSrc)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {/* Date pill on image */}
        <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {dateLabel}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-brand-dark transition-colors group-hover:text-brand-primary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
            {post.excerpt}
          </p>
        )}
        <Link
          href={`/${locale}/blog/${post.slug}`}
          className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-primary transition-all hover:gap-3"
        >
          {t(locale, 'Baca Artikel', 'Read Article')}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Link>
      </div>
    </article>
  );
}
