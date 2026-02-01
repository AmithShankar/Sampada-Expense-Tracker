import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const colors = [
  "hsl(186, 72%, 30%)",
  "hsl(152, 69%, 40%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 65%, 55%)",
];

export function PaymentMethodChart({ paymentMethodData, ccy }: any) {
  return (
    <div className="chart-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Payment Methods
        </h3>
        <p className="text-sm text-muted-foreground">
          How you're paying for things
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={paymentMethodData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(210, 15%, 90%)"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(215, 12%, 50%)", fontSize: 12 }}
              tickFormatter={(value) => `${ccy}${value}`}
            />
            <YAxis
              type="category"
              dataKey="method"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "hsl(215, 25%, 15%)",
                fontSize: 14,
                fontWeight: 500,
              }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(210, 15%, 90%)",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.07)",
              }}
              formatter={(value: number, name: string) => [
                `${ccy}${value.toLocaleString()}`,
                "Total",
              ]}
            />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={32}>
              {paymentMethodData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
