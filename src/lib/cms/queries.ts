import { createClient } from '@/lib/supabase/server';
import { Locale } from '@/lib/i18n';

export type SiteSettings = {
  organization_name: string;
  canonical_base_url: string;
  default_locale: Locale;
  whatsapp_number: string;
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  usd_to_idr: number;
  usd_last_updated: string;
  global_seo_title_id: string | null;
  global_seo_title_en: string | null;
  global_seo_description_id: string | null;
  global_seo_description_en: string | null;
};

export type LocalizedPage = {
  pageId: string;
  pageKey: string;
  title: string;
  seoTitle: string | null;
  seoDescription: string | null;
  robots: string;
  canonicalPath: string | null;
  sections: {
    id: string;
    sectionKey: string;
    sectionType: string;
    position: number;
    config: Record<string, unknown>;
    content: Record<string, unknown>;
  }[];
};

export type PackageListItem = {
  id: string;
  code: string;
  slug: string;
  name: string;
  summary: string | null;
  durationDays: number;
  durationNights: number;
  minPax: number | null;
  maxPax: number | null;
  priceIdr: number;
  featured: boolean;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type PackageDetail = PackageListItem & {
  overview: string | null;
  includes: string[];
  excludes: string[];
  notes: string | null;
  itinerary: {
    dayNumber: number;
    title: string;
    items: {
      timeLabel: string | null;
      activity: string;
      details: string | null;
      position: number;
    }[];
  }[];
  costs: {
    id: string;
    costGroup: string;
    dayNumber: number | null;
    position: number;
    label: string;
    amountIdr: number;
    notes: string | null;
  }[];
  carRentals: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    priceIdr: number;
    seats: number | null;
    transmission: string | null;
    hasAc: boolean;
    luggageCapacity: number | null;
    imageUrl: string | null;
  }[];
};

export type BlogListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  coverImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

export type BlogDetail = BlogListItem & {
  contentMarkdown: string;
  robots: string;
  canonicalPath: string | null;
};

export type MenuItem = {
  id: string;
  href: string;
  label: string;
  kind: string;
  position: number;
};

function getTextValue(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }

  return '';
}

function asJsonObject(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('site_settings')
    .select(
      'organization_name, canonical_base_url, default_locale, whatsapp_number, contact_email, contact_phone, contact_address, usd_to_idr, usd_last_updated, global_seo_title_id, global_seo_title_en, global_seo_description_id, global_seo_description_en'
    )
    .eq('id', 1)
    .single();

  return {
    organization_name: data?.organization_name || 'Sama Sama Tour',
    canonical_base_url: data?.canonical_base_url || 'https://samasamatour.com',
    default_locale: (data?.default_locale || 'en') as Locale,
    whatsapp_number: data?.whatsapp_number || '6282236037774',
    contact_email: data?.contact_email || null,
    contact_phone: data?.contact_phone || null,
    contact_address: data?.contact_address || null,
    usd_to_idr: Number(data?.usd_to_idr || 16000),
    usd_last_updated: data?.usd_last_updated || new Date().toISOString(),
    global_seo_title_id: data?.global_seo_title_id || null,
    global_seo_title_en: data?.global_seo_title_en || null,
    global_seo_description_id: data?.global_seo_description_id || null,
    global_seo_description_en: data?.global_seo_description_en || null,
  };
}

