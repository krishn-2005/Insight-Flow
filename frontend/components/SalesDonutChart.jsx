import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

/* 🎨 Theme-matched colors (dark analytics style) */
const COLORS = ["#818cf8", "#34d399", "#fbbf24"];

function formatNumber(value) {
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
  if (value >= 1_000) return (value / 1_000).toFixed(0) + "K";
  return Math.round(value);
}

function SalesDonutChart({ data }) {
  return (
    <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-4">
      <h3 className="text-sm font-medium text-slate-300 mb-2">
        Sales by Category
      </h3>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {/* Donut */}
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={3}
              /* ✅ Slice labels → actual sales value */
              label={({ value, x, y }) => (
                <text
                  x={x}
                  y={y}
                  fill="#e2e8f0"
                  fontSize="11"
                  fontWeight="500"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {formatNumber(value)}
                </text>
              )}
              labelLine={false}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            {/* ✅ TOOLTIP (TEXT COLOR FIXED) */}
            <Tooltip
              formatter={(value, name) => [`$ ${formatNumber(value)}`, name]}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
              itemStyle={{
                color: "#e5e7eb",
              }}
              labelStyle={{
                color: "#94a3b8",
              }}
            />

            {/* Legend */}
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "#cbd5f5", fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default SalesDonutChart;
