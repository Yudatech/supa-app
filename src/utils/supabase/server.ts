import { createServerClient } from "@supabase/ssr";

export async function createClient() {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        // set: (name: string, value: string, options: any) => {
        //   cookieStore.set({ name, value, ...options });
        // },
        // remove: (name: string, options: any) => {
        //   cookieStore.set({ name, value: "", ...options, maxAge: 0 });
        // },
        // getAll() {
        //   return cookieStore.getAll();
        // },
        // setAll(cookiesToSet) {
        //   try {
        //     cookiesToSet.forEach(({ name, value, options }) => {
        //       cookieStore.set(name, value, options);
        //     });
        //   } catch {
        //     // In RSC, writing cookies throws — middleware will sync them.
        //   }
        // },
      },
    }
  );
}
