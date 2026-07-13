import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPosts, getPageByKey } from '@/lib/cms/queries';
import { Locale, isLocale, t } from '@/lib/i18n';
import { metadataAlternates } from '@/lib/site';
import { BlogCard } from '@/components/site/BlogCard';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const page = await getPageByKey(locale, 'blog');

  return {
    title: page?.seoTitle || t(locale, 'Blog', 'Blog'),
    description:
      page?.seoDescription ||
      t(
        locale,
        'Artikel seputar corporate outing, team building, dan perencanaan kegiatan perusahaan.',
        'Articles about corporate outings, team building, and company trip planning.'
      ),
    alternates: metadataAlternates(locale, '/blog'),
    robots: page?.robots || 'index,follow',
  };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const posts = await getBlogPosts(locale);

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-dark md:text-4xl">
          {t(locale, 'Blog Sama Sama Tour', 'Sama Sama Tour Blog')}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t(
            locale,
            'Insight praktis untuk menyusun outing perusahaan yang efektif.',
            'Practical insights for building effective corporate outing programs.'
          )}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.id} locale={locale} post={post} />
        ))}
      </div>
    </section>
  );
}