export async function getPageByKey(locale: Locale, pageKey: string): Promise<LocalizedPage | null> {
  const supabase = await createClient();

  const { data: page } = await supabase
    .from('cms_pages')
    .select('id, page_key')
    .eq('page_key', pageKey)
    .eq('status', 'published')
    .single();

  if (!page) {
    return null;
  }

  const { data: i18n } = await supabase
    .from('cms_page_i18n')
    .select('title, seo_title, seo_description, robots, canonical_path')
    .eq('page_id', page.id)
    .eq('locale', locale)
    .maybeSingle();

  const { data: fallbackI18n } = !i18n
    ? await supabase
        .from('cms_page_i18n')
        .select('title, seo_title, seo_description, robots, canonical_path')
        .eq('page_id', page.id)
        .eq('locale', 'en')
        .maybeSingle()
    : { data: null };

  const activeI18n = i18n || fallbackI18n;

  const { data: sections } = await supabase
    .from('cms_sections')
    .select('id, section_key, section_type, position, config')
    .eq('page_id', page.id)
    .eq('enabled', true)
    .order('position', { ascending: true });

  const sectionIds = (sections || []).map((section) => section.id);

  const { data: sectionI18nRows } = sectionIds.length
    ? await supabase
        .from('cms_section_i18n')
        .select('section_id, content, locale')
        .in('section_id', sectionIds)
        .in('locale', [locale, 'en'])
    : { data: [] as any[] };

  const sectionContentById = new Map<string, Record<string, unknown>>();

  for (const row of sectionI18nRows || []) {
    if (row.locale === locale) {
      sectionContentById.set(row.section_id, asJsonObject(row.content));
    }
  }

  for (const row of sectionI18nRows || []) {
    if (!sectionContentById.has(row.section_id) && row.locale === 'en') {
      sectionContentById.set(row.section_id, asJsonObject(row.content));
    }
  }

  return {
    pageId: page.id,
    pageKey: page.page_key,
    title: getTextValue(activeI18n?.title) || page.page_key,
    seoTitle: activeI18n?.seo_title || null,
    seoDescription: activeI18n?.seo_description || null,
    robots: getTextValue(activeI18n?.robots) || 'index,follow',
    canonicalPath: activeI18n?.canonical_path || null,
    sections: (sections || []).map((section) => ({
      id: section.id,
      sectionKey: section.section_key,
      sectionType: section.section_type,
      position: section.position,
      config: asJsonObject(section.config),
      content: sectionContentById.get(section.id) || {},
    })),
  };
}

async function getPackageTranslations(
  packageIds: string[],
  locale: Locale
): Promise<Map<string, any>> {
  if (!packageIds.length) {
    return new Map();
  }

  const supabase = await createClient();

  const { data: rows } = await supabase
    .from('package_i18n')
    .select(
      'package_id, locale, slug, name, summary, overview, includes, excludes, notes, seo_title, seo_description'
    )
    .in('package_id', packageIds)
    .in('locale', [locale, 'en']);

  const translations = new Map<string, any>();

  for (const row of rows || []) {
    if (row.locale === locale) {
      translations.set(row.package_id, row);
    }
  }

  for (const row of rows || []) {
    if (!translations.has(row.package_id) && row.locale === 'en') {
      translations.set(row.package_id, row);
    }
  }

  return translations;
}

