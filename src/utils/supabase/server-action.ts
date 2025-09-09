// src/utils/supabase/server-action.ts
import { createServerClient } from "@supabase/ssr";

export async function createServerActionClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies(); // Next 15: Promise -> await

  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // or fallback if you used the old name:
    // process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

  return createServerClient(url, key, {
    cookies: {
      // NEW API expected by @supabase/ssr
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Works in Server Actions / Route Handlers; throws in Server Components.
        for (const { name, value, options } of cookiesToSet) {
          // Next 15 signature expects an object:
          cookieStore.set({ name, value, ...options });
        }
      },
    },
  });
}
