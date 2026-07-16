import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { withAdminNotice } from '@/lib/admin/notice';

async function createPostAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const status = String(formData.get('status') || 'draft');
  const publishedAt = status === 'published' ? new Date().toISOString() : null;

  const { data: post } = await supabase
    .from('blog_posts')
    .insert({
      status,
      published_at: publishedAt,
    })
    .select('id')
    .single();

  if (!post?.id) {
    redirect(withAdminNotice('/admin/blog/new', 'error', 'Gagal membuat artikel baru.'));
  }

  for (const locale of ['id', 'en'] as const) {
    await supabase.from('blog_post_i18n').insert({
      post_id: post.id,
      locale,
      slug: String(formData.get(`slug_${locale}`) || `${post.id}-${locale}`),
      title: String(formData.get(`title_${locale}`) || 'Untitled'),
      excerpt: String(formData.get(`excerpt_${locale}`) || ''),
      content_markdown: String(formData.get(`content_${locale}`) || ''),
      seo_title: String(formData.get(`seo_title_${locale}`) || ''),
      seo_description: String(formData.get(`seo_description_${locale}`) || ''),
      robots: String(formData.get(`robots_${locale}`) || 'index,follow'),
      canonical_path: String(formData.get(`canonical_path_${locale}`) || ''),
    });
  }

  const slugId = String(formData.get('slug_id') || '').trim();
  const slugEn = String(formData.get('slug_en') || '').trim();

  revalidatePath('/id/blog');
  revalidatePath('/en/blog');
  revalidatePath('/id/blog/[slug]', 'page');
  revalidatePath('/en/blog/[slug]', 'page');
  if (slugId) {
    revalidatePath(`/id/blog/${slugId}`);
  }
  if (slugEn) {
    revalidatePath(`/en/blog/${slugEn}`);
  }

  redirect(withAdminNotice(`/admin/blog/${post.id}`, 'created', 'Artikel baru berhasil dibuat.'));
}

export default function AdminCreateBlogPostPage() {
  return (
    <section className="space-y-4 rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold text-brand-dark">Create Blog Post</h1>

      <form action={createPostAction} className="space-y-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select name="status" defaultValue="draft" className="w-full rounded-md border px-3 py-2 md:w-80">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>

        {(['id', 'en'] as const).map((locale) => (
          <div key={locale} className="rounded-lg border p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Locale: {locale}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input name={`slug_${locale}`} placeholder="slug" className="rounded-md border px-3 py-2 text-sm" />
              <input name={`title_${locale}`} placeholder="title" className="rounded-md border px-3 py-2 text-sm" />
              <textarea name={`excerpt_${locale}`} placeholder="excerpt" className="min-h-20 rounded-md border px-3 py-2 text-sm md:col-span-2" />
              <textarea name={`content_${locale}`} placeholder="markdown content" className="min-h-48 rounded-md border px-3 py-2 text-sm md:col-span-2" />
              <input name={`seo_title_${locale}`} placeholder="seo title" className="rounded-md border px-3 py-2 text-sm" />
              <input name={`seo_description_${locale}`} placeholder="seo description" className="rounded-md border px-3 py-2 text-sm" />
              <input name={`robots_${locale}`} defaultValue="index,follow" className="rounded-md border px-3 py-2 text-sm" />
              <input name={`canonical_path_${locale}`} placeholder="canonical path" className="rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
        ))}

        <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          Create Post
        </button>
      </form>
    </section>
  );
}
