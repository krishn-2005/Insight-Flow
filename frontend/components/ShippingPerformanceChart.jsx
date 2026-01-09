import { useState, useEffect } from "react";
import axios from "axios";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ShippingPerformanceChart() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component loads
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/insights/shipping")
      .then((res) => {
        setData(res.data.shipping_performance);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching shipping performance data:", err);
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-xl">
          <p className="text-slate-100 font-semibold mb-2">
            {payload[0].payload.ship_mode}
          </p>
          <p className="text-blue-400 text-sm">
            Avg Days: {payload[0].payload.Avg_Shipping_Days}
          </p>
          <p className="text-orange-400 text-sm">
            Late: {payload[0].payload.Late_Percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="perspective-1000">
      <div
        className={`relative transition-transform duration-700 transform-style-3d`}
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
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-100">
                Shipping Performance by Mode
              </h3>
            </div>
          </div>

          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="ship_mode"
                  stroke="#64748b"
                  tick={{ fontSize: 10, fill: "#64748b" }}
                  angle={-25}
                  textAnchor="end"
                  interval={0}
                  height={50}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#64748b"
                  label={{
                    value: "Days",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#64748b",
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#64748b"
                  label={{
                    value: "Late %",
                    angle: 90,
                    position: "insideRight",
                    fill: "#64748b",
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{
                    marginLeft: "15px",
                    marginRight: "15px",
                    fontSize: "11px",
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="Avg_Shipping_Days"
                  fill="#3b82f6"
                  name="Avg Shipping Days"
                  radius={[8, 8, 0, 0]}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="Late_Percentage"
                  stroke="#fb923c"
                  strokeWidth={3}
                  name="Late Percentage"
                  dot={{ fill: "#fb923c", r: 5 }}
                />
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

        {/* Back Side - Insights */}
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
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-orange-400"
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
                <ul className="text-sm text-slate-400 mt-1 list-disc list-inside space-y-1">
                  <li>
                    First Class shipping shows the highest late delivery rate at
                    around 40%, which is much higher than other shipping modes.
                  </li>
                  <li>
                    Other shipping modes mostly meet their expected delivery
                    timelines.
                  </li>
                  <li>
                    This indicates a specific delay issue related to First Class
                    shipping.
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
                    Investigate the reasons behind delays in First Class
                    shipping, including courier performance and internal
                    handling time.
                  </li>
                  <li>
                    Review whether the current delivery expectations for First
                    Class are realistic.
                  </li>
                  <li>
                    Take corrective actions and monitor the late delivery
                    percentage over time.
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

export default ShippingPerformanceChart;
