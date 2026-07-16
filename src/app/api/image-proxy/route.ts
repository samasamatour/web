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
    // Caching is delegated to the browser/CDN via Cache-Control headers below.
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

    // Use the encoded source URL as the ETag so browsers revalidate properly
    // when the URL changes (i.e., when admin swaps the image in Supabase).
    // max-age=0 with must-revalidate = browser always checks freshness
    // but serves from cache if ETag matches (fast for unchanged images).
    const etag = `"${Buffer.from(input).toString('base64').slice(0, 32)}"`;

    const ifNoneMatch = request.headers.get('if-none-match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // short max-age so updates appear within 60 seconds,
        // stale-while-revalidate lets the browser serve old while fetching new
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300, stale-if-error=600',
        'ETag': etag,
        'Vary': 'Accept',
      },
    });
  } catch {
    return NextResponse.redirect(new URL('/placeholder.svg', request.url));
  }
}
