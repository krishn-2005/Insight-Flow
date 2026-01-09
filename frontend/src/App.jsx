import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Overview from "./pages/Overview";
import Insights from "./pages/Insights";
import Contact from "./pages/Contact";
import FiltersPanel from "../components/FiltersPanel";

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 🔹 filters state
  const [filters, setFilters] = useState({
    year: null,
    region: null,
    category: null,
  });

  // 🔹 APPLY FILTER HANDLER
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <Router>
      <div className="min-h-screen text-slate-200 bg-[#020617]">
        {/* Navbar */}
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${
            isFilterOpen ? "sm:mr-80" : ""
          }`}
        >
          <Navbar
            isFilterOpen={isFilterOpen}
            onFilterToggle={() => setIsFilterOpen(!isFilterOpen)}
          />
        </div>

        {/* Main layout */}
        <div className="flex">
          {/* Dashboard */}
          <main
            className={`flex-1 transition-all duration-300 ${
              isFilterOpen ? "sm:mr-80" : ""
            }`}
          >
            <Routes>
              <Route path="/" element={<Overview filters={filters} />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>

          {/* Filters Panel */}
          {isFilterOpen && (
            <FiltersPanel
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters}
            />
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
