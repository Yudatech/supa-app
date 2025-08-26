// src/app/layout.tsx
import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "Supa App",
  description: "Next.js + Supabase + shadcn/ui",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-dvh bg-background text-foreground">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
