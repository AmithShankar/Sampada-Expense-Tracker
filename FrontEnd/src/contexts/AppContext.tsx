import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppState {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
}

interface AppContextType extends AppState {
  setSidebarCollapsed: (value: boolean) => void;
  setMobileMenuOpen: (value: boolean) => void;

  updateState: <K extends keyof AppState>(key: K, value: AppState[K]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const updateState = <K extends keyof AppState>(
    key: K,
    value: AppState[K],
  ) => {
    switch (key) {
      case "sidebarCollapsed":
        setSidebarCollapsed(value as boolean);
        break;
      case "mobileMenuOpen":
        setMobileMenuOpen(value as boolean);
        break;
    }
  };

  const value: AppContextType = {
    sidebarCollapsed,
    mobileMenuOpen,
    setSidebarCollapsed,
    setMobileMenuOpen,
    updateState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export const useSidebarCollapsed = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useApp();
  return [sidebarCollapsed, setSidebarCollapsed] as const;
};
