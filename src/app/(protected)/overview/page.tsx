// src/app/(protected)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-sm opacity-80">Signed in as {data.user.email}</p>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/posts">Go to Posts</Link>
        </Button>
        {isAdmin && (
          <Button variant="secondary" asChild>
            <Link href="/admin">Admin</Link>
          </Button>
        )}
      </div>
    </main>
  );
}
