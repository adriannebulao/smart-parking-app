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
