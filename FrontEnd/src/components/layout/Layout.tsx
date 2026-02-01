import { LayoutProps } from "@/types/dashboard";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 transition-all duration-300">{children}</main>
    </div>
  );
}
