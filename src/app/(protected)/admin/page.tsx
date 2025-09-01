import { UserOverview } from "@/components/admin/user-overview";
import { Navbar } from "@/components/navbar";
import { createClient } from "@/utils/supabase/server";
import { User } from "../../../lib/types";

export default async function Home() {
  const supabase = await createClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, user_name, roles, updated_at");

  if (error) throw error;

  const initUsers: User[] = (profiles ?? []).map((p: any) => {
    return {
      id: String(p.id),
      lastName: p.last_name ?? "",
      firstName: p.first_name ?? "",
      email: p.user_name ?? "",
      roles: p.roles,
      updatedAt: p.updated_at,
    };
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <UserOverview initUsers={initUsers || []} />
    </main>
  );
}
