import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogPostBySlug } from '@/lib/cms/queries';
import { Locale, isLocale, t } from '@/lib/i18n';
import { metadataAlternates } from '@/lib/site';
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
  const post = await getBlogPostBySlug(locale, slug);

  if (!post) {
    return {
      title: 'Article not found',
      robots: 'noindex,nofollow',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || post.title;

  return {
    title,
    description,
    robots: post.robots,
    alternates: metadataAlternates(locale, `/blog/${post.slug}`),
    openGraph: {
      type: 'article',
      title,
      description,
      images: post.coverImageUrl ? [toImageProxyUrl(post.coverImageUrl)] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: post.coverImageUrl ? [toImageProxyUrl(post.coverImageUrl)] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const post = await getBlogPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const publishedLabel = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.publishedAt,
    image: post.coverImageUrl ? [toImageProxyUrl(post.coverImageUrl)] : undefined,
    author: {
      '@type': 'Organization',
      name: 'Sama Sama Tour',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sama Sama Tour',
    },
    description: post.excerpt,
  };

  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <Link href={`/${locale}/blog`} className="text-sm text-brand-primary hover:underline">
        {t(locale, '← Kembali ke blog', '← Back to blog')}
      </Link>

      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-brand-dark md:text-4xl">{post.title}</h1>
        <p className="text-sm text-muted-foreground">{publishedLabel}</p>
      </header>

      <div className="relative h-[300px] w-full overflow-hidden rounded-2xl md:h-[420px]">
        <Image
          src={toImageProxyUrl(post.coverImageUrl)}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>

      <div className="rounded-xl border bg-white p-6">
        <div className="prose prose-sm max-w-none whitespace-pre-line text-foreground">
          {post.contentMarkdown}
        </div>
      </div>
    </article>
  );
}
