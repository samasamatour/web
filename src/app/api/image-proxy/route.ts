import { NextRequest, NextResponse } from 'next/server';
import { extractGoogleDriveFileId } from '@/lib/media';

export const runtime = 'nodejs';
// Do NOT set revalidate here — we control caching via Cache-Control headers only
export const dynamic = 'force-dynamic';

const ALLOWED_HOSTS = new Set([
  'drive.google.com',
  'docs.google.com',
  'drive.usercontent.google.com',
  'lh3.googleusercontent.com',
  'images.unsplash.com',
]);

function buildFetchUrl(sourceUrl: string): string {
  const driveId = extractGoogleDriveFileId(sourceUrl);
  if (driveId) {
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w2000`;
  }

  return sourceUrl;
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get('url');
  if (!input) {
    return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(input);
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(sourceUrl.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 400 });
  }

  const fetchUrl = buildFetchUrl(sourceUrl.toString());

  try {
    // Use no-store so the proxy always fetches fresh from origin.
    const response = await fetch(fetchUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SamaSamaTourBot/1.0)',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/placeholder.svg', request.url));
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) {
      return NextResponse.redirect(new URL('/placeholder.svg', request.url));
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Browser can cache for 60s, but CDN must NOT cache
        // (Netlify/Cloudflare CDN was ignoring query params and returning
        // the same cached image for all packages)
        'Cache-Control': 'public, max-age=60, stale-if-error=600',
        'CDN-Cache-Control': 'no-store',
        'Cloudflare-CDN-Cache-Control': 'no-store',
        // Vary on full URL to prevent CDN from collapsing different images
        'Vary': 'Accept, x-forwarded-host',
      },
    });
  } catch {
    return NextResponse.redirect(new URL('/placeholder.svg', request.url));
  }
}

