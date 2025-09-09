import { UserOverview } from "@/components/admin/user-overview";
import { Navbar } from "../../../components/navbar";
import { createClient } from "@/utils/supabase/server";
import { User } from "../../../lib/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function Home() {
  const supabase = await createClient();
  const { data: auth, error } = await supabase.auth.getUser();
  if (error || !auth?.user) redirect("/login");

  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host")!;
  const url = `${proto}://${host}/api/admin/users`;

  const res = await fetch(url, {
    headers: { cookie: h.get("cookie") ?? "" },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");
  if (res.status === 403) redirect("/dashboard");
  if (!res.ok) throw new Error(await res.text());

  const data: User[] = await res.json();

  const authUser: User = data.filter((d) => d.id === auth.user.id)?.[0];

  if (!authUser) return null;

  const authed = { authUser: authUser };

  return (
    <main className="min-h-screen bg-background">
      <Navbar auth={authed} />
      <UserOverview initUsers={data} authUser={authUser} />
    </main>
  );
}
