'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// NOTE: Using <Button formAction={login}> requires this action to return void.
export async function login(formData: FormData): Promise<void> {
  // const email = String(formData.get("email"));
  // const password = String(formData.get("password"));
  const supabase = await createClient();

   // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/overview')

  // // Sign in
  // const { error } = await supabase.auth.signInWithPassword({ email, password });
  // if (error) {
  //   redirect(`/login?error=${encodeURIComponent(error.message)}`);
  // }

  // // Get current user
  // const { data: auth } = await supabase.auth.getUser();
  // const userId = auth?.user?.id;

  // // Default role if profile missing
  // let role: string | undefined = "user";

  // if (userId) {
  //   // (Optional) backfill profile row if using the ensure_profile() RPC
  //   // await supabase.rpc("ensure_profile");

  //   const { data: profile } = await supabase
  //     .from("profiles")
  //     .select("role")
  //     .eq("id", userId)
  //     .single();

  //   role = profile?.role ?? "user";
  // }

  // // Role-based redirect
  // if (role === "admin") {
  //   redirect("/admin");
  // }

  // redirect("/overview");
}

export async function signup(formData: FormData): Promise<void> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/login?checkInbox=1");
}
