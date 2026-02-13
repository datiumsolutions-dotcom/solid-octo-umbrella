import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
