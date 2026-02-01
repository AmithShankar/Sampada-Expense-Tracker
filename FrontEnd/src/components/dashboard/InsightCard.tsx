import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface Insight {
  id: number;
  type: "increase" | "decrease" | "warning" | "tip";
  message: string;
}

const insights: Insight[] = [
  {
    id: 1,
    type: "increase",
    message: "Food spending is up 18% compared to last month",
  },
  {
    id: 2,
    type: "decrease",
    message: "Transportation costs dropped by 25% this month",
  },
  {
    id: 3,
    type: "warning",
    message: "Healthcare budget exceeded by $250",
  },
  {
    id: 4,
    type: "tip",
    message: "Subscriptions account for 22% of monthly spending",
  },
];

const iconMap = {
  increase: TrendingUp,
  decrease: TrendingDown,
  warning: AlertCircle,
  tip: Lightbulb,
};

const colorMap = {
  increase: "text-warning bg-warning-muted",
  decrease: "text-success bg-success-muted",
  warning: "text-destructive bg-destructive/10",
  tip: "text-info bg-info-muted",
};

export function InsightCard({ insightCardData }: any) {
  const { thisMonthData, lastMonthData } = insightCardData;

  const insightCalculations = () => {
    //Comparing both months data and checking which category has more spending than last month
    //Comparing both months data and checking which category has less spending than last month
    //Calculating how much spending has exceeded compared to the budget this month for all category (overall spending exceeded budget)
    //Calculating which category has highest spending this month in percentage
  };

  return (
    <div
      className="chart-container animate-slide-up opacity-0"
      style={{ animationDelay: "0.7s" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Smart Insights
        </h3>
        <p className="text-sm text-muted-foreground">
          Spending Insights for Quick Analysis
        </p>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.type];
          return (
            <div
              key={insight.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl transition-all hover:scale-[1.02]",
                "animate-fade-in opacity-0",
              )}
              style={{
                animationDelay: `${0.8 + index * 0.1}s`,
                backgroundColor: "hsl(var(--accent) / 0.3)",
              }}
            >
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0",
                  colorMap[insight.type],
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {insight.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
