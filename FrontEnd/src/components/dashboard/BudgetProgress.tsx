import { budgetIcons } from "@/data/data";
import { cn } from "@/lib/utils";

export function BudgetProgress({ budgets, ccy }: any) {
  const budgetData = budgets?.map((budget) => {
    const percentage = Math.min((budget.spent / budget.amount) * 100, 100);
    const isOverBudget = budget.spent > budget.amount;

    return {
      ...budget,
      percentage,
      isOverBudget,
    };
  });

  return (
    <div
      className="chart-container animate-slide-up opacity-0"
      style={{ animationDelay: "0.5s" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Budget Overview
        </h3>
        <p className="text-sm text-muted-foreground">
          Track your spending limits
        </p>
      </div>

      <div className="space-y-5">
        {budgetData?.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {budgetIcons[Number(item?.icon)]}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {item.name}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={cn(
                    "text-sm font-semibold",
                    item.isOverBudget ? "text-destructive" : "text-foreground",
                  )}
                >
                  {ccy}
                  {item.spent}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {ccy}
                  {item.amount}
                </span>
              </div>
            </div>

            <div className="progress-bar">
              <div
                className={cn(
                  "progress-fill",
                  item.isOverBudget
                    ? "bg-destructive"
                    : item.percentage > 80
                      ? "bg-warning"
                      : "bg-primary",
                )}
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
