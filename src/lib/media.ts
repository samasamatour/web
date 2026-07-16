export function extractGoogleDriveFileId(url: string): string | null {
  if (!url) {
    return null;
  }

  const trimmed = url.trim();

  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam?.[1]) {
    return matchIdParam[1];
  }

  const matchFilePath = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFilePath?.[1]) {
    return matchFilePath[1];
  }

  const matchUcPath = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (matchUcPath?.[1]) {
    return matchUcPath[1];
  }

  return null;
}

/**
 * Hosts that Next.js <Image> can optimise directly (listed in remotePatterns).
 * For these we return the source URL as-is.
 */
const DIRECT_IMAGE_HOSTS = new Set(['images.unsplash.com']);

/**
 * Convert a raw media source URL into a URL that the browser can actually load.
 *
 * @param sourceUrl  The URL stored in the `media_assets` table.
 * @param cacheKey   An optional unique identifier (e.g. media_asset.id) that is
 *                   appended as `?ck=…` to the proxy URL so that:
 *                   1. Two different assets with the same origin URL are never
 *                      confused by Next.js image cache (different cache keys).
 *                   2. When the admin replaces an image in Supabase the cache key
 *                      changes (use a timestamp or new media ID) forcing browsers
 *                      and the CDN to fetch the new image immediately.
 */
export function toImageProxyUrl(
  sourceUrl: string | null | undefined,
  cacheKey?: string | null
): string {
  if (!sourceUrl) {
    return '/placeholder.svg';
  }

  try {
    const parsedUrl = new URL(sourceUrl);

    if (DIRECT_IMAGE_HOSTS.has(parsedUrl.hostname)) {
      // For Unsplash (and similar), append a short cache-buster derived from
      // the URL path so two packages with similar Unsplash URLs are distinct.
      if (cacheKey) {
        parsedUrl.searchParams.set('ck', cacheKey);
      }
      return parsedUrl.toString();
    }
  } catch {
    return '/placeholder.svg';
  }

  const encoded = encodeURIComponent(sourceUrl);
  // Append cache key so each media asset has a unique proxy URL
  const ckSuffix = cacheKey ? `&ck=${encodeURIComponent(cacheKey)}` : '';
  return `/api/image-proxy?url=${encoded}${ckSuffix}`;
}