async function getMediaMap(mediaIds: string[]): Promise<Map<string, any>> {
  if (!mediaIds.length) {
    return new Map();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('media_assets')
    .select('id, source_url')
    .in('id', mediaIds)
    .eq('is_active', true);

  return new Map((data || []).map((row) => [row.id, row]));
}

async function getMediaAltMap(mediaIds: string[], locale: Locale): Promise<Map<string, string>> {
  if (!mediaIds.length) {
    return new Map();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from('media_asset_i18n')
    .select('media_id, locale, alt_text')
    .in('media_id', mediaIds)
    .in('locale', [locale, 'en']);

  const map = new Map<string, string>();

  for (const row of data || []) {
    if (row.locale === locale && row.alt_text) {
      map.set(row.media_id, row.alt_text);
    }
  }

  for (const row of data || []) {
    if (!map.has(row.media_id) && row.locale === 'en' && row.alt_text) {
      map.set(row.media_id, row.alt_text);
    }
  }

  return map;
}

export async function getPublishedPackages(locale: Locale): Promise<PackageListItem[]> {
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from('packages')
    .select(
      'id, code, duration_days, duration_nights, min_pax, max_pax, price_idr, featured, sort_order, hero_media_id'
    )
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  const packageIds = (packages || []).map((pkg) => pkg.id);
  const mediaIds = (packages || [])
    .map((pkg) => pkg.hero_media_id)
    .filter((value): value is string => !!value);

  const [translations, mediaMap, mediaAltMap] = await Promise.all([
    getPackageTranslations(packageIds, locale),
    getMediaMap(mediaIds),
    getMediaAltMap(mediaIds, locale),
  ]);

  return (packages || [])
    .map((pkg) => {
      const i18n = translations.get(pkg.id);
      if (!i18n) {
        return null;
      }

      const media = pkg.hero_media_id ? mediaMap.get(pkg.hero_media_id) : null;

      return {
        id: pkg.id,
        code: pkg.code,
        slug: i18n.slug,
        name: i18n.name,
        summary: i18n.summary,
        durationDays: pkg.duration_days,
        durationNights: pkg.duration_nights,
        minPax: pkg.min_pax,
        maxPax: pkg.max_pax,
        priceIdr: Number(pkg.price_idr),
        featured: pkg.featured,
        heroImageUrl: media?.source_url || null,
        heroImageAlt: pkg.hero_media_id ? mediaAltMap.get(pkg.hero_media_id) || null : null,
        seoTitle: i18n.seo_title,
        seoDescription: i18n.seo_description,
      } satisfies PackageListItem;
    })
    .filter((item): item is PackageListItem => item !== null);
}

async function getPackageBySlug(locale: Locale, slug: string): Promise<any | null> {
  const supabase = await createClient();

  const { data: i18n } = await supabase
    .from('package_i18n')
    .select('package_id')
    .eq('locale', locale)
    .eq('slug', slug)
    .maybeSingle();

  let packageId = i18n?.package_id;

  if (!packageId && locale !== 'en') {
    const { data: enI18n } = await supabase
      .from('package_i18n')
      .select('package_id')
      .eq('locale', 'en')
      .eq('slug', slug)
      .maybeSingle();

    packageId = enI18n?.package_id;
  }

  if (!packageId) {
    return null;
  }

  const { data: pkg } = await supabase
    .from('packages')
    .select(
      'id, code, duration_days, duration_nights, min_pax, max_pax, price_idr, featured, hero_media_id, status'
    )
    .eq('id', packageId)
    .eq('status', 'published')
    .maybeSingle();

  return pkg || null;
}

export async function getPackageDetail(
  locale: Locale,
  slug: string
): Promise<PackageDetail | null> {
  const pkg = await getPackageBySlug(locale, slug);
  if (!pkg) {
    return null;
  }

  const supabase = await createClient();

  const [translations, mediaMap, mediaAltMap] = await Promise.all([
    getPackageTranslations([pkg.id], locale),
    getMediaMap(pkg.hero_media_id ? [pkg.hero_media_id] : []),
    getMediaAltMap(pkg.hero_media_id ? [pkg.hero_media_id] : [], locale),
  ]);

  const i18n = translations.get(pkg.id);
  if (!i18n) {
    return null;
  }

  const { data: days } = await supabase
    .from('package_itinerary_days')
    .select('id, day_number')
    .eq('package_id', pkg.id)
    .order('day_number', { ascending: true });

  const dayIds = (days || []).map((day) => day.id);

  const { data: dayI18nRows } = dayIds.length
    ? await supabase
        .from('package_itinerary_day_i18n')
        .select('day_id, locale, title')
        .in('day_id', dayIds)
        .in('locale', [locale, 'en'])
    : { data: [] as any[] };

  const dayTitleMap = new Map<string, string>();
  for (const row of dayI18nRows || []) {
    if (row.locale === locale) {
      dayTitleMap.set(row.day_id, row.title);
    }
  }
  for (const row of dayI18nRows || []) {
    if (!dayTitleMap.has(row.day_id) && row.locale === 'en') {
      dayTitleMap.set(row.day_id, row.title);
    }
  }

  const { data: items } = dayIds.length
    ? await supabase
        .from('package_itinerary_items')
        .select('id, day_id, position, time_label')
        .in('day_id', dayIds)
        .order('position', { ascending: true })
    : { data: [] as any[] };

  const itemIds = (items || []).map((item) => item.id);

  const { data: itemI18nRows } = itemIds.length
    ? await supabase
        .from('package_itinerary_item_i18n')
        .select('item_id, locale, activity, details')
        .in('item_id', itemIds)
        .in('locale', [locale, 'en'])
    : { data: [] as any[] };

  const itemMap = new Map<string, { activity: string; details: string | null }>();
  for (const row of itemI18nRows || []) {
    if (row.locale === locale) {
      itemMap.set(row.item_id, { activity: row.activity, details: row.details || null });
    }
  }
  for (const row of itemI18nRows || []) {
    if (!itemMap.has(row.item_id) && row.locale === 'en') {
      itemMap.set(row.item_id, { activity: row.activity, details: row.details || null });
    }
  }

  const { data: costs } = await supabase
    .from('package_cost_items')
    .select('id, cost_group, day_number, position, label, amount_idr, notes')
    .eq('package_id', pkg.id)
    .order('day_number', { ascending: true, nullsFirst: true })
    .order('position', { ascending: true });

  const { data: packageCarRows } = await supabase
    .from('package_car_rentals')
    .select('car_rental_id, position')
    .eq('package_id', pkg.id)
    .order('position', { ascending: true });

  const carIds = (packageCarRows || []).map((row) => row.car_rental_id);

  const { data: carRows } = carIds.length
    ? await supabase
        .from('car_rentals')
        .select(
          'id, price_idr, seats, transmission, has_ac, luggage_capacity, image_media_id, status'
        )
        .in('id', carIds)
        .eq('status', 'published')
    : { data: [] as any[] };

  const { data: carI18nRows } = carIds.length
    ? await supabase
        .from('car_rental_i18n')
        .select('car_rental_id, locale, slug, name, description')
        .in('car_rental_id', carIds)
        .in('locale', [locale, 'en'])
    : { data: [] as any[] };

  const carMediaIds = (carRows || [])
    .map((row) => row.image_media_id)
    .filter((value): value is string => !!value);
  const carMediaMap = await getMediaMap(carMediaIds);

  const carI18nMap = new Map<string, any>();
  for (const row of carI18nRows || []) {
    if (row.locale === locale) {
      carI18nMap.set(row.car_rental_id, row);
    }
  }
  for (const row of carI18nRows || []) {
    if (!carI18nMap.has(row.car_rental_id) && row.locale === 'en') {
      carI18nMap.set(row.car_rental_id, row);
    }
  }

  const carMap = new Map((carRows || []).map((row) => [row.id, row]));

  const itinerary = (days || []).map((day) => {
    const dayItems = (items || [])
      .filter((item) => item.day_id === day.id)
      .map((item) => {
        const i18nItem = itemMap.get(item.id);
        return {
          timeLabel: item.time_label,
          activity: i18nItem?.activity || 'Activity',
          details: i18nItem?.details || null,
          position: item.position,
        };
      });

    return {
      dayNumber: day.day_number,
      title: dayTitleMap.get(day.id) || `Day ${day.day_number}`,
      items: dayItems,
    };
  });

  const carRentals = (packageCarRows || [])
    .map((row) => {
      const car = carMap.get(row.car_rental_id);
      const carI18n = carI18nMap.get(row.car_rental_id);
      if (!car || !carI18n) {
        return null;
      }

      return {
        id: car.id,
        slug: carI18n.slug,
        name: carI18n.name,
        description: carI18n.description,
        priceIdr: Number(car.price_idr),
        seats: car.seats,
        transmission: car.transmission,
        hasAc: car.has_ac,
        luggageCapacity: car.luggage_capacity,
        imageUrl: car.image_media_id ? carMediaMap.get(car.image_media_id)?.source_url || null : null,
      };
    })
    .filter((item): item is PackageDetail['carRentals'][number] => item !== null);

  return {
    id: pkg.id,
    code: pkg.code,
    slug: i18n.slug,
    name: i18n.name,
    summary: i18n.summary,
    durationDays: pkg.duration_days,
    durationNights: pkg.duration_nights,
    minPax: pkg.min_pax,
    maxPax: pkg.max_pax,
    priceIdr: Number(pkg.price_idr),
    featured: pkg.featured,
    heroImageUrl: pkg.hero_media_id ? mediaMap.get(pkg.hero_media_id)?.source_url || null : null,
    heroImageAlt: pkg.hero_media_id ? mediaAltMap.get(pkg.hero_media_id) || null : null,
    seoTitle: i18n.seo_title,
    seoDescription: i18n.seo_description,
    overview: i18n.overview,
    includes: Array.isArray(i18n.includes) ? i18n.includes : [],
    excludes: Array.isArray(i18n.excludes) ? i18n.excludes : [],
    notes: i18n.notes,
    itinerary,
    costs: (costs || []).map((cost) => ({
      id: cost.id,
      costGroup: cost.cost_group,
      dayNumber: cost.day_number,
      position: cost.position,
      label: cost.label,
      amountIdr: Number(cost.amount_idr),
      notes: cost.notes,
    })),
    carRentals,
  };
}

export async function getBlogPosts(locale: Locale): Promise<BlogListItem[]> {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, published_at, cover_media_id')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  const postIds = (posts || []).map((post) => post.id);

  const { data: i18nRows } = postIds.length
    ? await supabase
        .from('blog_post_i18n')
        .select('post_id, locale, slug, title, excerpt, seo_title, seo_description')
        .in('post_id', postIds)
        .in('locale', [locale, 'en'])
    : { data: [] as any[] };

  const map = new Map<string, any>();
  for (const row of i18nRows || []) {
    if (row.locale === locale) {
      map.set(row.post_id, row);
    }
  }
  for (const row of i18nRows || []) {
    if (!map.has(row.post_id) && row.locale === 'en') {
      map.set(row.post_id, row);
    }
  }

  const coverIds = (posts || [])
    .map((post) => post.cover_media_id)
    .filter((value): value is string => !!value);
  const mediaMap = await getMediaMap(coverIds);

  return (posts || [])
    .map((post) => {
      const i18n = map.get(post.id);
      if (!i18n) {
        return null;
      }

      return {
        id: post.id,
        slug: i18n.slug,
        title: i18n.title,
        excerpt: i18n.excerpt,
        publishedAt: post.published_at,
        coverImageUrl: post.cover_media_id ? mediaMap.get(post.cover_media_id)?.source_url || null : null,
        seoTitle: i18n.seo_title,
        seoDescription: i18n.seo_description,
      };
    })
    .filter((item): item is BlogListItem => item !== null);
}

export async function getBlogPostBySlug(
  locale: Locale,
  slug: string
): Promise<BlogDetail | null> {
  const supabase = await createClient();

  const { data: match } = await supabase
    .from('blog_post_i18n')
    .select('post_id')
    .eq('locale', locale)
    .eq('slug', slug)
    .maybeSingle();

  let postId = match?.post_id;

  if (!postId && locale !== 'en') {
    const { data: enMatch } = await supabase
      .from('blog_post_i18n')
      .select('post_id')
      .eq('locale', 'en')
      .eq('slug', slug)
      .maybeSingle();

    postId = enMatch?.post_id;
  }

  if (!postId) {
    return null;
  }

  const { data: post } = await supabase
    .from('blog_posts')
    .select('id, published_at, cover_media_id, status')
    .eq('id', postId)
    .eq('status', 'published')
    .maybeSingle();

  if (!post) {
    return null;
  }

  const { data: i18nRows } = await supabase
    .from('blog_post_i18n')
    .select(
      'locale, slug, title, excerpt, content_markdown, seo_title, seo_description, robots, canonical_path'
    )
    .eq('post_id', post.id)
    .in('locale', [locale, 'en']);

  let i18n = (i18nRows || []).find((row) => row.locale === locale);
  if (!i18n) {
    i18n = (i18nRows || []).find((row) => row.locale === 'en');
  }

  if (!i18n) {
    return null;
  }

  const mediaMap = await getMediaMap(post.cover_media_id ? [post.cover_media_id] : []);

  return {
    id: post.id,
    slug: i18n.slug,
    title: i18n.title,
    excerpt: i18n.excerpt,
    contentMarkdown: i18n.content_markdown || '',
    publishedAt: post.published_at,
    coverImageUrl: post.cover_media_id ? mediaMap.get(post.cover_media_id)?.source_url || null : null,
    seoTitle: i18n.seo_title,
    seoDescription: i18n.seo_description,
    robots: i18n.robots || 'index,follow',
    canonicalPath: i18n.canonical_path,
  };
}

export async function getMenuItems(locale: Locale, code: string): Promise<MenuItem[]> {
  const supabase = await createClient();

  const { data: menu } = await supabase
    .from('menus')
    .select('id')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle();

  if (!menu) {
    return [];
  }

  const { data: items } = await supabase
    .from('menu_items')
    .select('id, kind, href, position')
    .eq('menu_id', menu.id)
    .eq('enabled', true)
    .order('position', { ascending: true });

  const itemIds = (items || []).map((item) => item.id);

  const { data: labels } = itemIds.length
    ? await supabase
        .from('menu_item_i18n')
        .select('menu_item_id, locale, label, href_override')
        .in('menu_item_id', itemIds)
        .in('locale', [locale, 'en'])
    : { data: [] as any[] };

  const labelMap = new Map<string, { label: string; href_override: string | null }>();

  for (const row of labels || []) {
    if (row.locale === locale) {
      labelMap.set(row.menu_item_id, {
        label: row.label,
        href_override: row.href_override,
      });
    }
  }

  for (const row of labels || []) {
    if (!labelMap.has(row.menu_item_id) && row.locale === 'en') {
      labelMap.set(row.menu_item_id, {
        label: row.label,
        href_override: row.href_override,
      });
    }
  }

  return (items || []).map((item) => {
    const i18n = labelMap.get(item.id);
    const hrefRaw = i18n?.href_override || item.href || '#';

    return {
      id: item.id,
      href: hrefRaw.replace('{locale}', locale),
      label: i18n?.label || 'Menu',
      kind: item.kind,
      position: item.position,
    };
  });
}

export async function getRedirectTarget(pathname: string): Promise<{
  toPath: string;
  statusCode: number;
} | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('redirects')
    .select('to_path, status_code')
    .eq('from_path', pathname)
    .eq('enabled', true)
    .maybeSingle();

  if (!data) {
    return null;
  }

  return {
    toPath: data.to_path,
    statusCode: data.status_code || 301,
  };
}
