export interface Expense {
  id: number;
  amount: number;
  category: CategoryColumn;
  date: string;
  currency?: string;
  paymentMethod: "Cash" | "Card" | "UPI" | "Wallet" | "Others";
  notes: string;
  isRecurring: boolean;
  tags?: string[];
}

export interface Category {
  id?: number;
  name: string;
  color: string;
  icon: number;
  budget?: number;
}

export interface CategoryColumn {
  id?: number;
  name: string;
  colorCode: string;
  categoryIcon: number;
  budget?: number;
}

export interface Budget {
  id: number;
  category: CategoryColumn;
  amount: number;
  spent: number;
  month: string;
  rolloverEnabled?: boolean;
  currency?: string;
}

export interface DashboardStats {
  totalExpenses: number;
  monthlyChange: number;
  highestCategory: string;
  dailyAverage: number;
  budgetUsed: number;
  transactionCount: number;
}

export interface MonthlyTrend {
  month: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}
