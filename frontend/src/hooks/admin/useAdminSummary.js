import { useState, useEffect } from "react";
import {
  fetchGroupedSummary,
  fetchTodaySummary,
  fetchTotalSummary,
} from "../../services/admin/reservationSummaryService";
import { formatPeriodLabel } from "../../utils/format";
import { buildChartOptions } from "../../utils/chart";
import { getValidGroupByOptions } from "../../utils/validation";

export function useAdminSummary() {
  const [todaySummary, setTodaySummary] = useState(null);
  const [totalSummary, setTotalSummary] = useState(null);
  const [totalRange, setTotalRange] = useState("week");
  const [groupedRange, setGroupedRange] = useState("week");
  const [groupBy, setGroupBy] = useState("day");
  const [chartData, setChartData] = useState({ options: {}, series: [] });

  useEffect(() => {
    const validOptions = getValidGroupByOptions(groupedRange);
    if (!validOptions.includes(groupBy)) {
      setGroupBy(validOptions[0]);
    }
  }, [groupedRange]);

  useEffect(() => {
    async function loadSummaries() {
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
    }
    loadSummaries();
  }, [groupBy, groupedRange, totalRange]);

  return {
    todaySummary,
    totalSummary,
    totalRange,
    setTotalRange,
    groupedRange,
    setGroupedRange,
    groupBy,
    setGroupBy,
    chartData,
  };
}
