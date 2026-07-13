import { NextRequest, NextResponse } from 'next/server';
import { extractGoogleDriveFileId } from '@/lib/media';

export const runtime = 'nodejs';
export const revalidate = 3600;

const ALLOWED_HOSTS = new Set([
  'drive.google.com',
  'lh3.googleusercontent.com',
  'images.unsplash.com',
]);

function buildFetchUrl(sourceUrl: string): string {
  const driveId = extractGoogleDriveFileId(sourceUrl);
  if (driveId) {
    return `https://drive.google.com/uc?export=download&id=${driveId}`;
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
    const response = await fetch(fetchUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SamaSamaTourBot/1.0)',
      },
      cache: 'force-cache',
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
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.redirect(new URL('/placeholder.svg', request.url));
  }
}
