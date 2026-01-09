import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function formatNumber(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(0) + "K";
  return Math.round(value);
}

function TopStatesBarChart({ data }) {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Top 5 States by Revenue
      </h3>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <XAxis
              type="number"
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={formatNumber}
              stroke="#334155"
            />

            <YAxis
              dataKey="state"
              type="category"
              tick={{ fill: "#cbd5f5", fontSize: 13 }}
              width={90}
              stroke="#334155"
            />

            <Tooltip
              formatter={(value) => [`$ ${formatNumber(value)}`, "Revenue"]}
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#e5e7eb",
                padding: "10px",
              }}
              labelStyle={{ color: "#94a3b8" }}
            />

            <Bar dataKey="revenue" fill="#818cf8" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TopStatesBarChart;
