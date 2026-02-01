import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit2, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { AddBudgetDialog } from "@/components/budgets/AddBudgetDialog";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getBudgetsApi,
  getCategoriesApi,
  getCurrentExpensesApi,
} from "@/components/api/api";
import { useAuthStore } from "@/contexts/AuthContext";
import { budgetIcons } from "@/data/data";
import { rowDataType } from "@/types/expensesTable";
import { EmptyAlert } from "@/components/dashboard/EmptyAlert";

export default function Budgets() {
  const [budgets, setBudgets] = useState<any>([]);
  const [expenses, setExpenses] = useState<any>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [rowData, setRowData] = useState<rowDataType | null>({
    isUpdate: false,
    rowData: [],
    type: "",
  });

  const userId = useAuthStore.getState().userId;
  const currency = useAuthStore.getState().currency;

  const [budgetsQuery, expensesQuery] = useQueries({
    queries: [
      { queryKey: ["budgets", userId], queryFn: () => getBudgetsApi(userId) },
      {
        queryKey: ["currentExpenses", userId],
        queryFn: () => getCurrentExpensesApi(userId),
      },
    ],
  });

  const { data: categories } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategoriesApi(userId),
  });

  useEffect(() => {
    if (categories?.length === 0) {
      setShowAlert(true);
      setAlertType("categories");
      return;
    }
  }, [categories]);

  let ccy: string;

  switch (currency) {
    case "INR":
      ccy = "₹";
      break;
    case "USD":
      ccy = "$";
      break;
    case "EUR":
      ccy = "€";
      break;
    case "GBP":
      ccy = "£";
      break;
  }

  useEffect(() => {
    if (budgetsQuery || expensesQuery) {
      setBudgets(budgetsQuery.data);
      setExpenses(expensesQuery.data);
    }
  }, [budgetsQuery, expensesQuery]);

  const budgetData = budgets?.map((budget) => {
    let spent = 0;
    if (budget) spent = getSpentTotal(budget);
    const percentage = Math.min((spent / budget.amount) * 100, 100);
    const remaining = budget.amount - spent;
    const isOverBudget = spent > budget.amount;
    const isNearLimit = percentage >= 80 && !isOverBudget;

    return {
      ...budget,
      spent,
      percentage,
      remaining,
      isOverBudget,
      isNearLimit,
    };
  });

  function getSpentTotal(budget) {
    if (!expenses) return 0;

    const data = expenses.filter(
      (exp) => exp.category.id === budget.category.id,
    );

    const total = data.reduce((acc, exp) => {
      return acc + (Number(exp.amount) || 0);
    }, 0);

    return Math.round(total * 100) / 100;
  }

  const totalBudget = budgetData?.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgetData?.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  const [showAddBudget, setShowAddBudget] = useState(false);

  return (
    <Layout>
      <Header
        title="Budgets"
        subtitle="Set spending limits and track your progress."
      />

      <div className="p-8 space-y-8">
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  Monthly Budget Overview
                </CardTitle>
                <CardDescription>{budgetData?.[0]?.month}</CardDescription>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Target className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-bold text-foreground">
                  {ccy}
                  {totalSpent?.toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  of {ccy}
                  {totalBudget?.toLocaleString()} budget
                </p>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-2xl font-bold",
                    overallPercentage > 100
                      ? "text-destructive"
                      : "text-success",
                  )}
                >
                  {ccy}
                  {Math.abs(totalBudget - totalSpent)?.toLocaleString()}
                </p>
                <p className="text-muted-foreground">
                  {totalSpent > totalBudget ? "over budget" : "remaining"}
                </p>
              </div>
            </div>
            <Progress
              value={Math.min(overallPercentage, 100)}
              className="h-3"
            />
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Category Budgets
          </h2>
          {budgetData?.length != 0 && (
            <Button className="gap-2" onClick={() => setShowAddBudget(true)}>
              <Plus className="h-4 w-4" />
              Add Budget
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!budgetData || budgetData?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-400">
              <div className="text-6xl mb-4 animate-bounce">🏷️</div>
              <p className="mb-4">No budgets yet…</p>
              <Button
                onClick={() => setShowAddBudget(true)}
                className="gap-2 animate-pulse"
              >
                <Plus className="h-4 w-4" />
                Add your first budget
              </Button>
            </div>
          ) : (
            budgetData?.map((item, index) => (
              <Card
                key={item.id}
                className={cn(
                  "transition-all duration-300 hover:shadow-lg animate-slide-up opacity-0",
                  item.isOverBudget && "border-destructive/50 bg-destructive/5",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                        style={{
                          backgroundColor: `${item.category?.colorCode}15`,
                        }}
                      >
                        {budgetIcons[Number(item.category?.categoryIcon)]}
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {item.category?.name}
                        </CardTitle>
                        <CardDescription>
                          {item.isOverBudget ? (
                            <span className="flex items-center gap-1 text-destructive">
                              <AlertTriangle className="h-3 w-3" />
                              Over budget
                            </span>
                          ) : item.isNearLimit ? (
                            <span className="flex items-center gap-1 text-warning">
                              <AlertTriangle className="h-3 w-3" />
                              Near limit
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-success">
                              <CheckCircle2 className="h-3 w-3" />
                              On track
                            </span>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setRowData({
                          isUpdate: true,
                          rowData: [item],
                          type: "edit",
                        });
                        setShowAddBudget(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {ccy}
                        {item.spent?.toFixed(0)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        of {ccy}
                        {item.amount} budget
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-lg font-semibold",
                          item.isOverBudget
                            ? "text-destructive"
                            : "text-foreground",
                        )}
                      >
                        {item.isOverBudget ? "-" : ""}
                        {ccy}
                        {Math.abs(item.remaining)?.toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.isOverBudget ? "over" : "left"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        {item.percentage?.toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={item.percentage}
                      className={cn(
                        "h-2",
                        item.isOverBudget && "[&>div]:bg-destructive",
                        item.isNearLimit && "[&>div]:bg-warning",
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <EmptyAlert showAlert={showAlert} alertType={alertType} />
      <AddBudgetDialog
        open={showAddBudget}
        onOpenChange={setShowAddBudget}
        isUpdate={rowData?.isUpdate}
        rowData={rowData?.rowData}
      />
    </Layout>
  );
}
