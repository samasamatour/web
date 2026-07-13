import { createClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/service';
import { redirect } from 'next/navigation';

function getAdminAllowlist(): string[] {
  return (process.env.CMS_ADMIN_EMAILS || '')
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentUserRole(userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .maybeSingle();

  return data?.role || null;
}

export async function bootstrapAdminRoleIfNeeded(user: {
  id: string;
  email?: string;
}): Promise<void> {
  const email = user.email?.toLowerCase();
  if (!email) {
    return;
  }

  const allowlist = getAdminAllowlist();
  if (!allowlist.includes(email)) {
    return;
  }

  const serviceRole = createServiceRoleClient();
  if (!serviceRole) {
    return;
  }

  const { data } = await serviceRole
    .from('user_roles')
    .select('user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (data) {
    return;
  }

  await serviceRole.from('user_roles').insert({
    user_id: user.id,
    role: 'admin',
  });
}

export async function requireAdminUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }

  await bootstrapAdminRoleIfNeeded({
    id: user.id,
    email: user.email,
  });

  const role = await getCurrentUserRole(user.id);
  if (!role || (role !== 'admin' && role !== 'editor')) {
    redirect('/admin/login?error=unauthorized');
  }

  return { user, role };
}
