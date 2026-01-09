import ReturnRateBarChart from "../../components/ReturnRateBarChart";
import TopCustomersTable from "../../components/TopCustomersTable";
import ShippingPerformanceChart from "../../components/ShippingPerformanceChart";
import MoMGrowthChart from "../../components/MoMGrowthChart";
import ProfitLossDonutChart from "../../components/ProfitLossDonutChart";
import TopProductsLollipopChart from "../../components/TopProductsLollipopChart";

function Insights() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Page Header */}
      <div className="max-w-[1155px] mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-100 mb-2">
            Key Insights
          </h1>
          <p className="text-slate-400">
            Deep dive into business performance metrics — uncover return trends,
            top customers, shipping efficiency, profit drivers, and growth
            patterns
          </p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Left Column - Return Rate Chart */}
          <div>
            <ReturnRateBarChart />
          </div>

          {/* Right Column - Top Customers Table */}
          <div>
            <TopCustomersTable />
          </div>

          {/* Left Column - Shipping Performance */}
          <div>
            <ShippingPerformanceChart />
          </div>

          {/* Right Column - Month-over-Month Growth */}
          <div>
            <MoMGrowthChart />
          </div>

          {/* Left Column - Profit vs Loss */}
          <div>
            <ProfitLossDonutChart />
          </div>

          {/* Right Column - Top Products Lollipop Chart */}
          <div>
            <TopProductsLollipopChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
