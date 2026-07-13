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

export function toImageProxyUrl(sourceUrl: string | null | undefined): string {
  if (!sourceUrl) {
    return '/placeholder.svg';
  }

  const encoded = encodeURIComponent(sourceUrl);
  return `/api/image-proxy?url=${encoded}`;
}
