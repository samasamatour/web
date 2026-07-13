import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type RedirectItem = {
  from_path: string;
  to_path: string;
  status_code?: 301 | 302;
  enabled?: boolean;
};

async function saveRedirectsAction(formData: FormData) {
  'use server';
  const supabase = await createClient();

  let rows: RedirectItem[] = [];
  try {
    const parsed = JSON.parse(String(formData.get('redirects_json') || '[]'));
    if (Array.isArray(parsed)) {
      rows = parsed;
    }
  } catch {
    rows = [];
  }

  await supabase.from('redirects').delete().neq('from_path', '');

  if (rows.length) {
    await supabase.from('redirects').insert(
      rows
        .filter((row) => row.from_path && row.to_path)
        .map((row) => ({
          from_path: row.from_path,
          to_path: row.to_path,
          status_code: row.status_code || 301,
          enabled: row.enabled !== false,
        }))
    );
  }

  revalidatePath('/admin/redirects');
}

export default async function AdminRedirectsPage() {
  const supabase = await createClient();
  const { data: redirects } = await supabase
    .from('redirects')
    .select('from_path, to_path, status_code, enabled')
    .order('from_path', { ascending: true });

  return (
    <section className="space-y-4 rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold text-brand-dark">Redirect Rules</h1>
      <p className="text-sm text-muted-foreground">
        Manage legacy URL redirects (301/302). Rules are consumed by route fallback.
      </p>

      <form action={saveRedirectsAction} className="space-y-3">
        <textarea
          name="redirects_json"
          defaultValue={JSON.stringify(redirects || [], null, 2)}
          className="min-h-96 w-full rounded-md border px-3 py-2 font-mono text-xs"
        />
        <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          Save Redirects
        </button>
      </form>
    </section>
  );
}
