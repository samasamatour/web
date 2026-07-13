import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseLocaleFromHeader } from '@/lib/i18n';

export default async function RootPage() {
  const headerStore = await headers();
  const locale = parseLocaleFromHeader(headerStore.get('accept-language'));
  redirect(`/${locale}`);
}
