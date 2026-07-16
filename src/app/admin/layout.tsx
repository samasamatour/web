import type { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { requireAdminUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AdminNoticeToaster } from '@/components/admin/AdminNoticeToaster';
import { AdminActionProgress } from '@/components/admin/AdminActionProgress';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

async function signOutAction() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/admin/login');
}

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/settings', label: 'Settings' },
  { href: '/admin/pages', label: 'Pages' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/car-rentals', label: 'Car Rentals' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/menus', label: 'Menus' },
  { href: '/admin/redirects', label: 'Redirects' },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headerStore = await headers();
  const isPublicAdminRoute = headerStore.get('x-admin-public') === '1';

  if (isPublicAdminRoute) {
    return <>{children}</>;
  }

  const { user, role } = await requireAdminUser();

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNoticeToaster />
      <AdminActionProgress />
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
          <div>
            <p className="text-lg font-bold text-brand-dark">Sama Sama Tour CMS</p>
            <p className="text-xs text-muted-foreground">{user.email} ({role})</p>
          </div>
          <form action={signOutAction}>
            <button type="submit" className="rounded-md border px-3 py-2 text-sm">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="container mx-auto grid gap-6 px-4 py-6 md:grid-cols-[240px_1fr] md:px-6">
        <aside className="rounded-xl border bg-white p-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
