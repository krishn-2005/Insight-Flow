import { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
  Scatter,
  ZAxis,
} from "recharts";

function TopProductsLollipopChart() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [filter, setFilter] = useState("loss"); // "loss" or "profit"
  const [lossData, setLossData] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get("http://127.0.0.1:8000/insights/top-loss-products"),
      axios.get("http://127.0.0.1:8000/insights/top-profit-products"),
    ])
      .then(([lossRes, profitRes]) => {
        setLossData(lossRes.data.top_loss_products || []);
        setProfitData(profitRes.data.top_profit_products || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching top products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 h-[420px]">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  const currentData = filter === "loss" ? lossData : profitData;
  const color = filter === "loss" ? "#f43f5e" : "#06b6d4"; // rose-500 or cyan-500

  // Truncate long product names
  const truncateName = (name, maxLength = 20) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  // Prepare data for chart (reversed for top-to-bottom ranking)
  const chartData = [...currentData].reverse().map((item) => ({
    name: item.product_name,
    shortName: truncateName(item.product_name, 18),
    value: filter === "loss" ? item.loss_pct : item.profit_pct,
  }));

  // Find max value for scaling
  const maxValue = Math.max(...chartData.map((d) => d.value));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-slate-200 font-medium text-sm">{data.name}</p>
          <p className="text-sm mt-1" style={{ color }}>
            <span
              className="inline-block w-2 h-2 rounded-full mr-2"
              style={{ backgroundColor: color }}
            ></span>
            {data.value.toFixed(2)}% contribution
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[433px] [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front Side - Chart */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 h-full flex flex-col">
            {/* Header with Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    filter === "loss" ? "bg-rose-500/10" : "bg-cyan-500/10"
                  }`}
                >
                  <svg
                    className={`w-5 h-5 ${
                      filter === "loss" ? "text-rose-500" : "text-cyan-500"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8 8-4-4-6 6M4 17h16M4 17V7"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Top 5 {filter === "loss" ? "Loss" : "Profit"} Contributing
                  Products
                </h3>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center gap-1 bg-slate-800/50 rounded-lg p-1">
                <button
                  onClick={() => setFilter("loss")}
                  className={`px-1 py-1.5 rounded-md text-sm font-medium transition-all border ${
                    filter === "loss"
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                      : "text-slate-400 hover:text-slate-300 border-transparent"
                  }`}
                >
                  📉 Loss
                </button>
                <button
                  onClick={() => setFilter("profit")}
                  className={`px-1 py-1.5 rounded-md text-sm font-medium transition-all border ${
                    filter === "profit"
                      ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                      : "text-slate-400 hover:text-slate-300 border-transparent"
                  }`}
                >
                  📈 Profit
                </button>
              </div>
            </div>

            {/* Lollipop Chart */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  layout="vertical"
                  data={chartData}
                  margin={{ top: 10, right: 40, left: 10, bottom: 10 }}
                >
                  <XAxis
                    type="number"
                    domain={[0, Math.ceil(maxValue * 1.1)]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortName"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#e2e8f0", fontSize: 11 }}
                    width={140}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <ZAxis range={[200, 200]} />

                  {/* The stem (thin bar) */}
                  <Bar dataKey="value" barSize={3} radius={[0, 0, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={color}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>

                  {/* The dot (lollipop head) */}
                  <Scatter dataKey="value" fill={color}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`dot-${index}`}
                        fill={color}
                        stroke={color}
                        strokeWidth={2}
                        style={{
                          filter: `drop-shadow(0 0 6px ${color})`,
                        }}
                      />
                    ))}
                  </Scatter>
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* View Details Button */}
            <button
              onClick={() => setIsFlipped(true)}
              className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition"
            >
              View Details
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Back Side - Insights */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-rose-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8 8-4-4-6 6M4 17h16M4 17V7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">
                    Insights & Recommendations
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {/* Insight Summary */}
              <div className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">
                    Insight Summary
                  </p>
                  <ul className="text-sm text-slate-400 mt-1 list-disc list-inside space-y-1">
                    <li>
                      A small group of products contributes to a major portion
                      of total losses.
                    </li>
                    <li>
                      The top 5 loss-making products account for around 80% of
                      the total loss, showing a clear Pareto pattern.
                    </li>
                    <li>
                      This indicates that losses are highly concentrated in a
                      few products.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="flex items-start gap-3 p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg
                    className="w-3 h-3 text-emerald-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-emerald-300">
                    Recommended Action
                  </p>
                  <ul className="text-sm text-emerald-400/80 mt-1 list-disc list-inside space-y-1">
                    <li>
                      Reduce inventory levels for the top loss-making products
                      and review their pricing and cost structure.
                    </li>
                    <li>
                      Analyze return rates, demand, and operational issues for
                      these products before restocking.
                    </li>
                    <li>
                      Focus more inventory and promotion efforts on high-profit
                      products to improve overall margins.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Back to Chart Button */}
            <button
              onClick={() => setIsFlipped(false)}
              className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 transition"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Chart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopProductsLollipopChart;
