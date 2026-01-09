import { useEffect, useState } from "react";
import axios from "axios";
import Cards from "../../components/Cards";
import RevenueLineChart from "../../components/RevenueLineChart";
import SalesDonutChart from "../../components/SalesDonutChart";
import TopStatesBarChart from "../../components/TopStatesBarChart";

function Overview({ filters }) {
  const [cards, setCards] = useState({});
  const [charts, setCharts] = useState({});

  const fetchDashboardData = (appliedFilters = filters) => {
    axios
      .get("http://127.0.0.1:8000/", {
        params: appliedFilters,
      })
      .then((res) => {
        setCards(res.data.cards);
        setCharts(res.data.charts);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchDashboardData(filters);
  }, [filters]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          <Cards cards={cards} />

          {charts.revenue_trend && (
            <RevenueLineChart data={charts.revenue_trend} />
          )}
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {charts.sales_by_category && (
            <SalesDonutChart data={charts.sales_by_category} />
          )}

          {charts.top_states_revenue && (
            <TopStatesBarChart data={charts.top_states_revenue} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Overview;
