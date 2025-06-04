import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import AdminLayout from "../../layouts/AdminLayout";
import {
  fetchGroupedSummary,
  fetchTodaySummary,
  fetchTotalSummary,
} from "../../services/reservationSummaryService";

const RANGE_OPTIONS = ["week", "month", "year"];
const GROUP_BY_OPTIONS = ["day", "week", "month", "year"];

function AdminHome() {
  const [todaySummary, setTodaySummary] = useState(null);
  const [totalSummary, setTotalSummary] = useState(null);

  const [totalRange, setTotalRange] = useState("week");
  const [groupedRange, setGroupedRange] = useState("week");
  const [groupBy, setGroupBy] = useState("day");

  const [chartData, setChartData] = useState({
    options: {
      chart: { id: "reservations-bar" },
      plotOptions: { bar: { horizontal: true } },
      yaxis: { categories: [], title: { text: "Period" } },
      xaxis: { title: { text: "Total Reservations" } },
      colors: ["#2f27ce"],
    },
    series: [{ name: "Total Reservations", data: [] }],
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

  function formatPeriodLabel(period) {
    if (!period) return "";

    if (groupBy === "day") {
      const date = new Date(period);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(date);
    }

    if (groupBy === "week") {
      const [year, weekStr] = period.split("-W");
      if (!year || !weekStr) return period;
      return `Week ${parseInt(weekStr, 10)}, ${year}`;
    }

    if (groupBy === "month") {
      const [year, month] = period.split("-");
      if (!year || !month) return period;
      const date = new Date(Number(year), Number(month) - 1);
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
      }).format(date);
    }

    return period;
  }

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
          formatPeriodLabel(item.period)
        );
        const seriesData = grouped.data.map((item) => item.total_reservations);

        setChartData({
          options: {
            chart: { id: "reservations-bar" },
            plotOptions: { bar: { horizontal: false } },
            xaxis: {
              categories,
              title: { text: "Period" },
            },
            yaxis: {
              title: { text: "Total Reservations" },
            },
          },
          series: [{ name: "Total Reservations", data: seriesData }],
        });
      } catch (error) {
        console.error("Failed to load summaries", error);
      }
    };

    loadSummaries();
  }, [groupBy, groupedRange, totalRange]);

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  }

  function getDaysDiff(startDateStr, endDateStr) {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = end - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Summary Reports</h1>

      {/* Equal width cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
          <h2 className="text-lg font-semibold mb-2">Today</h2>
          {todaySummary ? (
            <>
              <p className="text-sm text-gray-500 mb-1">
                {formatDate(todaySummary.date)}
              </p>
              <p className="text-3xl font-bold text-primary">
                {todaySummary.total_reservations}
              </p>
            </>
          ) : (
            <p>Loading…</p>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Total This{" "}
                {totalRange.charAt(0).toUpperCase() + totalRange.slice(1)}
              </h2>
              <select
                value={totalRange}
                onChange={(e) => setTotalRange(e.target.value)}
                className="border rounded p-1"
              >
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {totalSummary ? (
              <>
                <p className="text-sm text-gray-500 mb-2">
                  {formatDate(totalSummary.start_date)} →{" "}
                  {formatDate(totalSummary.end_date)}
                </p>
                <p className="text-3xl font-bold text-primary mb-1">
                  {totalSummary.total_reservations}
                </p>
                <p className="text-sm text-gray-600">
                  Average reservations per day this {totalRange}:{" "}
                  <span className="font-semibold text-primary">
                    {(
                      totalSummary.total_reservations /
                      getDaysDiff(
                        totalSummary.start_date,
                        totalSummary.end_date
                      )
                    ).toFixed(2)}
                  </span>
                </p>
              </>
            ) : (
              <p>Loading…</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            Reservation Summary ({groupBy}s in past {groupedRange})
          </h2>
          <div className="flex gap-4">
            <select
              value={groupedRange}
              onChange={(e) => setGroupedRange(e.target.value)}
              className="border rounded p-1"
            >
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="border rounded p-1"
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
          </div>
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
