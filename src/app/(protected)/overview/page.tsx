import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "../../../components/navbar";

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone_number, roles, updated_at")
    .eq("id", data.user.id)
    .single();

  console.log("profile", data);

  const roles = Array.isArray(profile?.roles) ? profile!.roles : [];

  if (!profile) redirect("/signup");
  if (roles.includes("admin")) redirect("/admin");

  const user = {
    id: profile.id,
    firstName: profile.first_name,
    lastName: profile.last_name,
    email: profile.email,
    phone: profile.phone_number,
    roles: profile.roles,
    updatedAt: profile.updated_at,
  };

  return (
    <main className="p-6 space-y-6">
      <Navbar auth={{ authUser: user }} />
    </main>
  );
}
