import { createServerActionClient } from "@/utils/supabase/server-action";

export async function checkAdmin() {
  const supabase = await createServerActionClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return { ok: false as const, status: 401, error: "Unauthorized" };

  const { data: me, error: profErr } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", auth.user.id)
    .maybeSingle();

  if (profErr) return { ok: false as const, status: 500, error: profErr.message };
  if (!me)     return { ok: false as const, status: 403, error: "Profile missing" };

  const roles = Array.isArray(me.roles) ? me.roles : (me.roles ? [me.roles] : []);
  if (!roles.includes("admin")) return { ok: false as const, status: 403, error: "Forbidden" };

  return { ok: true as const, supabase, userId: auth.user.id };
}
