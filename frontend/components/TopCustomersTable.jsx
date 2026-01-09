import { useState, useEffect } from "react";
import axios from "axios";

function TopCustomersTable() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [data, setData] = useState([]);
  const [uniqueStates, setUniqueStates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data to get unique states and set first state as default
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Fetch data when state changes (skip if selectedState is still null on mount)
  useEffect(() => {
    if (selectedState !== null) {
      fetchCustomers();
    }
  }, [selectedState]);

  const fetchInitialData = async () => {
    try {
      // First, get all available states
      const statesResponse = await axios.get(
        "http://127.0.0.1:8000/insights/states"
      );
      const statesList = statesResponse.data.states.map((item) => item.state);
      setUniqueStates(statesList);

      if (statesList.length > 0) {
        // Set first state as default and fetch its data
        const firstState = statesList[0];
        setSelectedState(firstState);

        // Fetch data for the first state
        const response = await axios.get(
          "http://127.0.0.1:8000/insights/customers",
          {
            params: { state: firstState },
          }
        );
        setData(response.data.top_customers_by_state || []);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/insights/customers",
        {
          params: { state: selectedState },
        }
      );
      setData(response.data.top_customers_by_state || []);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="perspective-1000">
      <div
        className={`relative transition-transform duration-700 transform-style-3d`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front Side - Table */}
        <div
          className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 sm:p-6 backface-hidden pb-6 sm:pb-8"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  Top 5 Customers by Sales
                </h3>
              </div>
            </div>

            {/* State Filter - Full width on mobile */}
            <div className="flex items-center">
              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700 w-full sm:w-auto">
                <svg
                  className="w-4 h-4 text-slate-400 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <select
                  value={selectedState || ""}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-transparent text-slate-300 text-sm focus:outline-none cursor-pointer appearance-none pr-6 flex-1 min-w-0"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0 center",
                    backgroundSize: "16px",
                  }}
                >
                  {uniqueStates.map((state) => (
                    <option key={state} value={state} className="bg-slate-800">
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div
              className="overflow-y-auto max-h-[200px] sm:max-h-60 scrollbar-thin touch-pan-x touch-pan-y overscroll-contain min-w-full"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <table className="w-full sm:min-w-[380px]">
                <thead className="sticky top-0 bg-slate-900 z-10">
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-400">
                      Rank
                    </th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-400">
                      State
                    </th>
                    <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-400">
                      Customer
                    </th>
                    <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-400">
                      Sales
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition"
                    >
                      <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-slate-400">
                        #{row.rn}
                      </td>
                      <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-slate-300 whitespace-nowrap">
                        {row.state}
                      </td>
                      <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-slate-200 truncate max-w-[100px] sm:max-w-none">
                        {row.customer_name}
                      </td>
                      <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-xs sm:text-sm text-emerald-400 font-medium text-right whitespace-nowrap">
                        ${Math.round(row.total_sales).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

        {/* Back Side - Details */}
        <div
          className="absolute inset-0 bg-slate-900/50 rounded-xl border border-slate-800 p-4 sm:p-6 backface-hidden flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
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
                  These Top customers contribute a major share of state-level
                  revenue. Focus on retention strategies for these high-value
                  accounts.
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
                    Offer discounts, coupons, or small gifts to top customers as
                    loyalty rewards.
                  </li>
                  <li>
                    Create state-wise loyalty programs to strengthen long-term
                    relationships.
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Findings */}
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
            Back to Table
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopCustomersTable;
