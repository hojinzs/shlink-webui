import { Sidebar } from "@widgets/Sidebar/ui/Sidebar";

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-background min-h-screen">
        {children}
      </main>
    </div>
  );
}
