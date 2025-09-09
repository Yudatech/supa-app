import { NextResponse } from "next/server";
import { createClient as createBrowserSafeServerClient } from "@/utils/supabase/server";
import { createClient as createSupabase } from "@supabase/supabase-js";
import type {User} from '../../../../lib/types';
import {checkAdmin} from '../../../../lib/check-admin';



export async function GET() {
  const supaServer = await createBrowserSafeServerClient();
  // 1) Check if admin
  const gate = await checkAdmin();
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: gate.status });
  }

  // 2) Use service role to list users (server-side only!)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE env vars" },
      { status: 500 }
    );
  }

  const authInfo = createSupabase(url, serviceKey);

  const { data: list, error: listErr } = await authInfo.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listErr) {
    return NextResponse.json({ error: listErr.message }, { status: 500 });
  }

  // 4) Get profiles to read names/roles
const [profilesRes] =
      await Promise.all([
        supaServer.from("profiles").select("id, user_name, roles, first_name, last_name,phone_number, email, updated_at"),
      ]);

  if (profilesRes.error ) {
    return NextResponse.json({ error: profilesRes.error?.message }, { status: 500 });
  }

  const profileById = new Map((profilesRes.data ?? []).map((p) => [p.id, p]));

  // 5) Shape the data for your table
  const users: User[] = (list?.users ?? []).map((u) => {
    const p = profileById.get(u.id as string);


    return {
      id: u.id,
      lastName: p?.last_name,
      firstName: p?.first_name,
      email: p?.email ?? p?.user_name ?? null,
      roles: Array.isArray(p?.roles) ? p!.roles : [],
      phone: p?.phone_number,
    };
  });

  return NextResponse.json(users);
}
