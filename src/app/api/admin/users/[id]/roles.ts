// import { NextResponse } from "next/server";
// import { createClient as createServerSupabase } from "@/utils/supabase/server";
// import {checkAdmin} from '../route';

// export const runtime = "nodejs";

// const ALLOWED_ROLES = new Set(["admin", "teacher", "master", "user"]);

// type Body = { roles: string[] };

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   // Always get the caller + a normal supabase client
//   const supabase = await createServerSupabase();
//   const { data: auth } = await supabase.auth.getUser();
//   if (!auth?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   // Reuse your checkAdmin()
//   const adminCheck = await checkAdmin();
//   const isAdmin = adminCheck.ok === true;

//   // Parse input
//   const body = (await req.json()) as Body;
//   const update: Record<string, unknown> = {};

//   if ("first_name" in body) update.firstName = body.first_name;
//   if ("last_name"  in body) update.lastName  = body.last_name;
//   if ("user_name"  in body) update.user_name  = body.user_name;

//   // Roles: only allowed for admins
//   if ("roles" in body) {
//     if (!isAdmin) {
//       return NextResponse.json({ error: "Forbidden: cannot update roles" }, { status: 403 });
//     }
//     const rolesInput = Array.isArray(body.roles) ? body.roles.map(String) : [];
//     const nextRoles = Array.from(new Set(rolesInput.filter((r) => ALLOWED_ROLES.has(r))));
//     update.roles = nextRoles.length ? nextRoles : ["user"];

//     // Prevent self-demotion
//     if (params.id === adminCheck.userId && !(update.roles as string[]).includes("admin")) {
//       return NextResponse.json({ error: "Cannot remove your own admin role" }, { status: 400 });
//     }
//   }

//   // Non-admins can only update themselves
//   if (!isAdmin && params.id !== auth.user.id) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   // Perform update (RLS policies should be in place; DB trigger can set updated_at)
//   const { data: updated, error } = await supabase
//     .from("profiles")
//     .update({
//       ...update,
//       // If you DON'T have a DB trigger, uncomment next line to stamp from app:
//       // updated_at: new Date().toISOString(),
//     })
//     .eq("id", params.id)
//     .select("id, first_name, last_name, user_name, roles, updated_at")
//     .single();

//   if (error) return NextResponse.json({ error: error.message }, { status: 400 });
//   return NextResponse.json(updated);
// }
