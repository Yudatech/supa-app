'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'


function validatePassword(pw: string, confirm: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(pw)) return "Password must include at least one number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include at least one symbol.";
  if (pw !== confirm) return "Passwords do not match.";
  return null;
}


export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }
  const { error } = await supabase.auth.signInWithPassword(data)
  if (error) {
     const msg = error.message || "Sign-in failed";
    const qs = new URLSearchParams({ error: msg});
    redirect(`/login?${qs.toString()}`); // <-- send the message back to the page
  }
  revalidatePath('/', 'layout')
  redirect('/overview')

}

export async function signup(formData: FormData): Promise<void> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const confirm = String(formData.get("confirm") ?? "");
  const next = String(formData.get("next") ?? "/overview");

  const pwError = validatePassword(password, confirm);
  if (pwError) {
    redirect(`/login?${new URLSearchParams({ error: pwError, mode: "signup" })}`);
  }
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/login?${new URLSearchParams({ error: error.message, mode: "signup" })}`);
  }

  if (data?.user) {
    await supabase
      .from("profiles")
      .insert({ id: data.user.id, roles: ["user"], user_name: email, email: email })
      .select("id")
      .maybeSingle();
  }

  revalidatePath('/', 'layout')
  redirect('/overview')
}
