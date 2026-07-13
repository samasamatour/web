import { redirect } from 'next/navigation';
import { getRedirectTarget } from '@/lib/cms/queries';

export const revalidate = 0;

export default async function LegacyDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fromPath = `/destination/${id}`;
  const target = await getRedirectTarget(fromPath);

  if (target?.toPath) {
    redirect(target.toPath);
  }

  redirect('/en/packages');
}
