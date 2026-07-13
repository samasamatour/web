import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminBlogIndexPage() {
  const supabase = await createClient();

  const [{ data: posts }, { data: i18nRows }] = await Promise.all([
    supabase
      .from('blog_posts')
      .select('id, status, published_at, updated_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('blog_post_i18n')
      .select('post_id, locale, title, slug')
      .in('locale', ['id', 'en']),
  ]);

  const i18nMap = new Map<string, { id?: string; en?: string; slug?: string }>();

  for (const row of i18nRows || []) {
    const entry = i18nMap.get(row.post_id) || {};
    if (row.locale === 'id') {
      entry.id = row.title;
      entry.slug = row.slug;
    }
    if (row.locale === 'en') {
      entry.en = row.title;
      entry.slug = entry.slug || row.slug;
    }
    i18nMap.set(row.post_id, entry);
  }

  return (
    <section className="space-y-4 rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-dark">Blog Posts</h1>
        <Link href="/admin/blog/new" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          New Post
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Title (ID/EN)</th>
              <th className="py-2">Status</th>
              <th className="py-2">Published At</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(posts || []).map((post) => {
              const localized = i18nMap.get(post.id) || {};
              return (
                <tr key={post.id} className="border-b">
                  <td className="py-2">
                    <p className="font-medium">{localized.id || '-'}</p>
                    <p className="text-xs text-muted-foreground">{localized.en || '-'}</p>
                  </td>
                  <td className="py-2">{post.status}</td>
                  <td className="py-2">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="py-2 text-right">
                    <Link href={`/admin/blog/${post.id}`} className="rounded-md border px-3 py-1 text-xs font-semibold">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
