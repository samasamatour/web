import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { withAdminNotice } from '@/lib/admin/notice';

function parseJsonArray(value: string): any[] {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

function revalidatePackagePublicPaths(slugId?: string, slugEn?: string) {
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
}

async function upsertMediaBySourceUrl(sourceUrl: string) {
  const supabase = await createClient();

  if (!sourceUrl.trim()) {
    return null;
  }

  const { data: existing } = await supabase
    .from('media_assets')
    .select('id')
    .eq('source_url', sourceUrl)
    .maybeSingle();

  if (existing?.id) {
    return existing.id;
  }

  const { data: inserted } = await supabase
    .from('media_assets')
    .insert({ source_type: 'external', source_url: sourceUrl, is_active: true })
    .select('id')
    .single();

  return inserted?.id || null;
}

async function updatePackageAction(formData: FormData) {
  'use server';

  const supabase = await createClient();
  const packageId = String(formData.get('package_id') || '');
  if (!packageId) {
    return;
  }

  const code = String(formData.get('code') || '').trim();
  const mediaSourceUrl = String(formData.get('media_source_url') || '').trim();
  const slugId = String(formData.get('slug_id') || '').trim();
  const slugEn = String(formData.get('slug_en') || '').trim();
  const heroMediaId = await upsertMediaBySourceUrl(mediaSourceUrl);

  await supabase
    .from('packages')
    .update({
      code,
      status: String(formData.get('status') || 'draft'),
      duration_days: Number(formData.get('duration_days') || 1),
      duration_nights: Number(formData.get('duration_nights') || 0),
      min_pax: Number(formData.get('min_pax') || 0) || null,
      max_pax: Number(formData.get('max_pax') || 0) || null,
      price_idr: Number(formData.get('price_idr') || 0),
      featured: String(formData.get('featured') || 'off') === 'on',
      sort_order: Number(formData.get('sort_order') || 0),
      hero_media_id: heroMediaId,
    })
    .eq('id', packageId);

  for (const locale of ['id', 'en'] as const) {
    const includes = parseJsonArray(String(formData.get(`includes_${locale}`) || '[]'));
    const excludes = parseJsonArray(String(formData.get(`excludes_${locale}`) || '[]'));

    await supabase.from('package_i18n').upsert({
      package_id: packageId,
      locale,
      slug: String(formData.get(`slug_${locale}`) || '').trim(),
      name: String(formData.get(`name_${locale}`) || '').trim(),
      summary: String(formData.get(`summary_${locale}`) || '').trim(),
      overview: String(formData.get(`overview_${locale}`) || '').trim(),
      includes,
      excludes,
      notes: String(formData.get(`notes_${locale}`) || '').trim(),
      seo_title: String(formData.get(`seo_title_${locale}`) || '').trim(),
      seo_description: String(formData.get(`seo_description_${locale}`) || '').trim(),
    });
  }

  const itinerary = parseJsonArray(String(formData.get('itinerary_json') || '[]'));

  const { data: existingDays } = await supabase
    .from('package_itinerary_days')
    .select('id')
    .eq('package_id', packageId);

  const dayIds = (existingDays || []).map((day) => day.id);

  if (dayIds.length) {
    const { data: existingItems } = await supabase
      .from('package_itinerary_items')
      .select('id')
      .in('day_id', dayIds);

    const itemIds = (existingItems || []).map((item) => item.id);

    if (itemIds.length) {
      await supabase.from('package_itinerary_item_i18n').delete().in('item_id', itemIds);
      await supabase.from('package_itinerary_items').delete().in('id', itemIds);
    }

    await supabase.from('package_itinerary_day_i18n').delete().in('day_id', dayIds);
    await supabase.from('package_itinerary_days').delete().in('id', dayIds);
  }

  for (const day of itinerary) {
    const dayNumber = Number(day?.dayNumber || 0);
    if (!dayNumber) {
      continue;
    }

    const { data: dayRow } = await supabase
      .from('package_itinerary_days')
      .insert({
        package_id: packageId,
        day_number: dayNumber,
      })
      .select('id')
      .single();

    if (!dayRow?.id) {
      continue;
    }

    const dayId = dayRow.id;
    const dayTitle = day?.title || {};

    await supabase.from('package_itinerary_day_i18n').insert([
      {
        day_id: dayId,
        locale: 'id',
        title: String(dayTitle.id || `Day ${dayNumber}`),
      },
      {
        day_id: dayId,
        locale: 'en',
        title: String(dayTitle.en || `Day ${dayNumber}`),
      },
    ]);

    const items = Array.isArray(day?.items) ? day.items : [];

    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      const { data: itemRow } = await supabase
        .from('package_itinerary_items')
        .insert({
          day_id: dayId,
          position: Number(item?.position || index + 1),
          time_label: String(item?.timeLabel || ''),
        })
        .select('id')
        .single();

      if (!itemRow?.id) {
        continue;
      }

      const activity = item?.activity || {};
      const details = item?.details || {};

      await supabase.from('package_itinerary_item_i18n').insert([
        {
          item_id: itemRow.id,
          locale: 'id',
          activity: String(activity.id || 'Aktivitas'),
          details: String(details.id || ''),
        },
        {
          item_id: itemRow.id,
          locale: 'en',
          activity: String(activity.en || 'Activity'),
          details: String(details.en || ''),
        },
      ]);
    }
  }

  await supabase.from('package_cost_items').delete().eq('package_id', packageId);

  const costs = parseJsonArray(String(formData.get('costs_json') || '[]'));
  if (costs.length) {
    const rows = costs.map((cost, index) => ({
      package_id: packageId,
      cost_group: String(cost.costGroup || 'summary'),
      day_number: cost.dayNumber ? Number(cost.dayNumber) : null,
      position: Number(cost.position || index + 1),
      label: String(cost.label || `Item ${index + 1}`),
      amount_idr: Number(cost.amountIdr || 0),
      notes: String(cost.notes || ''),
    }));

    await supabase.from('package_cost_items').insert(rows);
  }

  const carIdsRaw = String(formData.get('car_rental_ids') || '');
  const carIds = carIdsRaw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

  await supabase.from('package_car_rentals').delete().eq('package_id', packageId);
  if (carIds.length) {
    await supabase.from('package_car_rentals').insert(
      carIds.map((carId, index) => ({
        package_id: packageId,
        car_rental_id: carId,
        position: index + 1,
      }))
    );
  }

  revalidatePath(`/admin/packages/${packageId}`);
  revalidatePath('/admin/packages');
  revalidatePackagePublicPaths(slugId, slugEn);

  redirect(withAdminNotice(`/admin/packages/${packageId}`, 'success', 'Paket berhasil disimpan.'));
}

