import { login, signup } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { error?: string; checkInbox?: string };
}) {
  return (
    <div className="grid place-items-center min-h-dvh p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          {/* {error && (
            <p className="mb-3 text-sm text-destructive" role="alert">
              {decodeURIComponent(error)}
            </p>
          )} */}
          {/* {checkInbox && (
            <p className="mb-3 text-sm opacity-80" role="status">
              Check your inbox to confirm your email.
            </p>
          )} */}
          <form className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="flex items-center gap-2">
              <Button formAction={login}>Log in</Button>
              <Button variant="outline" formAction={signup}>
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
