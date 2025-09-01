import { NextResponse } from "next/server";
import { createClient as createBrowserSafeServerClient } from "@/utils/supabase/server";
import { createClient as createSupabase } from "@supabase/supabase-js";
import type {User} from '../../../../lib/types';


export async function GET() {
  const supaServer = await createBrowserSafeServerClient();

  // 1) Require auth
  const { data: auth } = await supaServer.auth.getUser();
  const me = auth?.user;
  // if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2) Require admin
  const { data: myProfile } = await supaServer
    .from("profiles")
    .select("role")
    // .eq("id", me.id)
    .single();

  // add back once auth is finished
  // if (myProfile?.role !== "admin") {
  //   return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  // }

  // 3) Use service role to list users (server-side only!)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE env vars" },
      { status: 500 }
    );
  }

  const admin = createSupabase(url, serviceKey);
  const { data: list, error: listErr } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listErr) {
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }

  // 4) Get profiles to read names/roles
  const { data: profiles, error: profilesErr } = await supaServer
    .from("profiles")
    .select("id, first_name, last_name, user_name, roles, updated_at");

  if (profilesErr) {
    return NextResponse.json({ error: profilesErr.message }, { status: 500 });
  }

  const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));

  // 5) Shape the data for your table
  const users: User[] = (list?.users ?? []).map((u) => {
    const p = profileById.get(u.id as string);

    return {
      id: u.id,
      lastName: p?.last_name,
      firstName: p?.first_name,
      email: p?.user_name,
      roles: p?.roles,
      updatedAt: (u.created_at ?? "").slice(0, 10),
    };
  });

  return NextResponse.json(users);
}
