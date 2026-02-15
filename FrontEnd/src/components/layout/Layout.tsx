import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { useApp } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { sidebarCollapsed } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-64",
        )}
      >
        {children}
      </main>
    </div>
  );
}
