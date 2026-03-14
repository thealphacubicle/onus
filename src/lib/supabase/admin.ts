import { createClient } from "@supabase/supabase-js";

/**
 * Admin client with service role key - use only in server-side code.
 * Required for operations like deleteUser that the anon key cannot perform.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local for account deletion."
    );
  }

  return createClient(url, serviceRoleKey);
}
