import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { withAdminNotice } from '@/lib/admin/notice';

async function updateSettingsAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  const payload = {
    organization_name: String(formData.get('organization_name') || 'Sama Sama Tour'),
    canonical_base_url: String(formData.get('canonical_base_url') || 'https://samasamatour.com'),
    default_locale: String(formData.get('default_locale') || 'en'),
    whatsapp_number: String(formData.get('whatsapp_number') || '6282236037774'),
    contact_email: String(formData.get('contact_email') || ''),
    contact_phone: String(formData.get('contact_phone') || ''),
    contact_address: String(formData.get('contact_address') || ''),
    usd_to_idr: Number(formData.get('usd_to_idr') || 16000),
    usd_last_updated: new Date().toISOString(),
    global_seo_title_id: String(formData.get('global_seo_title_id') || ''),
    global_seo_title_en: String(formData.get('global_seo_title_en') || ''),
    global_seo_description_id: String(formData.get('global_seo_description_id') || ''),
    global_seo_description_en: String(formData.get('global_seo_description_en') || ''),
  };

  await supabase.from('site_settings').upsert({ id: 1, ...payload });

  revalidatePath('/admin/settings');
  revalidatePath('/en');
  revalidatePath('/id');

  redirect(withAdminNotice('/admin/settings', 'success', 'Settings berhasil disimpan.'));
}

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .single();

  return (
    <section className="space-y-4 rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold text-brand-dark">Global Settings</h1>

      <form action={updateSettingsAction} className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Organization Name</span>
          <input
            name="organization_name"
            defaultValue={settings?.organization_name || 'Sama Sama Tour'}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Canonical Base URL</span>
          <input
            name="canonical_base_url"
            defaultValue={settings?.canonical_base_url || 'https://samasamatour.com'}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Default Locale</span>
          <select
            name="default_locale"
            defaultValue={settings?.default_locale || 'en'}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">WhatsApp Number</span>
          <input
            name="whatsapp_number"
            defaultValue={settings?.whatsapp_number || '6282236037774'}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Contact Email</span>
          <input
            name="contact_email"
            defaultValue={settings?.contact_email || ''}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">Contact Phone</span>
          <input
            name="contact_phone"
            defaultValue={settings?.contact_phone || ''}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm md:col-span-2">
          <span className="mb-1 block font-medium">Contact Address</span>
          <input
            name="contact_address"
            defaultValue={settings?.contact_address || ''}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <label className="text-sm">
          <span className="mb-1 block font-medium">USD to IDR rate</span>
          <input
            name="usd_to_idr"
            type="number"
            defaultValue={Number(settings?.usd_to_idr || 16000)}
            className="w-full rounded-md border px-3 py-2"
          />
        </label>

        <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium">SEO Title (ID)</span>
            <input
              name="global_seo_title_id"
              defaultValue={settings?.global_seo_title_id || ''}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">SEO Title (EN)</span>
            <input
              name="global_seo_title_en"
              defaultValue={settings?.global_seo_title_en || ''}
              className="w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">SEO Description (ID)</span>
            <textarea
              name="global_seo_description_id"
              defaultValue={settings?.global_seo_description_id || ''}
              className="min-h-24 w-full rounded-md border px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium">SEO Description (EN)</span>
            <textarea
              name="global_seo_description_en"
              defaultValue={settings?.global_seo_description_en || ''}
              className="min-h-24 w-full rounded-md border px-3 py-2"
            />
          </label>
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 font-semibold text-white">
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
}
