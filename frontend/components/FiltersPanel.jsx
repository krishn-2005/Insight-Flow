import { useState } from "react";

function FiltersPanel({ onClose, onApply }) {
  const [year, setYear] = useState("");
  const [region, setRegion] = useState("");
  const [category, setCategory] = useState("");

  const handleApply = () => {
    onApply({
      year: year || null,
      region: region || null,
      category: category || null,
    });
    onClose();
  };

  const handleClear = () => {
    setYear("");
    setRegion("");
    setCategory("");
    onApply({ year: null, region: null, category: null });
    onClose();
  };

  return (
    <>
      {/* Backdrop - Blurred on mobile */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm sm:bg-black/20 sm:backdrop-blur-none"
        onClick={onClose}
      />

      {/* Filter Panel - Bottom sheet on mobile, slide-in on desktop */}
      <aside
        className="fixed z-50 animate-slide-in
                   inset-x-0 bottom-0 sm:inset-auto sm:top-0 sm:right-0 sm:h-full
                   h-auto max-h-[80vh] sm:max-h-none sm:w-80
                   bg-[#0F172A]/95 backdrop-blur-md sm:bg-[#0F172A] sm:backdrop-blur-none
                   border-t sm:border-t-0 sm:border-l border-slate-800
                   rounded-t-2xl sm:rounded-none
                   shadow-2xl shadow-black/50"
      >
        {/* Mobile drag handle indicator */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-slate-600 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Filters</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5 sm:space-y-6 text-sm text-slate-300 overflow-y-auto max-h-[calc(85vh-140px)] sm:max-h-none">
          {/* Year Filter */}
          <div>
            <label className="block mb-2 text-slate-400">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-[#020617]
                         border border-slate-700
                         rounded-lg px-3 py-2
                         text-slate-200"
            >
              <option value="">All Years</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block mb-2 text-slate-400">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-[#020617]
                         border border-slate-700
                         rounded-lg px-3 py-2
                         text-slate-200"
            >
              <option value="">All Regions</option>
              <option value="West">West</option>
              <option value="East">East</option>
              <option value="Central">Central</option>
              <option value="South">South</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block mb-2 text-slate-400">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-[#020617]
                         border border-slate-700
                         rounded-lg px-3 py-2
                         text-slate-200"
            >
              <option value="">All Categories</option>
              <option value="Furniture">Furniture</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleClear}
              className="flex-1 px-3 py-2 rounded-lg
                         bg-white/5 hover:bg-white/10
                         text-slate-300"
            >
              Clear
            </button>

            <button
              onClick={handleApply}
              className="flex-1 px-3 py-2 rounded-lg
                         bg-indigo-600 hover:bg-indigo-500
                         text-white font-medium"
            >
              Apply
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export default FiltersPanel;
