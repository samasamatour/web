import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let publicClient: any = null;

export function createPublicClient(): any {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase public environment variables.');
  }

  if (publicClient) {
    return publicClient;
  }

  publicClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (url, options = {}) => {
        // Disable Next.js fetch cache to prevent stale/mixed data
        // between different pages. Page-level caching is still handled
        // by the `revalidate` export in each page.
        return fetch(url, { ...options, cache: 'no-store' });
      },
    },
  });

  return publicClient;
}
