import { Layout } from "@/components/layout/Layout";
import { Header } from "@/components/layout/Header";
import { ExpenseTrendChart } from "@/components/dashboard/ExpenseTrendChart";
import { CategoryPieChart } from "@/components/dashboard/CategoryPieChart";
import { PaymentMethodChart } from "@/components/analytics/PaymentMethodChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  IndianRupee,
  Euro,
  PoundSterling,
  ArrowDownRight,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { getCategoriesApi, getCustomExpensesApi } from "@/components/api/api";
import { useAuthStore } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { EmptyAlert } from "@/components/dashboard/EmptyAlert";
import { useNavigate } from "react-router-dom";

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("6");
  const [showAlert, setShowAlert] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [expensesData, setExpensesData] = useState({
    total: 0,
    average: 0,
    highestAmount: 0,
    lowestAmount: 0,
  });
  const [chartData, setChartData] = useState({
    trendChartData: [],
    pieChartData: [],
    barGraphData: [],
  });

  const navigate = useNavigate();

  const profile = useAuthStore((state) => state);
  let ccy: string;
  let icon: ReactNode;

  switch (profile.currency) {
    case "INR":
      ccy = "₹";
      icon = <IndianRupee className="h-6 w-6" />;
      break;
    case "USD":
      ccy = "$";
      icon = <DollarSign className="h-6 w-6" />;
      break;
    case "EUR":
      ccy = "€";
      icon = <Euro className="h-6 w-6" />;
      break;
    case "GBP":
      ccy = "£";
      icon = <PoundSterling className="h-6 w-6" />;
      break;
  }

  const DURATION_MAP = {
    "1": 1,
    "3": 3,
    "6": 6,
    "12": 12,
  } as const;

  const { data } = useQuery({
    queryKey: ["expenses", profile.userId, DURATION_MAP[timeRange]],
    queryFn: () =>
      getCustomExpensesApi(profile.userId, DURATION_MAP[timeRange]),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories", profile.userId],
    queryFn: () => getCategoriesApi(profile.userId),
  });

  useEffect(() => {
    if (categories?.length === 0) {
      setShowAlert(true);
      setAlertType("categories");
      return;
    }
    if (data?.length === 0) {
      setIsEmpty(true);
      return;
    }
    fetchExpenses();
  }, [data, categories]);

  async function fetchExpenses() {
    if (data != null) {
      //Calculating data for top 4 cards
      const now = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        1,
      );

      expensesCalculation(data);

      //Calculating data for trend chart
      const initialValues = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const label = d.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        initialValues[label] = 0;
      }

      const totalsByMonths = data.reduce((acc, exp) => {
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
        const categoryExpenses = data.filter(
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
      const pieData = pieChartData.filter((item) => item.amount > 0);

      //Calculating data for bar graph for payment methods
      const barGraphData = data.reduce((acc, exp) => {
        const method = exp.paymentMethod;
        const amount = Number(exp.amount) || 0;

        if (!acc[method]) {
          acc[method] = {
            method,
            amount: 0,
            count: 0,
          };
        }

        acc[method].amount =
          Math.round((acc[method].amount + amount) * 100) / 100;

        acc[method].count += 1;

        return acc;
      }, {});
      const barData = Object.values(barGraphData) as {
        method: string;
        amount: number;
        count: number;
      }[];

      // Now sort descending by amount
      barData.sort((a, b) => b.amount - a.amount);

      //Assign all data here
      setChartData((prevChartData) => ({
        ...prevChartData,
        trendChartData: Object.entries(totalsByMonths).map(
          ([month, total]) => ({
            month,
            total,
          }),
        ),
        pieChartData: pieData,
        barGraphData: barData,
      }));
    }
  }

  function expensesCalculation(monthlyExpenses: any) {
    if (monthlyExpenses.length > 0) {
      const calculatedTotal = monthlyExpenses.reduce(
        (acc, exp) => acc + exp.amount,
        0,
      );
      const count = monthlyExpenses.length;

      setExpensesData({
        total: parseFloat(calculatedTotal.toFixed(2)),
        average: parseFloat((calculatedTotal / count).toFixed(2)),
        highestAmount: Math.max(
          ...monthlyExpenses.map((exp: any) => exp.amount),
        ),
        lowestAmount: Math.min(
          ...monthlyExpenses.map((exp: any) => exp.amount),
        ),
      });
    }
  }

  return (
    <Layout>
      <Header
        title="Analytics"
        subtitle="Deep insights into your spending patterns."
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 dark:text-primary">
        {!isEmpty ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Time Range:
                </span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last Month</SelectItem>
                    <SelectItem value="3">Last 3 Months</SelectItem>
                    <SelectItem value="6">Last 6 Months</SelectItem>
                    <SelectItem value="12">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {" "}
              <StatCard
                title="Total Spent"
                value={`${ccy}${expensesData.total}`}
                icon={icon}
                delay={1}
              />
              <StatCard
                title="Avg Monthly"
                value={`${ccy}${expensesData.average}`}
                icon={<TrendingUp className="h-6 w-6" />}
                delay={2}
              />
              <StatCard
                title="Highest Amount"
                value={`${ccy}${expensesData.highestAmount}`}
                icon={<ArrowUpRight className="h-6 w-6" />}
                delay={3}
              />
              <StatCard
                title="Lowest Amount"
                value={`${ccy}${expensesData.lowestAmount}`}
                icon={<ArrowDownRight className="h-6 w-6" />}
                delay={4}
              />
            </div>

            {/* Charts */}
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

            <div className="grid grid-cols-1 gap-6">
              <PaymentMethodChart
                paymentMethodData={chartData.barGraphData}
                ccy={ccy}
              />
            </div>
          </>
        ) : (
          <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-8xl mb-6 animate-bounce">⏳</div>
            <h1 className="text-3xl font-bold mb-4 text-gray-800 animate-fade-in">
              No previous data yet!
            </h1>
            <p className="text-lg text-gray-600 opacity-80 mb-8 animate-fade-in delay-200">
              Looks like there's nothing to show yet. Please visit again next
              month. 🗓️
            </p>
            <Button
              className="gap-2 animate-pulse bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => navigate("/")}
            >
              <Calendar className="h-5 w-5" />
              Check Current Month
            </Button>
          </div>
        )}
        <EmptyAlert showAlert={showAlert} alertType={alertType} />
      </div>
    </Layout>
  );
}
