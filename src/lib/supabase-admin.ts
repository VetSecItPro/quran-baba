import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./supabase";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing server Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
}

let client: SupabaseClient<Database, "quranbaba"> | null = null;

export function supabaseAdmin(): SupabaseClient<Database, "quranbaba"> {
  if (!client) {
    client = createClient<Database, "quranbaba">(url!, serviceKey!, {
      db: { schema: "quranbaba" },
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
