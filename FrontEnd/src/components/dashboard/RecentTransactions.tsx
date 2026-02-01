import { useAuthStore } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCategoriesApi } from "../api/api";
import { budgetIcons } from "@/data/data";

export function RecentTransactions({ expenses, ccy }: any) {
  const recentExpenses = expenses.slice(0, 5);
  const navigate = useNavigate();

  const userId = useAuthStore((state) => state.userId);

  const { data: categories } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategoriesApi(userId),
  });

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return budgetIcons[category.categoryIcon] || "💰";
  };

  const getCategoryColor = (categoryName: string) => {
    const category = categories.find((c) => c.name === categoryName);
    return category?.color || "hsl(186, 72%, 30%)";
  };

  return (
    <div
      className="chart-container animate-slide-up opacity-0"
      style={{ animationDelay: "0.6s" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Recent Transactions
          </h3>
          <p className="text-sm text-muted-foreground">Your latest expenses</p>
        </div>
        <button
          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          onClick={() => navigate("/expenses")}
        >
          View All
        </button>
      </div>

      <div className="space-y-4">
        {recentExpenses.map((expense, index) => (
          <div
            key={expense.id}
            className={cn(
              "flex items-center justify-between p-4 rounded-xl bg-accent/30 hover:bg-accent/50 transition-colors",
              "animate-fade-in opacity-0",
            )}
            style={{ animationDelay: `${0.7 + index * 0.1}s` }}
          >
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                style={{
                  backgroundColor: `${getCategoryColor(expense.category.name)}15`,
                }}
              >
                {getCategoryIcon(expense.category.name)}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {expense.category.name}
                </p>
                <p className="text-sm text-muted-foreground">{expense.notes}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold text-foreground">
                -{ccy}
                {expense.amount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(expense.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
