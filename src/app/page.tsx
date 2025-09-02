import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", data.user.id)
    .single();
  const roles = Array.isArray(profile?.roles) ? profile!.roles : [];
  redirect(roles.includes("admin") ? "/admin" : "/overview");
}
