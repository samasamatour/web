import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const [pagesRes, packagesRes, packageI18nRes, blogRes, blogI18nRes] = await Promise.all([
    supabase
      .from('cms_pages')
      .select('id, page_key, updated_at')
      .eq('status', 'published')
      .eq('show_in_sitemap', true),
    supabase.from('packages').select('id, updated_at').eq('status', 'published'),
    supabase
      .from('package_i18n')
      .select('package_id, locale, slug')
      .in('locale', ['id', 'en']),
    supabase.from('blog_posts').select('id, updated_at').eq('status', 'published'),
    supabase
      .from('blog_post_i18n')
      .select('post_id, locale, slug')
      .in('locale', ['id', 'en']),
  ]);

  const items: MetadataRoute.Sitemap = [];

  const pages = pagesRes.data || [];
  for (const page of pages) {
    const pagePath =
      page.page_key === 'home'
        ? ''
        : page.page_key === 'privacy-policy'
          ? '/privacy-policy'
          : page.page_key === 'terms'
            ? '/terms'
            : page.page_key === 'contact'
              ? '/contact'
              : page.page_key === 'packages'
                ? '/packages'
                : page.page_key === 'blog'
                  ? '/blog'
                  : '';

    for (const locale of ['id', 'en'] as const) {
      items.push({
        url: `${SITE_URL}/${locale}${pagePath}`,
        lastModified: page.updated_at || new Date().toISOString(),
        changeFrequency: page.page_key === 'home' ? 'weekly' : 'monthly',
        priority: page.page_key === 'home' ? 1 : 0.7,
      });
    }
  }

  const packageRows = packagesRes.data || [];
  const packageI18nMap = new Map<string, { id?: string; en?: string }>();
  for (const row of packageI18nRes.data || []) {
    const entry = packageI18nMap.get(row.package_id) || {};
    if (row.locale === 'id') entry.id = row.slug;
    if (row.locale === 'en') entry.en = row.slug;
    packageI18nMap.set(row.package_id, entry);
  }

  for (const pkg of packageRows) {
    const slugs = packageI18nMap.get(pkg.id);
    if (slugs?.id) {
      items.push({
        url: `${SITE_URL}/id/packages/${slugs.id}`,
        lastModified: pkg.updated_at || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
    if (slugs?.en) {
      items.push({
        url: `${SITE_URL}/en/packages/${slugs.en}`,
        lastModified: pkg.updated_at || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.9,
      });
    }
  }

  const blogRows = blogRes.data || [];
  const blogI18nMap = new Map<string, { id?: string; en?: string }>();
  for (const row of blogI18nRes.data || []) {
    const entry = blogI18nMap.get(row.post_id) || {};
    if (row.locale === 'id') entry.id = row.slug;
    if (row.locale === 'en') entry.en = row.slug;
    blogI18nMap.set(row.post_id, entry);
  }

  for (const post of blogRows) {
    const slugs = blogI18nMap.get(post.id);
    if (slugs?.id) {
      items.push({
        url: `${SITE_URL}/id/blog/${slugs.id}`,
        lastModified: post.updated_at || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
    if (slugs?.en) {
      items.push({
        url: `${SITE_URL}/en/blog/${slugs.en}`,
        lastModified: post.updated_at || new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return items;
}
