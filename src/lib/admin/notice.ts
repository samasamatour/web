export type AdminNoticeType = 'success' | 'error' | 'deleted' | 'created' | 'updated';

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`;
}

export function withAdminNotice(
  path: string,
  type: AdminNoticeType,
  message?: string
): string {
  const url = new URL(normalizePath(path), 'http://localhost');
  url.searchParams.set('notice', type);
  if (message) {
    url.searchParams.set('message', message);
  }

  return `${url.pathname}${url.search}`;
}
