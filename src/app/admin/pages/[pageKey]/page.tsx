import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

async function updatePageMetadataAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const pageId = String(formData.get('page_id'));
  const pageKey = String(formData.get('page_key'));
  const status = String(formData.get('status'));

  await supabase
    .from('cms_pages')
    .update({ status })
    .eq('id', pageId);

  const locales = ['id', 'en'] as const;
  for (const locale of locales) {
    await supabase.from('cms_page_i18n').upsert({
      page_id: pageId,
      locale,
      title: String(formData.get(`title_${locale}`) || pageKey),
      seo_title: String(formData.get(`seo_title_${locale}`) || ''),
      seo_description: String(formData.get(`seo_description_${locale}`) || ''),
      robots: String(formData.get(`robots_${locale}`) || 'index,follow'),
      canonical_path: String(formData.get(`canonical_path_${locale}`) || ''),
    });
  }

  revalidatePath(`/admin/pages/${pageKey}`);
  revalidatePath('/admin/pages');
}

async function upsertSectionAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const pageId = String(formData.get('page_id'));
  const pageKey = String(formData.get('page_key'));
  const sectionId = String(formData.get('section_id') || '');
  const sectionKey = String(formData.get('section_key') || '');
  const sectionType = String(formData.get('section_type') || 'text');
  const position = Number(formData.get('position') || 0);
  const enabled = String(formData.get('enabled') || 'on') === 'on';

  let config: Record<string, unknown> = {};
  try {
    const raw = String(formData.get('config_json') || '{}');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      config = parsed;
    }
  } catch {
    config = {};
  }

  let upsertSectionId = sectionId;
  if (sectionId) {
    await supabase
      .from('cms_sections')
      .update({
        section_key: sectionKey,
        section_type: sectionType,
        position,
        enabled,
        config,
      })
      .eq('id', sectionId);
  } else {
    const { data } = await supabase
      .from('cms_sections')
      .insert({
        page_id: pageId,
        section_key: sectionKey,
        section_type: sectionType,
        position,
        enabled,
        config,
      })
      .select('id')
      .single();

    upsertSectionId = data?.id || '';
  }

  if (upsertSectionId) {
    for (const locale of ['id', 'en'] as const) {
      let content: Record<string, unknown> = {};
      try {
        const raw = String(formData.get(`content_${locale}`) || '{}');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          content = parsed;
        }
      } catch {
        content = {};
      }

      await supabase.from('cms_section_i18n').upsert({
        section_id: upsertSectionId,
        locale,
        content,
      });
    }
  }

  revalidatePath(`/admin/pages/${pageKey}`);
  revalidatePath('/admin/pages');
  revalidatePath('/id');
  revalidatePath('/en');
}

async function deleteSectionAction(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const sectionId = String(formData.get('section_id') || '');
  const pageKey = String(formData.get('page_key') || 'home');

  if (sectionId) {
    await supabase.from('cms_sections').delete().eq('id', sectionId);
  }

  revalidatePath(`/admin/pages/${pageKey}`);
  revalidatePath('/admin/pages');
  revalidatePath('/id');
  revalidatePath('/en');
}

