import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <AdminDashboard />
    </main>
  );
}
