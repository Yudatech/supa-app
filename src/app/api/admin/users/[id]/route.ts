import { NextResponse } from "next/server";
import { checkAdmin } from "@/lib/check-admin";

export const runtime = "nodejs";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const gate = await checkAdmin();               // uses server-action client now
  if (!gate.ok) return NextResponse.json({ error: gate.error }, { status: gate.status });
  const supabase = gate.supabase;                // this client has getAll/setAll

  const body = await req.json();

  // Example: update your own tables (adjust keys to your schema)
  const { error: usersErr } = await supabase
    .from("users")
    .update({
      first_name: body.first_name ?? null,
      last_name:  body.last_name  ?? null,
      email:      body.email      ?? null,
      phone:      body.phone      ?? null,
    })
    .eq("profile_id", id); // IMPORTANT: compare uuid->uuid (profile_id), not bigint id

  if (usersErr) return NextResponse.json({ error: usersErr.message }, { status: 403 });

  if (Array.isArray(body.roles)) {
    const { error: profErr } = await supabase
      .from("profiles")
      .update({ roles: body.roles })
      .eq("id", id);
    if (profErr) return NextResponse.json({ error: profErr.message }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
