import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { withAdminNotice } from '@/lib/admin/notice';

async function resolveMediaIdBySourceUrl(sourceUrl: string): Promise<string | null> {
  const supabase = await createClient();
  const cleanUrl = sourceUrl.trim();

  if (!cleanUrl) {
    return null;
  }

  const { data: existingMedia } = await supabase
    .from('media_assets')
    .select('id')
    .eq('source_url', cleanUrl)
    .maybeSingle();

  if (existingMedia?.id) {
    return existingMedia.id;
  }

  const { data: insertedMedia } = await supabase
    .from('media_assets')
    .insert({ source_type: 'external', source_url: cleanUrl, is_active: true })
    .select('id')
    .single();

  return insertedMedia?.id || null;
}

async function createCarRentalAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const code = String(formData.get('code') || '').trim();
  if (!code) {
    redirect(withAdminNotice('/admin/car-rentals', 'error', 'Kode armada wajib diisi.'));
  }

  const mediaSourceUrl = String(formData.get('media_source_url') || '').trim();
  const imageMediaId = await resolveMediaIdBySourceUrl(mediaSourceUrl);

  const { data: car } = await supabase
    .from('car_rentals')
    .insert({
      code,
      status: String(formData.get('status') || 'draft'),
      price_idr: Number(formData.get('price_idr') || 0),
      seats: Number(formData.get('seats') || 0) || null,
      transmission: String(formData.get('transmission') || ''),
      has_ac: String(formData.get('has_ac') || 'on') === 'on',
      luggage_capacity: Number(formData.get('luggage_capacity') || 0) || null,
      image_media_id: imageMediaId,
    })
    .select('id')
    .single();

  if (!car?.id) {
    redirect(withAdminNotice('/admin/car-rentals', 'error', 'Gagal menambahkan car rental.'));
  }

  for (const locale of ['id', 'en'] as const) {
    await supabase.from('car_rental_i18n').insert({
      car_rental_id: car.id,
      locale,
      slug: String(formData.get(`slug_${locale}`) || `${code}-${locale}`),
      name: String(formData.get(`name_${locale}`) || code),
      description: String(formData.get(`description_${locale}`) || ''),
      seo_title: String(formData.get(`seo_title_${locale}`) || ''),
      seo_description: String(formData.get(`seo_description_${locale}`) || ''),
    });
  }

  revalidatePath('/admin/car-rentals');
  revalidatePath('/id/packages');
  revalidatePath('/en/packages');
  revalidatePath('/id/packages/[slug]', 'page');
  revalidatePath('/en/packages/[slug]', 'page');

  redirect(withAdminNotice('/admin/car-rentals', 'created', 'Car rental berhasil ditambahkan.'));
}

async function updateCarRentalAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const id = String(formData.get('car_rental_id') || '');
  if (!id) {
    redirect(withAdminNotice('/admin/car-rentals', 'error', 'ID car rental tidak ditemukan.'));
  }

  const mediaSourceUrl = String(formData.get('media_source_url') || '').trim();
  const imageMediaId = await resolveMediaIdBySourceUrl(mediaSourceUrl);

  await supabase
    .from('car_rentals')
    .update({
      status: String(formData.get('status') || 'draft'),
      price_idr: Number(formData.get('price_idr') || 0),
      seats: Number(formData.get('seats') || 0) || null,
      transmission: String(formData.get('transmission') || ''),
      has_ac: String(formData.get('has_ac') || 'off') === 'on',
      luggage_capacity: Number(formData.get('luggage_capacity') || 0) || null,
      image_media_id: imageMediaId,
    })
    .eq('id', id);

  for (const locale of ['id', 'en'] as const) {
    await supabase
      .from('car_rental_i18n')
      .update({
        slug: String(formData.get(`slug_${locale}`) || ''),
        name: String(formData.get(`name_${locale}`) || ''),
        description: String(formData.get(`description_${locale}`) || ''),
        seo_title: String(formData.get(`seo_title_${locale}`) || ''),
        seo_description: String(formData.get(`seo_description_${locale}`) || ''),
      })
      .eq('car_rental_id', id)
      .eq('locale', locale);
  }

  revalidatePath('/admin/car-rentals');
  revalidatePath('/id/packages');
  revalidatePath('/en/packages');
  revalidatePath('/id/packages/[slug]', 'page');
  revalidatePath('/en/packages/[slug]', 'page');

  redirect(withAdminNotice('/admin/car-rentals', 'success', 'Car rental berhasil disimpan.'));
}

async function deleteCarRentalAction(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const id = String(formData.get('car_rental_id') || '');
  if (!id) {
    redirect(withAdminNotice('/admin/car-rentals', 'error', 'ID car rental tidak ditemukan.'));
  }

  await supabase.from('car_rentals').delete().eq('id', id);

  revalidatePath('/admin/car-rentals');
  revalidatePath('/id/packages');
  revalidatePath('/en/packages');
  revalidatePath('/id/packages/[slug]', 'page');
  revalidatePath('/en/packages/[slug]', 'page');

  redirect(withAdminNotice('/admin/car-rentals', 'deleted', 'Car rental berhasil dihapus.'));
}

