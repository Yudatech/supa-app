"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server"; // write-capable helper

export async function sendReset(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    redirect(`/forgot-password?${new URLSearchParams({ error: "Email is required" })}`);
  }

  // Build absolute redirect URL for the recovery link to land on
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("host")!;
  const redirectTo = `${proto}://${host}/auth/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) {
    redirect(`/forgot-password?${new URLSearchParams({ error: error.message })}`);
  }

  redirect(
    `/forgot-password?${new URLSearchParams({
      info: "Check your email for a password reset link.",
    })}`
  );
}
