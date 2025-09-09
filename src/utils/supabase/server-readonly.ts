// src/utils/supabase/server-readonly.ts
import { createServerClient } from "@supabase/ssr";

export async function createServerComponentClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      // No writes allowed while rendering Server Components.
      setAll() {
        /* no-op on purpose */
      },
    },
  });
}
