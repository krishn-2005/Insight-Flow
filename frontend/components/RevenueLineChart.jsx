import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ComposedChart,
} from "recharts";

function formatNumber(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(0) + "K";
  return value;
}

function RevenueLineChart({ data }) {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            Revenue Trend
          </h3>
          <p className="text-xs text-slate-400 mt-1">Year-Month Performance</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-slate-400">Revenue</span>
          </div>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="period"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              stroke="#334155"
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />

            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickFormatter={formatNumber}
              stroke="#334155"
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />

            <Tooltip
              formatter={(value) => "$ " + formatNumber(value)}
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #475569",
                borderRadius: "10px",
                color: "#fff",
                padding: "12px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.3)",
              }}
              labelStyle={{
                color: "#94a3b8",
                fontWeight: "600",
                marginBottom: "4px",
              }}
              cursor={{
                stroke: "#475569",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />

            <Area
              type="monotone"
              dataKey="revenue"
              fill="url(#colorRevenue)"
              stroke="none"
              legendType="none"
              tooltipType="none"
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#818cf8"
              strokeWidth={2.5}
              dot={{
                fill: "#0F172A",
                stroke: "#818cf8",
                strokeWidth: 2,
                r: 3,
              }}
              activeDot={{
                r: 6,
                fill: "#818cf8",
                stroke: "#6366f1",
                strokeWidth: 3,
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueLineChart;
