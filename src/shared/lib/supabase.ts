import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { requireEnv } from './env';

/**
 * Single Supabase client for the whole app.
 * Uses the public anon key only: data access is protected by RLS.
 * Never use the service_role key in client code.
 */
export const supabase = createClient<Database>(
  requireEnv('VITE_SUPABASE_URL'),
  requireEnv('VITE_SUPABASE_ANON_KEY'),
);