export default async function AdminCarRentalsPage() {
  const supabase = await createClient();

  const [{ data: cars }, { data: i18nRows }, { data: mediaRows }] = await Promise.all([
    supabase.from('car_rentals').select('*').order('created_at', { ascending: false }),
    supabase.from('car_rental_i18n').select('*').in('locale', ['id', 'en']),
    supabase.from('media_assets').select('id, source_url'),
  ]);

  const mediaMap = new Map((mediaRows || []).map((row) => [row.id, row.source_url]));

  const i18nMap = new Map<string, { id?: any; en?: any }>();
  for (const row of i18nRows || []) {
    const entry = i18nMap.get(row.car_rental_id) || {};
    if (row.locale === 'id') entry.id = row;
    if (row.locale === 'en') entry.en = row;
    i18nMap.set(row.car_rental_id, entry);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold text-brand-dark">Car Rentals</h1>

        <form action={createCarRentalAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="code" placeholder="code" className="rounded-md border px-3 py-2 text-sm" />
          <select name="status" className="rounded-md border px-3 py-2 text-sm" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
          <input name="price_idr" type="number" placeholder="price_idr" className="rounded-md border px-3 py-2 text-sm" />
          <input name="seats" type="number" placeholder="seats" className="rounded-md border px-3 py-2 text-sm" />
          <input name="transmission" placeholder="transmission" className="rounded-md border px-3 py-2 text-sm" />
          <input name="luggage_capacity" type="number" placeholder="luggage" className="rounded-md border px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="has_ac" defaultChecked className="h-4 w-4" /> Has AC
          </label>
          <input name="media_source_url" placeholder="image source url" className="rounded-md border px-3 py-2 text-sm md:col-span-2" />
          <input name="slug_id" placeholder="slug id" className="rounded-md border px-3 py-2 text-sm" />
          <input name="slug_en" placeholder="slug en" className="rounded-md border px-3 py-2 text-sm" />
          <input name="name_id" placeholder="name id" className="rounded-md border px-3 py-2 text-sm" />
          <input name="name_en" placeholder="name en" className="rounded-md border px-3 py-2 text-sm" />
          <textarea name="description_id" placeholder="description id" className="min-h-20 rounded-md border px-3 py-2 text-sm" />
          <textarea name="description_en" placeholder="description en" className="min-h-20 rounded-md border px-3 py-2 text-sm" />
          <input name="seo_title_id" placeholder="seo title id" className="rounded-md border px-3 py-2 text-sm" />
          <input name="seo_title_en" placeholder="seo title en" className="rounded-md border px-3 py-2 text-sm" />
          <input name="seo_description_id" placeholder="seo description id" className="rounded-md border px-3 py-2 text-sm" />
          <input name="seo_description_en" placeholder="seo description en" className="rounded-md border px-3 py-2 text-sm" />
          <div className="md:col-span-2">
            <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
              Add Car Rental
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6">
        {(cars || []).map((car) => {
          const local = i18nMap.get(car.id) || {};
          return (
            <article key={car.id} className="rounded-lg border p-4">
              <form action={updateCarRentalAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="car_rental_id" value={car.id} />
                <p className="md:col-span-2 text-xs font-mono text-muted-foreground">{car.id}</p>
                <p className="md:col-span-2 text-xs text-muted-foreground">
                  code: <strong>{car.code}</strong> | image:{' '}
                  {car.image_media_id ? mediaMap.get(car.image_media_id) || '-' : '-'}
                </p>
                <select name="status" defaultValue={car.status} className="rounded-md border px-3 py-2 text-sm">
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
                <input name="price_idr" type="number" defaultValue={car.price_idr} className="rounded-md border px-3 py-2 text-sm" />
                <input name="seats" type="number" defaultValue={car.seats || ''} className="rounded-md border px-3 py-2 text-sm" />
                <input name="transmission" defaultValue={car.transmission || ''} className="rounded-md border px-3 py-2 text-sm" />
                <input name="luggage_capacity" type="number" defaultValue={car.luggage_capacity || ''} className="rounded-md border px-3 py-2 text-sm" />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="has_ac" defaultChecked={car.has_ac} className="h-4 w-4" /> Has AC
                </label>
                <input
                  name="media_source_url"
                  defaultValue={car.image_media_id ? mediaMap.get(car.image_media_id) || '' : ''}
                  className="rounded-md border px-3 py-2 text-sm md:col-span-2"
                  placeholder="image source url"
                />
                <input name="slug_id" defaultValue={local.id?.slug || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="slug id" />
                <input name="slug_en" defaultValue={local.en?.slug || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="slug en" />
                <input name="name_id" defaultValue={local.id?.name || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="name id" />
                <input name="name_en" defaultValue={local.en?.name || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="name en" />
                <textarea name="description_id" defaultValue={local.id?.description || ''} className="min-h-20 rounded-md border px-3 py-2 text-sm" />
                <textarea name="description_en" defaultValue={local.en?.description || ''} className="min-h-20 rounded-md border px-3 py-2 text-sm" />
                <input name="seo_title_id" defaultValue={local.id?.seo_title || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="seo title id" />
                <input name="seo_title_en" defaultValue={local.en?.seo_title || ''} className="rounded-md border px-3 py-2 text-sm" placeholder="seo title en" />
                <input
                  name="seo_description_id"
                  defaultValue={local.id?.seo_description || ''}
                  className="rounded-md border px-3 py-2 text-sm"
                  placeholder="seo description id"
                />
                <input
                  name="seo_description_en"
                  defaultValue={local.en?.seo_description || ''}
                  className="rounded-md border px-3 py-2 text-sm"
                  placeholder="seo description en"
                />
                <div className="md:col-span-2 flex items-center gap-2">
                  <button type="submit" className="rounded-md bg-brand-primary px-3 py-2 text-xs font-semibold text-white">
                    Save
                  </button>
                </div>
              </form>

              <form action={deleteCarRentalAction} className="mt-2">
                <input type="hidden" name="car_rental_id" value={car.id} />
                <button type="submit" className="rounded-md border border-red-300 px-3 py-2 text-xs font-semibold text-red-700">
                  Delete
                </button>
              </form>
            </article>
          );
        })}
      </div>
    </section>
  );
}
