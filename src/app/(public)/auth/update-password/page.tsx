import { updatePassword } from "./actions";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server"; // read-only helper

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error;

  // Optional: verify there's a session (recovery) after clicking email link
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const hasSession = !!data?.user;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Set a new password</CardTitle>
          <CardDescription>
            {hasSession
              ? "Enter and confirm your new password."
              : "Open this page from your email reset link."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input id="confirm" name="confirm" type="password" required />
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {decodeURIComponent(error)}
              </p>
            )}

            <Button
              className="w-full"
              formAction={updatePassword}
              disabled={!hasSession}
            >
              Update password
            </Button>

            {!hasSession && (
              <p className="text-xs text-muted-foreground mt-2">
                No recovery session detected. Go to{" "}
                <a className="underline" href="/forgot-password">
                  Forgot password
                </a>{" "}
                and use the link we email you.
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
