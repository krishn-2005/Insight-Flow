import { useState, useEffect } from "react";
import axios from "axios";
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

function ReturnRateBarChart() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component loads
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/insights")
      .then((res) => {
        setData(res.data.return_rate_by_manager);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching return rate data:", err);
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

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-6">
        <p className="text-slate-400">No data available</p>
      </div>
    );
  }

  // Sort data by return rate descending
  const sortedData = [...data].sort(
    (a, b) => b.Return_Rate_Percentage - a.Return_Rate_Percentage
  );

  // Get colors - highest in red, others in blue
  const getColor = (index) => {
    return index === 0 ? "#ef4444" : "#3b82f6";
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-100 font-semibold">{data.region}</p>
          <p className="text-slate-300 text-sm">Manager: {data.Manager}</p>
          <p className="text-slate-300 text-sm">
            Return Rate: {data.Return_Rate_Percentage}%
          </p>
          <p className="text-slate-400 text-xs mt-1">
            {data.Returned_Orders} / {data.Total_Orders} orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="perspective-1000">
      <div
        className={`relative transition-transform duration-700 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side - Chart */}
        <div
          className="bg-slate-900/50 rounded-xl border border-slate-800 p-6 backface-hidden"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">
                High Return Rate by Region Manager
              </h3>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="region" type="category" stroke="#64748b" />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "#1e293b" }}
                />
                <Bar dataKey="Return_Rate_Percentage" radius={[0, 8, 8, 0]}>
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColor(index)} />
                  ))}
                </Bar>
              </BarChart>
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

        {/* Back Side - Details */}
        <div
          className="absolute inset-0 bg-slate-900/50 rounded-xl border border-slate-800 p-6 backface-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
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

          {/* Content - Scrollable if needed */}
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
                <p className="text-sm text-slate-400 mt-1">
                  The West region has the highest return rate among all regions.
                  This region is managed by Anna, and its return rate is clearly
                  higher than the company average
                </p>
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
                <ul className="text-sm text-emerald-400/80 mt-1 list-disc list-inside">
                  <li>
                    Discuss with the manager to identify key reasons for high returns.
                  </li>
                  <li>
                    Analyze top returned products and common issues in the West
                    region.
                  </li>
                  <li>
                    Track return rates post-improvement and review if the
                    problem persists.
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

export default ReturnRateBarChart;
