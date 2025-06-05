/**
 * Builds chart options for reservation summary charts.
 * @param {Array<string>} categories - X-axis categories.
 * @returns {Object} Chart options object.
 */
export function buildChartOptions(categories) {
  return {
    chart: { id: "reservations-bar" },
    plotOptions: { bar: { horizontal: false } },
    xaxis: {
      categories,
      title: { text: "Period" },
    },
    yaxis: {
      title: { text: "Total Reservations" },
    },
    colors: ["#2f27ce"],
  };
}
