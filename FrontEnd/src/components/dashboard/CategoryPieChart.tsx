import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export function CategoryPieChart({ categoryBreakdown, ccy }: any) {
  return (
    <div
      className="chart-container animate-slide-up opacity-0"
      style={{ animationDelay: "0.4s" }}
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Category Distribution
        </h3>
        <p className="text-sm text-muted-foreground">Where your money goes</p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryBreakdown}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="amount"
              nameKey="category"
            >
              {categoryBreakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
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
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              // Only the categories that have spending this month, so the legend matches the
              // ring and stays inside the card.
              payload={categoryBreakdown.map((item) => ({
                value: item.category,
                type: "circle",
                color: item.color,
              }))}
              formatter={(value) => (
                <span className="text-sm text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