export default async function AdminPageDetail({
  params,
}: {
  params: Promise<{ pageKey: string }>;
}) {
  const { pageKey } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('cms_pages')
    .select('id, page_key, status')
    .eq('page_key', pageKey)
    .maybeSingle();

  if (!page) {
    notFound();
  }

  const [{ data: i18nRows }, { data: sections }] = await Promise.all([
    supabase
      .from('cms_page_i18n')
      .select('locale, title, seo_title, seo_description, robots, canonical_path')
      .eq('page_id', page.id),
    supabase
      .from('cms_sections')
      .select('id, section_key, section_type, position, enabled, config')
      .eq('page_id', page.id)
      .order('position', { ascending: true }),
  ]);

  const sectionIds = (sections || []).map((section) => section.id);
  const { data: sectionI18nRows } = sectionIds.length
    ? await supabase
        .from('cms_section_i18n')
        .select('section_id, locale, content')
        .in('section_id', sectionIds)
    : { data: [] as any[] };

  const i18nByLocale = new Map((i18nRows || []).map((row) => [row.locale, row]));

  return (
    <section className="space-y-6">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-bold text-brand-dark">Edit Page: {page.page_key}</h1>

        <form action={updatePageMetadataAction} className="mt-4 grid gap-4">
          <input type="hidden" name="page_id" value={page.id} />
          <input type="hidden" name="page_key" value={page.page_key} />

          <label className="text-sm">
            <span className="mb-1 block font-medium">Status</span>
            <select name="status" defaultValue={page.status} className="w-full rounded-md border px-3 py-2 md:w-64">
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </label>

          {(['id', 'en'] as const).map((locale) => {
            const row = i18nByLocale.get(locale);
            return (
              <div key={locale} className="rounded-lg border p-4">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">{locale}</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Title</span>
                    <input
                      name={`title_${locale}`}
                      defaultValue={row?.title || ''}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Canonical Path</span>
                    <input
                      name={`canonical_path_${locale}`}
                      defaultValue={row?.canonical_path || ''}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">SEO Title</span>
                    <input
                      name={`seo_title_${locale}`}
                      defaultValue={row?.seo_title || ''}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Robots</span>
                    <input
                      name={`robots_${locale}`}
                      defaultValue={row?.robots || 'index,follow'}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm md:col-span-2">
                    <span className="mb-1 block font-medium">SEO Description</span>
                    <textarea
                      name={`seo_description_${locale}`}
                      defaultValue={row?.seo_description || ''}
                      className="min-h-24 w-full rounded-md border px-3 py-2"
                    />
                  </label>
                </div>
              </div>
            );
          })}

          <button type="submit" className="w-fit rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
            Save Page Metadata
          </button>
        </form>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6">
        <h2 className="text-xl font-bold text-brand-dark">Sections</h2>

        {(sections || []).map((section) => {
          const idRow = (sectionI18nRows || []).find(
            (row) => row.section_id === section.id && row.locale === 'id'
          );
          const enRow = (sectionI18nRows || []).find(
            (row) => row.section_id === section.id && row.locale === 'en'
          );

          return (
            <article key={section.id} className="rounded-lg border p-4">
              <form action={upsertSectionAction} className="space-y-3">
                <input type="hidden" name="page_id" value={page.id} />
                <input type="hidden" name="page_key" value={page.page_key} />
                <input type="hidden" name="section_id" value={section.id} />

                <div className="grid gap-3 md:grid-cols-4">
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Section Key</span>
                    <input
                      name="section_key"
                      defaultValue={section.section_key}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Section Type</span>
                    <input
                      name="section_type"
                      defaultValue={section.section_type}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Position</span>
                    <input
                      name="position"
                      type="number"
                      defaultValue={section.position}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </label>
                  <label className="flex items-center gap-2 pt-6 text-sm">
                    <input
                      name="enabled"
                      type="checkbox"
                      defaultChecked={section.enabled}
                      className="h-4 w-4"
                    />
                    Enabled
                  </label>
                </div>

                <label className="text-sm">
                  <span className="mb-1 block font-medium">Config JSON</span>
                  <textarea
                    name="config_json"
                    defaultValue={JSON.stringify(section.config || {}, null, 2)}
                    className="min-h-24 w-full rounded-md border px-3 py-2 font-mono text-xs"
                  />
                </label>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Content JSON (ID)</span>
                    <textarea
                      name="content_id"
                      defaultValue={JSON.stringify(idRow?.content || {}, null, 2)}
                      className="min-h-40 w-full rounded-md border px-3 py-2 font-mono text-xs"
                    />
                  </label>
                  <label className="text-sm">
                    <span className="mb-1 block font-medium">Content JSON (EN)</span>
                    <textarea
                      name="content_en"
                      defaultValue={JSON.stringify(enRow?.content || {}, null, 2)}
                      className="min-h-40 w-full rounded-md border px-3 py-2 font-mono text-xs"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button type="submit" className="rounded-md bg-brand-primary px-3 py-2 text-xs font-semibold text-white">
                    Save Section
                  </button>
                </div>
              </form>

              <form action={deleteSectionAction} className="mt-2">
                <input type="hidden" name="section_id" value={section.id} />
                <input type="hidden" name="page_key" value={page.page_key} />
                <button type="submit" className="rounded-md border border-red-300 px-3 py-2 text-xs font-semibold text-red-700">
                  Delete Section
                </button>
              </form>
            </article>
          );
        })}

        <article className="rounded-lg border border-dashed p-4">
          <h3 className="mb-3 text-sm font-semibold">Add New Section</h3>
          <form action={upsertSectionAction} className="space-y-3">
            <input type="hidden" name="page_id" value={page.id} />
            <input type="hidden" name="page_key" value={page.page_key} />
            <div className="grid gap-3 md:grid-cols-3">
              <input name="section_key" placeholder="section_key" className="rounded-md border px-3 py-2 text-sm" />
              <input name="section_type" placeholder="section_type" className="rounded-md border px-3 py-2 text-sm" />
              <input name="position" type="number" defaultValue={99} className="rounded-md border px-3 py-2 text-sm" />
            </div>
            <input type="hidden" name="enabled" value="on" />
            <label className="text-sm">
              <span className="mb-1 block font-medium">Config JSON</span>
              <textarea name="config_json" defaultValue="{}" className="min-h-20 w-full rounded-md border px-3 py-2 font-mono text-xs" />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <textarea name="content_id" defaultValue="{}" className="min-h-28 w-full rounded-md border px-3 py-2 font-mono text-xs" />
              <textarea name="content_en" defaultValue="{}" className="min-h-28 w-full rounded-md border px-3 py-2 font-mono text-xs" />
            </div>
            <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
              Add Section
            </button>
          </form>
        </article>
      </div>
    </section>
  );
}
