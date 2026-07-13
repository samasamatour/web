import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

type MenuJsonItem = {
  kind: 'internal' | 'external' | 'cta';
  href: string;
  position: number;
  enabled?: boolean;
  label_id: string;
  label_en: string;
};

async function saveMenuAction(formData: FormData) {
  'use server';
  const supabase = await createClient();
  const menuId = String(formData.get('menu_id') || '');
  if (!menuId) {
    return;
  }

  let items: MenuJsonItem[] = [];
  try {
    const parsed = JSON.parse(String(formData.get('items_json') || '[]'));
    if (Array.isArray(parsed)) {
      items = parsed;
    }
  } catch {
    items = [];
  }

  const { data: existingItems } = await supabase
    .from('menu_items')
    .select('id')
    .eq('menu_id', menuId);

  const existingIds = (existingItems || []).map((item) => item.id);
  if (existingIds.length) {
    await supabase.from('menu_item_i18n').delete().in('menu_item_id', existingIds);
    await supabase.from('menu_items').delete().in('id', existingIds);
  }

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const { data: inserted } = await supabase
      .from('menu_items')
      .insert({
        menu_id: menuId,
        kind: item.kind || 'internal',
        href: item.href || '#',
        position: Number(item.position || index + 1),
        enabled: item.enabled !== false,
      })
      .select('id')
      .single();

    if (!inserted?.id) {
      continue;
    }

    await supabase.from('menu_item_i18n').insert([
      {
        menu_item_id: inserted.id,
        locale: 'id',
        label: item.label_id || 'Menu',
      },
      {
        menu_item_id: inserted.id,
        locale: 'en',
        label: item.label_en || 'Menu',
      },
    ]);
  }

  revalidatePath('/admin/menus');
  revalidatePath('/id');
  revalidatePath('/en');
}

export default async function AdminMenusPage() {
  const supabase = await createClient();

  const [{ data: menus }, { data: menuItems }, { data: itemI18n }] = await Promise.all([
    supabase.from('menus').select('*').order('code', { ascending: true }),
    supabase.from('menu_items').select('*').order('position', { ascending: true }),
    supabase.from('menu_item_i18n').select('*'),
  ]);

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-dark">Menus</h1>

      {(menus || []).map((menu) => {
        const items = (menuItems || []).filter((item) => item.menu_id === menu.id);
        const serialized = items.map((item) => {
          const idRow = (itemI18n || []).find(
            (row) => row.menu_item_id === item.id && row.locale === 'id'
          );
          const enRow = (itemI18n || []).find(
            (row) => row.menu_item_id === item.id && row.locale === 'en'
          );

          return {
            kind: item.kind,
            href: item.href,
            position: item.position,
            enabled: item.enabled,
            label_id: idRow?.label || 'Menu',
            label_en: enRow?.label || 'Menu',
          };
        });

        return (
          <article key={menu.id} className="rounded-xl border bg-white p-6">
            <h2 className="text-xl font-semibold text-brand-dark">{menu.code}</h2>
            <p className="text-sm text-muted-foreground">Use <code>{'{locale}'}</code> placeholder in href for locale path.</p>

            <form action={saveMenuAction} className="mt-4 space-y-3">
              <input type="hidden" name="menu_id" value={menu.id} />
              <textarea
                name="items_json"
                defaultValue={JSON.stringify(serialized, null, 2)}
                className="min-h-80 w-full rounded-md border px-3 py-2 font-mono text-xs"
              />
              <button type="submit" className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white">
                Save Menu
              </button>
            </form>
          </article>
        );
      })}
    </section>
  );
}
