import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ExpenseTrendChart({ monthlyTrends, ccy }: any) {
  return (
    <div
      className="chart-container animate-slide-up opacity-0"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Expense Trend</h3>
        <p className="text-sm text-muted-foreground">
          Monthly spending over the last 6 months
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyTrends}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(186, 72%, 30%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(186, 72%, 30%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(210, 15%, 90%)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }}
              tickFormatter={(value) => `${ccy}${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(210, 15%, 90%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.07)",
              }}
              formatter={(value: number) => [
                `${ccy}${value.toLocaleString()}`,
                "Amount",
              ]}
            />
            <Line
              type="monotone"
              dataKey="total"
              stroke="hsl(186, 72%, 30%)"
              strokeWidth={3}
              dot={{ fill: "hsl(186, 72%, 30%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "hsl(186, 72%, 30%)" }}
              fill="url(#colorAmount)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
