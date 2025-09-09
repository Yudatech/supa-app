// src/app/api/users/[id]/route.ts
import { NextResponse } from "next/server";
import { createServerActionClient } from "@/utils/supabase/server-action"; // read/write cookies allowed
import { checkAdmin } from "../../../../lib/check-admin";

export const runtime = "nodejs";

type Body = Partial<{
  first_name: string | null;
  last_name:  string | null;
  email:      string | null;
  phone:      string | null;
  roles:      string[] | null; // will be ignored unless admin
}>;

// NOTE: await params in Next 15
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: targetId } = await ctx.params;

  const supabase = await createServerActionClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Determine admin (don’t fail self updates just because not admin)
  const adminGate = await checkAdmin();
  const isAdmin = adminGate.ok === true;

  const body = (await req.json()) as Body;

  // Build updates
  const profileUpdate: Record<string, unknown> = {};
  if ("first_name" in body) profileUpdate.first_name = body.first_name;
  if ("last_name"  in body) profileUpdate.last_name  = body.last_name;
  if ("email"      in body) profileUpdate.email      = body.email;
  if ("phone"      in body) profileUpdate.phone      = body.phone;

  // roles allowed only for admin (silently ignore for non-admin)
  const rolesUpdate = isAdmin ? body.roles : undefined;

  // Non-admins may only update themselves
  if (!isAdmin && targetId !== auth.user.id) {
    return NextResponse.json({ error: "Forbidden (not your profile)" }, { status: 403 });
  }

  // ---- Update public.users (profile info)
  // IMPORTANT: use the correct key! If you added users.profile_id (uuid) -> profiles(id):
  const { error: usersErr } = await supabase
    .from("users")
    .update(profileUpdate)
    .eq("profile_id", targetId); // <-- use .eq("id", targetId) ONLY if users.id is uuid
  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 403 });

  // ---- Update public.profiles.roles (admins only)
  if (rolesUpdate !== undefined) {
    const { error: profErr } = await supabase
      .from("profiles")
      .update({ roles: rolesUpdate ?? ["user"] })
      .eq("id", targetId);
    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
