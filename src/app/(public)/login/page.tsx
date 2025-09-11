import LoginView from "./page.view";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; mode?: string }>;
}) {
  const sp = await searchParams;
  const error = sp?.error;
  const defaultIsSignUp = sp?.mode === "signup";
  return <LoginView error={error} defaultIsSignUp={defaultIsSignUp} />;
}
