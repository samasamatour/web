import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function AdminPagesIndex() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from('cms_pages')
    .select('id, page_key, status, updated_at')
    .order('page_key', { ascending: true });

  return (
    <section className="space-y-4 rounded-xl border bg-white p-6">
      <h1 className="text-2xl font-bold text-brand-dark">CMS Pages</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="py-2">Page Key</th>
              <th className="py-2">Status</th>
              <th className="py-2">Updated</th>
              <th className="py-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {(pages || []).map((page) => (
              <tr key={page.id} className="border-b">
                <td className="py-2 font-medium">{page.page_key}</td>
                <td className="py-2">{page.status}</td>
                <td className="py-2">
                  {page.updated_at
                    ? new Date(page.updated_at).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : '-'}
                </td>
                <td className="py-2 text-right">
                  <Link
                    href={`/admin/pages/${page.page_key}`}
                    className="rounded-md border px-3 py-1 text-xs font-semibold"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
