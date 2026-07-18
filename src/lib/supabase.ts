import { createClient, SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

function getSupabaseServiceKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function makeClient(): SupabaseClient {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey());
}

function makeAdminClient(): SupabaseClient {
  return createClient(
    getSupabaseUrl(),
    getSupabaseServiceKey() || getSupabaseAnonKey()
  );
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return (makeClient() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const supabaseAdmin: SupabaseClient = new Proxy(
  {} as SupabaseClient,
  {
    get(_, prop) {
      return (makeAdminClient() as unknown as Record<string | symbol, unknown>)[prop];
    },
  }
);
