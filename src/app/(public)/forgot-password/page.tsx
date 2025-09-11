import { sendReset } from "./actions";
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
import Link from "next/link";

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; info?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error;
  const info = sp?.info;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          <CardDescription>
            We’ll email you a secure reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            {error && (
              <p className="text-sm text-destructive">
                {decodeURIComponent(error)}
              </p>
            )}
            {info && (
              <p className="text-sm text-emerald-600">
                {decodeURIComponent(info)}
              </p>
            )}

            <Button className="w-full" formAction={sendReset}>
              Send reset link
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-secondary hover:text-secondary/80 underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
