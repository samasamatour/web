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
  });

  return publicClient;
}
