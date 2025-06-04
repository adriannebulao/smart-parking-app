import ApexCharts from "react-apexcharts";
import AdminLayout from "../../layouts/AdminLayout";
import { formatDate, getDaysDiff } from "../../utils/format";
import SummaryCard from "../../components/admin/SummaryCard";
import TotalRangeSummaryCard from "../../components/admin/TotalRangeSummaryCard";
import { useAdminSummary } from "../../hooks/admin/useAdminSummary";
import { getValidGroupByOptions } from "../../utils/validation";

function AdminHome() {
  const {
    todaySummary,
    totalSummary,
    totalRange,
    setTotalRange,
    groupedRange,
    setGroupedRange,
    groupBy,
    setGroupBy,
    chartData,
  } = useAdminSummary();

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Summary Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <SummaryCard
          title="Total Reservations Today"
          date={todaySummary ? formatDate(todaySummary.date) : ""}
          total={todaySummary?.total_reservations}
        />

        <TotalRangeSummaryCard
          range={totalRange}
          onRangeChange={setTotalRange}
          summary={totalSummary}
          formatDate={formatDate}
          getDaysDiff={getDaysDiff}
        />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-lg font-semibold">
            Total Reservations in the Past
          </h2>
          <div className="flex gap-2 flex-wrap">
            <select
              value={groupedRange}
              onChange={(e) => setGroupedRange(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              {["week", "month", "year"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            by
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              {["day", "week", "month", "year"].map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  disabled={!getValidGroupByOptions(groupedRange).includes(opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminHome;
