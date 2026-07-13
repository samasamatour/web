import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function upsertMedia(sourceUrl: string): Promise<string | null> {
  const supabase = await createClient();
  const clean = sourceUrl.trim();
  if (!clean) return null;

  const { data: existing } = await supabase
    .from('media_assets')
    .select('id')
    .eq('source_url', clean)
    .maybeSingle();

  if (existing?.id) return existing.id;

  const { data: inserted } = await supabase
    .from('media_assets')
    .insert({ source_type: 'external', source_url: clean, is_active: true })
    .select('id')
    .single();

  return inserted?.id || null;
}

async function updatePostAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const postId = String(formData.get('post_id') || '');
  if (!postId) {
    return;
  }

  const status = String(formData.get('status') || 'draft');
  const coverSourceUrl = String(formData.get('cover_source_url') || '');
  const coverMediaId = await upsertMedia(coverSourceUrl);

  await supabase
    .from('blog_posts')
    .update({
      status,
      cover_media_id: coverMediaId,
      published_at:
        status === 'published'
          ? String(formData.get('published_at') || '') || new Date().toISOString()
          : null,
    })
    .eq('id', postId);

  for (const locale of ['id', 'en'] as const) {
    await supabase.from('blog_post_i18n').upsert({
      post_id: postId,
      locale,
      slug: String(formData.get(`slug_${locale}`) || ''),
      title: String(formData.get(`title_${locale}`) || ''),
      excerpt: String(formData.get(`excerpt_${locale}`) || ''),
      content_markdown: String(formData.get(`content_${locale}`) || ''),
      seo_title: String(formData.get(`seo_title_${locale}`) || ''),
      seo_description: String(formData.get(`seo_description_${locale}`) || ''),
      robots: String(formData.get(`robots_${locale}`) || 'index,follow'),
      canonical_path: String(formData.get(`canonical_path_${locale}`) || ''),
    });
  }

  revalidatePath(`/admin/blog/${postId}`);
  revalidatePath('/admin/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en/blog');
}

async function deletePostAction(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const postId = String(formData.get('post_id') || '');
  if (!postId) {
    return;
  }

  await supabase.from('blog_posts').delete().eq('id', postId);

  revalidatePath('/admin/blog');
  revalidatePath('/id/blog');
  revalidatePath('/en/blog');
  redirect('/admin/blog');
}

export default async function AdminBlogPostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!post) {
    notFound();
  }

  const [{ data: i18nRows }, { data: coverMedia }] = await Promise.all([
    supabase.from('blog_post_i18n').select('*').eq('post_id', post.id),
    post.cover_media_id
      ? supabase.from('media_assets').select('source_url').eq('id', post.cover_media_id).maybeSingle()
      : Promise.resolve({ data: null } as any),
  ]);

  const byLocale = new Map((i18nRows || []).map((row) => [row.locale, row]));

  return (
    <section className="space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold text-brand-dark">Edit Blog Post</h1>

        <form action={updatePostAction} className="mt-4 space-y-4">
          <input type="hidden" name="post_id" value={post.id} />

          <div className="grid gap-3 md:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block font-medium">Status</span>
              <select name="status" defaultValue={post.status} className="w-full rounded-md border px-3 py-2">
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </label>

            <label className="text-sm">
              <span className="mb-1 block font-medium">Published At (ISO)</span>
              <input
                name="published_at"
                defaultValue={post.published_at || ''}
                className="w-full rounded-md border px-3 py-2"
                placeholder="2026-07-13T00:00:00.000Z"
              />
            </label>

            <label className="text-sm md:col-span-2">
              <span className="mb-1 block font-medium">Cover Source URL</span>
              <input
                name="cover_source_url"
                defaultValue={coverMedia.data?.source_url || ''}
                className="w-full rounded-md border px-3 py-2"
              />
            </label>
          </div>

          {(['id', 'en'] as const).map((locale) => {
            const row = byLocale.get(locale);
            return (
              <div key={locale} className="rounded-lg border p-4">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Locale: {locale}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <input name={`slug_${locale}`} defaultValue={row?.slug || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="slug" />
                  <input name={`title_${locale}`} defaultValue={row?.title || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="title" />
                  <textarea
                    name={`excerpt_${locale}`}
                    defaultValue={row?.excerpt || ''}
                    className="min-h-20 rounded-md border px-3 py-2 text-sm md:col-span-2"
                    placeholder="excerpt"
                  />
                  <textarea
                    name={`content_${locale}`}
                    defaultValue={row?.content_markdown || ''}
                    className="min-h-60 rounded-md border px-3 py-2 text-sm md:col-span-2"
                    placeholder="markdown content"
                  />
                  <input name={`seo_title_${locale}`} defaultValue={row?.seo_title || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="seo title" />
                  <input name={`seo_description_${locale}`} defaultValue={row?.seo_description || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="seo description" />
                  <input name={`robots_${locale}`} defaultValue={row?.robots || 'index,follow'} className="rounded-md border px-3 py-2 text-sm" placeholder="robots" />
                  <input name={`canonical_path_${locale}`} defaultValue={row?.canonical_path || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="canonical path" />
                </div>
              </div>
            );
          })}

          <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
            Save Post
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
        <form action={deletePostAction} className="mt-3">
          <input type="hidden" name="post_id" value={post.id} />
          <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">
            Delete Post
          </button>
        </form>
      </div>
    </section>
  );
}
