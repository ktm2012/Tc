import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

// Browser-only: uses the public anon key (safe to expose), never the
// service_role key from src/lib/storage.ts / realtime-server.ts. Returns
// null when NEXT_PUBLIC_SUPABASE_URL/ANON_KEY aren't set — callers should
// treat that as "live push isn't available right now", not an error.
export function getRealtimeClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  cached = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cached;
}
