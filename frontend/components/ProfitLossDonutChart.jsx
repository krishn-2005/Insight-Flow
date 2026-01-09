import { useState, useEffect } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

function ProfitLossDonutChart() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/insights/profit-loss")
      .then((res) => {
        setData(res.data.profit_loss);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profit/loss data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  // Prepare chart data with prettier colors for dark theme
  const chartData = [
    {
      name: "Profit",
      value: data.Profit_Percentage_Impact,
      amount: data.Total_Gross_Profit,
      color: "#06b6d4", // cyan-500
    },
    {
      name: "Loss",
      value: data.Loss_Percentage_Impact,
      amount: data.Total_Lost_Money,
      color: "#f43f5e", // rose-500
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const item = payload[0].payload;
      const isProfit = item.name === "Profit";
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-slate-700 rounded-lg p-3 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isProfit ? "bg-cyan-500" : "bg-rose-500"
              }`}
            />
            <p
              className={`font-semibold ${
                isProfit ? "text-cyan-400" : "text-rose-400"
              }`}
            >
              {item.name}
            </p>
          </div>
          <p className="text-slate-300 text-sm">
            Percentage:{" "}
            <span className="font-medium text-slate-100">
              {item.value.toFixed(2)}%
            </span>
          </p>
          <p className="text-slate-300 text-sm">
            Amount:{" "}
            <span className="font-medium text-slate-100">
              $
              {item.amount.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate net profit for center display
  const netProfit = data.Total_Gross_Profit - data.Total_Lost_Money;

  return (
    <div className="perspective-1000">
      <div
        className={`relative transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side - Chart */}
        <div
          className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-cyan-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">
                Profit vs Loss Analysis
              </h3>
              <p className="text-sm text-slate-400">
                Financial performance breakdown
              </p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-slate-400">Net Profit</p>
                <p
                  className={`text-lg font-bold ${
                    netProfit >= 0 ? "text-cyan-400" : "text-rose-400"
                  }`}
                >
                  $
                  {Math.abs(netProfit).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <span className="text-sm text-slate-300">
                Profit ({data.Profit_Percentage_Impact}%)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500"></div>
              <span className="text-sm text-slate-300">
                Loss ({data.Loss_Percentage_Impact}%)
              </span>
            </div>
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

        {/* Back Side - Insights */}
        <div
          className="absolute inset-0 bg-slate-900/50 rounded-xl border border-slate-800 p-6 backface-hidden flex flex-col"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-cyan-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
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

          {/* Content - Scrollable */}
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
                    The company is overall profitable, with about 74% profit and
                    26% loss.
                  </li>
                  <li>
                    While profits are strong, a significant portion of revenue
                    is still impacted by losses.
                  </li>
                  <li>This indicates room to improve overall profitability.</li>
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
                    Identify the main areas and products contributing to losses.
                  </li>
                  <li>
                    Focus on reducing losses through pricing review, cost
                    control, or process improvements.
                  </li>
                  <li>
                    Track profit and loss trends regularly to ensure
                    profitability improves over time.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Back Button */}
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
  );
}

export default ProfitLossDonutChart;
