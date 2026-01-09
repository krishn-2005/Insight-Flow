import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import axios from "axios";

const MoMGrowthChart = () => {
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);

  // Fetch available years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/insights/years"
        );
        const yearList = response.data.years.map((item) => item.year);
        setYears(yearList);
        if (yearList.length > 0) {
          setSelectedYear(yearList[0]); // Set latest year as default
        }
      } catch (error) {
        console.error("Error fetching years:", error);
      }
    };
    fetchYears();
  }, []);

  // Fetch growth data when year changes
  useEffect(() => {
    if (selectedYear === null) return;

    const fetchGrowthData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/insights/growth?year=${selectedYear}`
        );
        setData(response.data.mom_growth);
      } catch (error) {
        console.error("Error fetching growth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGrowthData();
  }, [selectedYear]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-lg">
          <p className="text-slate-300 text-sm font-medium">
            {payload[0].payload.order_year_month}
          </p>
          <p className="text-purple-400 text-sm">
            Growth: <span className="font-bold">{payload[0].value}%</span>
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Sales: ${payload[0].payload.monthly_sales?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-800 h-64 flex items-center justify-center">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative h-101" style={{ perspective: "1000px" }}>
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side - Chart */}
        <div
          className="absolute inset-0 bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-800"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-100">
                Month-over-Month Growth
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedYear || ""}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-800 text-slate-300 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResponsiveContainer width="100%" height="75%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="order_year_month"
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: "12px" }}
                label={{
                  value: "Growth %",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#94a3b8",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="growth_percentage"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6 }}
                name="Growth %"
              />
            </LineChart>
          </ResponsiveContainer>

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
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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
                    Month-over-month analysis shows very high sales growth in
                    February across multiple years.
                  </li>
                  <li>
                    In some years, November also shows a strong growth spike.
                  </li>
                  <li>
                    This suggests seasonal demand patterns during these months.
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
                    Analyze product-level sales during February and November to
                    identify high-demand products.
                  </li>
                  <li>
                    Check if promotions, festivals, or seasonal events are
                    driving this growth.
                  </li>
                  <li>
                    Use these insights to plan inventory and marketing campaigns
                    in advance.
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
};

export default MoMGrowthChart;
