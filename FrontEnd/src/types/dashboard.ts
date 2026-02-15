import { ReactNode } from "react";

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  onAddExpense?: () => void;
  isEmpty?: any;
}

export interface LayoutProps {
  children: ReactNode;
}
