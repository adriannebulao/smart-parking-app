import react, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import AdminLayout from "../../layouts/AdminLayout";
import {
  fetchGroupedSummary,
  fetchTodaySummary,
  fetchTotalSummary,
} from "../../services/reservationSummaryService";
import { formatDate, formatPeriodLabel, getDaysDiff } from "../../utils/format";
import { buildChartOptions } from "../../utils/chart";
import SummaryCard from "../../components/admin/SummaryCard";
import TotalRangeSummaryCard from "../../components/admin/TotalRangeSummaryCard";

const RANGE_OPTIONS = ["week", "month", "year"];
const GROUP_BY_OPTIONS = ["day", "week", "month", "year"];

function AdminHome() {
  const [todaySummary, setTodaySummary] = useState(null);
  const [totalSummary, setTotalSummary] = useState(null);
  const [totalRange, setTotalRange] = useState("week");
  const [groupedRange, setGroupedRange] = useState("week");
  const [groupBy, setGroupBy] = useState("day");
  const [chartData, setChartData] = useState({
    options: {},
    series: [],
  });

  const validGroupByOptions = () => {
    if (groupedRange === "week") return ["day"];
    if (groupedRange === "month") return ["day", "week"];
    if (groupedRange === "year") return ["day", "week", "month"];
    return [];
  };

  useEffect(() => {
    if (!validGroupByOptions().includes(groupBy)) {
      setGroupBy(validGroupByOptions()[0]);
    }
  }, [groupedRange]);

  useEffect(() => {
    const loadSummaries = async () => {
      try {
        const [today, grouped, total] = await Promise.all([
          fetchTodaySummary(),
          fetchGroupedSummary({ groupBy, range: groupedRange, sort: "asc" }),
          fetchTotalSummary({ range: totalRange }),
        ]);

        setTodaySummary(today);
        setTotalSummary(total);

        const categories = grouped.data.map((item) =>
          formatPeriodLabel(item.period, groupBy)
        );
        const seriesData = grouped.data.map((item) => item.total_reservations);

        setChartData({
          options: buildChartOptions(categories),
          series: [{ name: "Total Reservations", data: seriesData }],
        });
      } catch (error) {
        console.error("Failed to load summaries", error);
      }
    };

    loadSummaries();
  }, [groupBy, groupedRange, totalRange]);

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
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold flex items-center gap-2 flex-wrap">
            Total Reservations in the Past
            <select
              value={groupedRange}
              onChange={(e) => setGroupedRange(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              {RANGE_OPTIONS.map((opt) => (
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
              {GROUP_BY_OPTIONS.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  disabled={!validGroupByOptions().includes(opt)}
                >
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </h2>
        </div>

        <ApexCharts
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </AdminLayout>
  );
}

export default AdminHome;
