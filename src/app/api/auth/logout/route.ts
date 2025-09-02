import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Returning JSON is fine; cookies are cleared by Supabase SSR helpers
  return NextResponse.json({ ok: true });
}
