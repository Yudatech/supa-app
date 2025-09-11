"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; // write-capable helper

function validatePassword(pw: string, confirm: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must include at least one uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must include at least one lowercase letter.";
  if (!/[0-9]/.test(pw)) return "Password must include at least one number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Password must include at least one symbol.";
  if (pw !== confirm) return "Passwords do not match.";
  return null;
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  const pwErr = validatePassword(password, confirm);
  if (pwErr) {
    redirect(`/auth/update-password?${new URLSearchParams({ error: pwErr })}`);
  }

  // Requires the user to have an active "recovery" session from the email link
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/auth/update-password?${new URLSearchParams({ error: error.message })}`);
  }

  redirect(`/login?${new URLSearchParams({ info: "Password updated. Please sign in." })}`);
}
