import { notFound, redirect } from 'next/navigation';
import { getRedirectTarget } from '@/lib/cms/queries';

export const revalidate = 0;

export default async function LegacyCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const pathname = `/${(slug || []).join('/')}`;

  const target = await getRedirectTarget(pathname);
  if (target?.toPath) {
    redirect(target.toPath);
  }

  notFound();
}
