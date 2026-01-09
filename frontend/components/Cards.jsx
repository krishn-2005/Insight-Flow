function formatNumber(value) {
  if (value === null || value === undefined) return "0";

  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M";
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(0) + "K";
  }
  return Math.round(value);
}

function Cards({ cards }) {
  return (
    /* Wrapper to control width */
    <div className="max-w-7xl">
      <section
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >
        {/* Total Sales */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 relative">
          <p className="text-sm text-slate-400">Total Sales</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            $ {formatNumber(cards.total_sales)}
          </h2>
          <div className="mt-1 h-4"></div>
          <div className="absolute bottom-8 right-5 w-11 h-11 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Total Profit */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 relative">
          <p className="text-sm text-slate-400">Total Profit</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            $ {formatNumber(cards.total_profit)}
          </h2>
          <div className="mt-1 h-4"></div>
          <div className="absolute bottom-8 right-5 w-11 h-11 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 relative">
          <p className="text-sm text-slate-400">Total Orders</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {formatNumber(cards.total_orders)}
          </h2>
          <div className="mt-1 h-4"></div>
          <div className="absolute bottom-8 right-5 w-11 h-11 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>

        {/* Profit Margin */}
        <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 relative">
          <p className="text-sm text-slate-400">Profit Margin %</p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {formatNumber(cards.profit_margin)}
          </h2>
          <div className="mt-1 h-4"></div>
          <div className="absolute bottom-8 right-5 w-11 h-11 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Cards;
