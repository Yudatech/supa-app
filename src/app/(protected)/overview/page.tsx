import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OverviewPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("roles")
    .eq("id", data.user.id)
    .single();
  const roles = Array.isArray(profile?.roles) ? profile!.roles : [];

  if (roles.includes("admin")) redirect("/admin");

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm opacity-80">Signed in as {data?.user?.id}</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/posts">Go to Posts</Link>
        </Button>
      </div>
    </main>
  );
}
