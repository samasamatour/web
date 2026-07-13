import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPackagesIndexPage() {
  const supabase = await createClient();

  const [{ data: packages }, { data: i18nRows }] = await Promise.all([
    supabase
      .from('packages')
      .select('id, code, status, price_idr, updated_at')
      .order('sort_order', { ascending: true }),
    supabase
      .from('package_i18n')
      .select('package_id, locale, name, slug')
      .in('locale', ['id', 'en']),
  ]);

  const names = new Map<string, { id?: string; en?: string; slug?: string }>();
  for (const row of i18nRows || []) {
    const entry = names.get(row.package_id) || {};
    if (row.locale === 'id') {
      entry.id = row.name;
      entry.slug = row.slug;
    }
    if (row.locale === 'en') {
      entry.en = row.name;
      entry.slug = entry.slug || row.slug;
    }
    names.set(row.package_id, entry);
  }

  return (
    <section className="space-y-4 rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-dark">Packages</h1>
        <Link href="/admin/packages/new" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
          New Package
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Code</th>
              <th className="py-2">Name (ID/EN)</th>
              <th className="py-2">Price IDR</th>
              <th className="py-2">Status</th>
              <th className="py-2">Updated</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(packages || []).map((pkg) => {
              const localized = names.get(pkg.id) || {};
              return (
                <tr key={pkg.id} className="border-b">
                  <td className="py-2 font-mono text-xs">{pkg.code}</td>
                  <td className="py-2">
                    <p className="font-medium">{localized.id || '-'}</p>
                    <p className="text-xs text-muted-foreground">{localized.en || '-'}</p>
                  </td>
                  <td className="py-2">{Number(pkg.price_idr).toLocaleString('id-ID')}</td>
                  <td className="py-2">{pkg.status}</td>
                  <td className="py-2">
                    {pkg.updated_at
                      ? new Date(pkg.updated_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="py-2 text-right">
                    <Link href={`/admin/packages/${pkg.id}`} className="rounded-md border px-3 py-1 text-xs font-semibold">
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
