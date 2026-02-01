import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { StatCard } from "@/components/dashboard/StatCard";
import { ExpenseTrendChart } from "@/components/dashboard/ExpenseTrendChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { AddExpenseDialog } from "@/components/expenses/AddExpenseDialog";
import {
  DollarSign,
  TrendingDown,
  Target,
  Receipt,
  IndianRupee,
  ReceiptIndianRupee,
  Euro,
  ReceiptEuro,
  PoundSterling,
  ReceiptPoundSterling,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "@/contexts/AuthContext";
import {
  getBudgetsApi,
  getCategoriesApi,
  getSixMonthsExpensesApi,
} from "@/components/api/api";
import { useQuery } from "@tanstack/react-query";
import { EmptyAlert } from "@/components/dashboard/EmptyAlert";

export default function Dashboard() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [monthEmpty, setMonthEmpty] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [expensesData, setExpensesData] = useState({
    total: 0,
    average: 0,
    budgetUsed: 0,
    transactions: 0,
  });
  const [chartData, setChartData] = useState({
    trendChartData: [],
    pieChartData: [],
    budgetProgressData: [],
    recentTransactionsData: [],
    insightCardData: [],
  });

  const profile = useAuthStore((state) => state);

  let user = profile?.fullName ? profile?.fullName : "User";
  let ccy: string;
  let icon: ReactNode;
  let receipt: ReactNode;

  switch (profile.currency) {
    case "INR":
      ccy = "₹";
      icon = <IndianRupee className="h-6 w-6" />;
      receipt = <ReceiptIndianRupee className="h-6 w-6" />;
      break;
    case "USD":
      ccy = "$";
      icon = <DollarSign className="h-6 w-6" />;
      receipt = <Receipt className="h-6 w-6" />;
      break;
    case "EUR":
      ccy = "€";
      icon = <Euro className="h-6 w-6" />;
      receipt = <ReceiptEuro className="h-6 w-6" />;
      break;
    case "GBP":
      ccy = "£";
      icon = <PoundSterling className="h-6 w-6" />;
      receipt = <ReceiptPoundSterling className="h-6 w-6" />;
      break;
  }

  const { data: categories } = useQuery({
    queryKey: ["categories", profile.userId],
    queryFn: () => getCategoriesApi(profile.userId),
  });

  const { data } = useQuery({
    queryKey: ["expenses", profile.userId],
    queryFn: () => getSixMonthsExpensesApi(profile.userId),
  });

  const { data: budgets } = useQuery({
    queryKey: ["budgets", profile.userId],
    queryFn: () => getBudgetsApi(profile.userId),
  });

  async function fetchExpenses() {
    if (data != null) {
      //Calculating data for top 4 cards
      const now = new Date();
      const month = now.getMonth();
      const year = now.getFullYear();
      const thisMonthData = data.filter((expense: any) => {
        return (
          new Date(expense.date).getMonth() === month &&
          new Date(expense.date).getFullYear() === year
        );
      });
      if (thisMonthData?.length === 0) {
        setMonthEmpty(true);
        setShowAlert(true);
        setAlertType("expenses");
        return;
      }
      expensesCalculation(thisMonthData);

      //Calculating data for trend chart
      const sixMonthsAgo = new Date(now.getMonth() - 6);
      const sixMonthsData = data.filter((expense: any) => {
        return new Date(expense.date).getTime() > sixMonthsAgo.getTime();
      });

      const initialValues = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        initialValues[label] = 0;
      }

      const totalsByMonths = sixMonthsData.reduce((acc, exp) => {
        const date = new Date(exp.date);
        const monthKey = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        const amount = Number(exp.amount) || 0;
        if (!acc[monthKey]) {
          acc[monthKey] = 0;
        }
        acc[monthKey] = Math.round((acc[monthKey] + amount) * 100) / 100;
        return acc;
      }, initialValues);

      //Calculating data for pie chart
      const grandTotal = Number(expensesData.total) || 0;

      const pieChartData = categories.map((category) => {
        const categoryExpenses = thisMonthData.filter(
          (exp) => exp.category.id === category.id,
        );

        const total = categoryExpenses.reduce((acc, exp) => {
          const amount = Number(exp.amount) || 0;
          return Math.round((acc + amount) * 100) / 100;
        }, 0);

        return {
          category: category.name,
          amount: total,
          color: category.colorCode,
          percentage:
            grandTotal > 0 ? Math.round((total / grandTotal) * 100) : 0,
        };
      });
      const pieData = pieChartData.filter((item) => item.amount > 0) || [];

      //Calculating data for budget overview
      const budgetData = budgets?.map((budget) => {
        const categoryData = thisMonthData.filter((exp) => {
          return exp.category.id === budget.category.id;
        });
        const total = categoryData.reduce((acc, exp) => {
          const amount = Number(exp.amount) || 0;
          return Math.round((acc + amount) * 100) / 100;
        }, 0);

        return {
          id: budget.id,
          categoryId: budget.category.id,
          amount: budget.amount,
          spent: total,
          month: budget.month,
          name: budget.category.name,
          icon: budget.category.categoryIcon,
        };
      });

      //Calculating data for recent transaction
      const recentData =
        thisMonthData.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ) || [];

      //Calculating data for insight card
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59,
        999,
      );

      const lastMonthData = data.filter((exp) => {
        const date = new Date(exp.date);
        return date >= lastMonthStart && date <= lastMonthEnd;
      });

      setChartData((prevChartData) => ({
        ...prevChartData,
        trendChartData: Object.entries(totalsByMonths)
          .map(([month, total]) => ({
            month,
            total,
            date: new Date(month),
          }))
          .sort((a, b) => a.date.getTime() - b.date.getTime())
          .map(({ month, total }) => ({ month, total })),
        pieChartData: pieData,
        budgetProgressData: budgetData,
        recentTransactionsData: recentData,
        insightCardData: [thisMonthData, lastMonthData],
      }));
    }
  }

  function expensesCalculation(monthlyExpenses: any) {
    const count = monthlyExpenses.length || 0;
    const calculatedTotal =
      monthlyExpenses.reduce(
        (acc, exp) => acc + (Number(exp.amount) || 0),
        0,
      ) || 0;

    const totalBudget =
      categories?.reduce((acc, cat) => acc + (Number(cat.budget) || 0), 0) || 0;

    const average = count > 0 ? calculatedTotal / count : 0;
    const budgetUsed =
      totalBudget > 0 ? (calculatedTotal / totalBudget) * 100 : 0;

    setExpensesData({
      total: parseFloat(calculatedTotal.toFixed(2)),
      transactions: count,
      average: parseFloat(average.toFixed(2)),
      budgetUsed: parseFloat(budgetUsed.toFixed(2)),
    });
  }

  useEffect(() => {
    if (categories?.length === 0) {
      setShowAlert(true);
      setAlertType("categories");
      return;
    }
    if (budgets?.length === 0) {
      setShowAlert(true);
      setAlertType("budgets");
      return;
    }
    if (data?.length === 0) {
      setShowAlert(true);
      setAlertType("expenses");
      return;
    }
    fetchExpenses();
  }, [data, categories, budgets]);

  return (
    <Layout>
      <Header
        title="Dashboard"
        subtitle={`Welcome back, ${user}! Here's your spending overview.`}
        onAddExpense={() => setShowAddExpense(true)}
        isEmpty={showAlert}
      />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Expenses"
            value={`${ccy}${expensesData?.total ?? 0}`}
            trend="down"
            icon={icon}
            delay={1}
          />
          <StatCard
            title="Daily Average"
            value={`${ccy}${expensesData?.average ?? 0}`}
            icon={<TrendingDown className="h-6 w-6" />}
            delay={2}
          />
          <StatCard
            title="Budget Used"
            value={`${expensesData.budgetUsed}%`}
            icon={<Target className="h-6 w-6" />}
            delay={3}
          />
          <StatCard
            title="Transactions"
            value={expensesData.transactions}
            icon={receipt}
            delay={4}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpenseTrendChart
            monthlyTrends={chartData.trendChartData}
            ccy={ccy}
          />
          <CategoryPieChart
            categoryBreakdown={chartData.pieChartData}
            ccy={ccy}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <BudgetProgress budgets={chartData.budgetProgressData} ccy={ccy} />
          <RecentTransactions
            expenses={chartData.recentTransactionsData}
            ccy={ccy}
          />
          {/* <InsightCard insightCardData={chartData.insightCardData} /> */}
        </div>
      </div>
      <EmptyAlert
        showAlert={showAlert}
        alertType={alertType}
        monthEmpty={monthEmpty}
      />

      <AddExpenseDialog
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
      />
    </Layout>
  );
}