async function deletePackageAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const packageId = String(formData.get('package_id') || '');
  if (!packageId) {
    return;
  }

  await supabase.from('packages').delete().eq('id', packageId);
  revalidatePath('/admin/packages');
  revalidatePackagePublicPaths();
  redirect(withAdminNotice('/admin/packages', 'deleted', 'Paket berhasil dihapus.'));
}

function prettyJson(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export default async function AdminPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!pkg) {
    notFound();
  }

  const [i18nRowsRes, mediaRes, daysRes, costsRes, carMapRes, allCarsRes] = await Promise.all([
    supabase.from('package_i18n').select('*').eq('package_id', pkg.id),
    pkg.hero_media_id
      ? supabase.from('media_assets').select('source_url').eq('id', pkg.hero_media_id).maybeSingle()
      : Promise.resolve({ data: null } as any),
    supabase
      .from('package_itinerary_days')
      .select('id, day_number')
      .eq('package_id', pkg.id)
      .order('day_number', { ascending: true }),
    supabase
      .from('package_cost_items')
      .select('*')
      .eq('package_id', pkg.id)
      .order('day_number', { ascending: true, nullsFirst: true })
      .order('position', { ascending: true }),
    supabase
      .from('package_car_rentals')
      .select('car_rental_id, position')
      .eq('package_id', pkg.id)
      .order('position', { ascending: true }),
    supabase
      .from('car_rentals')
      .select('id, code, price_idr')
      .order('code', { ascending: true }),
  ]);

  const dayIds = (daysRes.data || []).map((row) => row.id);

  const [dayI18nRes, itemsRes] = dayIds.length
    ? await Promise.all([
        supabase.from('package_itinerary_day_i18n').select('*').in('day_id', dayIds),
        supabase.from('package_itinerary_items').select('*').in('day_id', dayIds),
      ])
    : [{ data: [] as any[] }, { data: [] as any[] }];

  const itemIds = (itemsRes.data || []).map((item) => item.id);
  const itemI18nRes = itemIds.length
    ? await supabase.from('package_itinerary_item_i18n').select('*').in('item_id', itemIds)
    : { data: [] as any[] };

  const i18nRows = i18nRowsRes.data || [];
  const byLocale = new Map(i18nRows.map((row) => [row.locale, row]));

  const dayRows = daysRes.data || [];
  const dayI18nRows = dayI18nRes.data || [];
  const itemRows = itemsRes.data || [];
  const itemI18nRows = itemI18nRes.data || [];

  const dayTitleMap = new Map<string, { id?: string; en?: string }>();
  for (const row of dayI18nRows) {
    const entry = dayTitleMap.get(row.day_id) || {};
    if (row.locale === 'id') entry.id = row.title;
    if (row.locale === 'en') entry.en = row.title;
    dayTitleMap.set(row.day_id, entry);
  }

  const itemTextMap = new Map<string, { activity: { id?: string; en?: string }; details: { id?: string; en?: string } }>();
  for (const row of itemI18nRows) {
    const entry = itemTextMap.get(row.item_id) || { activity: {}, details: {} };
    if (row.locale === 'id') {
      entry.activity.id = row.activity;
      entry.details.id = row.details;
    }
    if (row.locale === 'en') {
      entry.activity.en = row.activity;
      entry.details.en = row.details;
    }
    itemTextMap.set(row.item_id, entry);
  }

  const itineraryJson = dayRows.map((day) => {
    const dayItems = itemRows
      .filter((item) => item.day_id === day.id)
      .sort((a, b) => a.position - b.position)
      .map((item) => {
        const text = itemTextMap.get(item.id) || { activity: {}, details: {} };
        return {
          position: item.position,
          timeLabel: item.time_label,
          activity: {
            id: text.activity.id || '',
            en: text.activity.en || '',
          },
          details: {
            id: text.details.id || '',
            en: text.details.en || '',
          },
        };
      });

    const dayTitle = dayTitleMap.get(day.id) || {};

    return {
      dayNumber: day.day_number,
      title: {
        id: dayTitle.id || '',
        en: dayTitle.en || '',
      },
      items: dayItems,
    };
  });

  const selectedCarIds = (carMapRes.data || []).map((row) => row.car_rental_id);

  return (
    <section className="space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold text-brand-dark">Edit Package</h1>

        <form action={updatePackageAction} className="mt-4 grid gap-4 md:grid-cols-2">
          <input type="hidden" name="package_id" value={pkg.id} />

          <label className="text-sm">
            <span className="mb-1 block font-medium">Code</span>
            <input name="code" defaultValue={pkg.code} className="w-full rounded-md border px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium">Status</span>
            <select name="status" defaultValue={pkg.status} className="w-full rounded-md border px-3 py-2">
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium">Price IDR</span>
            <input
              name="price_idr"
              type="number"
              defaultValue={Number(pkg.price_idr)}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium">Sort Order</span>
            <input name="sort_order" type="number" defaultValue={pkg.sort_order} className="w-full rounded-md border px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium">Duration Days</span>
            <input
              name="duration_days"
              type="number"
              defaultValue={pkg.duration_days}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium">Duration Nights</span>
            <input
              name="duration_nights"
              type="number"
              defaultValue={pkg.duration_nights}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium">Min Pax</span>
            <input name="min_pax" type="number" defaultValue={pkg.min_pax || ''} className="w-full rounded-md border px-3 py-2" />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium">Max Pax</span>
            <input name="max_pax" type="number" defaultValue={pkg.max_pax || ''} className="w-full rounded-md border px-3 py-2" />
          </label>

          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Hero Image URL (Google Drive/External)</span>
            <input
              name="media_source_url"
              defaultValue={mediaRes.data?.source_url || ''}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="featured" defaultChecked={pkg.featured} className="h-4 w-4" />
            Featured package
          </label>

          {(['id', 'en'] as const).map((locale) => {
            const row = byLocale.get(locale);
            return (
              <div key={locale} className="rounded-lg border p-4 md:col-span-2">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Locale: {locale}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Slug</span>
                    <input name={`slug_${locale}`} defaultValue={row?.slug || ''} className="w-full rounded-md border px-3 py-2" />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Name</span>
                    <input name={`name_${locale}`} defaultValue={row?.name || ''} className="w-full rounded-md border px-3 py-2" />
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block font-medium">Summary</span>
                    <textarea
                      name={`summary_${locale}`}
                      defaultValue={row?.summary || ''}
                      className="min-h-20 w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block font-medium">Overview</span>
                    <textarea
                      name={`overview_${locale}`}
                      defaultValue={row?.overview || ''}
                      className="min-h-28 w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Includes JSON Array</span>
                    <textarea
                      name={`includes_${locale}`}
                      defaultValue={prettyJson(row?.includes || [])}
                      className="min-h-24 w-full rounded-md border px-3 py-2 font-mono text-xs"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Excludes JSON Array</span>
                    <textarea
                      name={`excludes_${locale}`}
                      defaultValue={prettyJson(row?.excludes || [])}
                      className="min-h-24 w-full rounded-md border px-3 py-2 font-mono text-xs"
                    />
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block font-medium">Notes</span>
                    <textarea
                      name={`notes_${locale}`}
                      defaultValue={row?.notes || ''}
                      className="min-h-20 w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">SEO Title</span>
                    <input name={`seo_title_${locale}`} defaultValue={row?.seo_title || ''} className="w-full rounded-md border px-3 py-2" />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">SEO Description</span>
                    <input
                      name={`seo_description_${locale}`}
                      defaultValue={row?.seo_description || ''}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                </div>
              </div>
            );
          })}

          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Itinerary JSON</span>
            <textarea
              name="itinerary_json"
              defaultValue={prettyJson(itineraryJson)}
              className="min-h-80 w-full rounded-md border px-3 py-2 font-mono text-xs"
            />
          </label>

          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Cost Items JSON</span>
            <textarea
              name="costs_json"
              defaultValue={prettyJson(costsRes.data || [])}
              className="min-h-72 w-full rounded-md border px-3 py-2 font-mono text-xs"
            />
          </label>

          <label className="text-sm md:col-span-2">
            <span className="mb-1 block font-medium">Car Rental IDs (comma separated)</span>
            <input
              name="car_rental_ids"
              defaultValue={selectedCarIds.join(',')}
              className="w-full rounded-md border px-3 py-2 font-mono text-xs"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Available: {(allCarsRes.data || []).map((car) => `${car.id} (${car.code})`).join(', ')}
            </p>
          </label>

          <div className="md:col-span-2">
            <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
              Save Package
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-bold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-700">
          Deleting a package removes its translations, itinerary, costs, and package relations.
        </p>
        <form action={deletePackageAction} className="mt-3">
          <input type="hidden" name="package_id" value={pkg.id} />
          <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">
            Delete Package
          </button>
        </form>
      </div>
    </section>
  );
}
