import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  trend?: "up" | "down";
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  trend,
  className,
  delay = 0,
}: StatCardProps) {
  const isPositive = trend === "up" || (change && change > 0);

  return (
    <div
      className={cn("stat-card animate-slide-up opacity-0", className)}
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">
            {value?.toString().replace(/^undefined/, "") ?? 0}
          </p>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive ? "text-success" : "text-destructive",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{Math.abs(change)}%</span>
              <span className="text-muted-foreground font-normal">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
}
