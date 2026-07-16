import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { withAdminNotice } from '@/lib/admin/notice';

async function createPackageAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const code = String(formData.get('code') || '').trim();
  const priceIdr = Number(formData.get('price_idr') || 0);

  if (!code || priceIdr <= 0) {
    redirect(withAdminNotice('/admin/packages/new', 'error', 'Kode paket dan harga wajib diisi.'));
  }

  const { data: pkg } = await supabase
    .from('packages')
    .insert({
      code,
      status: String(formData.get('status') || 'draft'),
      duration_days: Number(formData.get('duration_days') || 1),
      duration_nights: Number(formData.get('duration_nights') || 0),
      min_pax: Number(formData.get('min_pax') || 0) || null,
      max_pax: Number(formData.get('max_pax') || 0) || null,
      price_idr: priceIdr,
      featured: String(formData.get('featured') || 'off') === 'on',
      sort_order: Number(formData.get('sort_order') || 0),
    })
    .select('id')
    .single();

  if (!pkg?.id) {
    redirect(withAdminNotice('/admin/packages/new', 'error', 'Gagal membuat paket baru.'));
  }

  for (const locale of ['id', 'en'] as const) {
    await supabase.from('package_i18n').insert({
      package_id: pkg.id,
      locale,
      slug: String(formData.get(`slug_${locale}`) || `${code}-${locale}`).trim(),
      name: String(formData.get(`name_${locale}`) || '').trim(),
      summary: String(formData.get(`summary_${locale}`) || '').trim(),
      overview: String(formData.get(`overview_${locale}`) || '').trim(),
      includes: [],
      excludes: [],
      notes: '',
      seo_title: String(formData.get(`seo_title_${locale}`) || '').trim(),
      seo_description: String(formData.get(`seo_description_${locale}`) || '').trim(),
    });
  }

  const slugId = String(formData.get('slug_id') || '').trim();
  const slugEn = String(formData.get('slug_en') || '').trim();

  revalidatePath('/id');
  revalidatePath('/en');
  revalidatePath('/id/packages');
  revalidatePath('/en/packages');
  revalidatePath('/id/packages/[slug]', 'page');
  revalidatePath('/en/packages/[slug]', 'page');
  if (slugId) {
    revalidatePath(`/id/packages/${slugId}`);
  }
  if (slugEn) {
    revalidatePath(`/en/packages/${slugEn}`);
  }

  redirect(withAdminNotice(`/admin/packages/${pkg.id}`, 'created', 'Paket baru berhasil dibuat.'));
}

export default function AdminCreatePackagePage() {
  return (
    <section className="space-y-4 rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold text-brand-dark">Create Package</h1>

      <form action={createPackageAction} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Code</span>
          <input name="code" required className="w-full rounded-md border px-3 py-2" placeholder="jakarta-borobudur-50" />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select name="status" defaultValue="draft" className="w-full rounded-md border px-3 py-2">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Price IDR</span>
          <input name="price_idr" type="number" required className="w-full rounded-md border px-3 py-2" />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Sort Order</span>
          <input name="sort_order" type="number" defaultValue={0} className="w-full rounded-md border px-3 py-2" />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Duration Days</span>
          <input name="duration_days" type="number" defaultValue={2} className="w-full rounded-md border px-3 py-2" />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Duration Nights</span>
          <input name="duration_nights" type="number" defaultValue={1} className="w-full rounded-md border px-3 py-2" />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Min Pax</span>
          <input name="min_pax" type="number" defaultValue={50} className="w-full rounded-md border px-3 py-2" />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Max Pax</span>
          <input name="max_pax" type="number" defaultValue={50} className="w-full rounded-md border px-3 py-2" />
        </label>

        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="featured" className="h-4 w-4" />
          Featured package
        </label>

        {(['id', 'en'] as const).map((locale) => (
          <div key={locale} className="rounded-lg border p-4 md:col-span-2">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Locale: {locale}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <input name={`slug_${locale}`} placeholder="slug" className="rounded-md border px-3 py-2 text-sm" />
              <input name={`name_${locale}`} placeholder="name" className="rounded-md border px-3 py-2 text-sm" />
              <textarea
                name={`summary_${locale}`}
                placeholder="summary"
                className="min-h-20 rounded-md border px-3 py-2 text-sm md:col-span-2"
              />
              <textarea
                name={`overview_${locale}`}
                placeholder="overview"
                className="min-h-24 rounded-md border px-3 py-2 text-sm md:col-span-2"
              />
              <input name={`seo_title_${locale}`} placeholder="seo title" className="rounded-md border px-3 py-2 text-sm" />
              <input name={`seo_description_${locale}`} placeholder="seo description" className="rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
        ))}

        <div className="md:col-span-2">
          <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
            Create Package
          </button>
        </div>
      </form>
    </section>
  );
}
