import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [packagesRes, pagesRes, blogRes, mediaRes] = await Promise.all([
    supabase.from('packages').select('id', { count: 'exact', head: true }),
    supabase.from('cms_pages').select('id', { count: 'exact', head: true }),
    supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
    supabase.from('media_assets').select('id', { count: 'exact', head: true }),
  ]);

  const cards = [
    { label: 'Packages', value: packagesRes.count || 0 },
    { label: 'CMS Pages', value: pagesRes.count || 0 },
    { label: 'Blog Posts', value: blogRes.count || 0 },
    { label: 'Media Links', value: mediaRes.count || 0 },
  ];

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-dark">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Full CMS control for bilingual website content, packages, blog, and SEO settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="rounded-xl border bg-white p-5">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-brand-dark">{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
