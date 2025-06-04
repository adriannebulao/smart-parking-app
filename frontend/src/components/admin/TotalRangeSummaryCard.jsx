import react from "react";

function TotalRangeSummaryCard({
  range,
  onRangeChange,
  summary,
  formatDate,
  getDaysDiff,
}) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Total Reservations in the Past
            <select
              value={range}
              onChange={(e) => onRangeChange(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              {["week", "month", "year"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </h2>
        </div>

        {summary ? (
          <>
            <p className="text-sm text-gray-500 mb-2">
              {formatDate(summary.start_date)} → {formatDate(summary.end_date)}
            </p>
            <p className="text-3xl font-bold text-primary mb-1">
              {summary.total_reservations}
            </p>
            <p className="text-sm text-gray-600">
              Average reservations per day this {range}:{" "}
              <span className="font-semibold text-primary">
                {(
                  summary.total_reservations /
                  getDaysDiff(summary.start_date, summary.end_date)
                ).toFixed(2)}
              </span>
            </p>
          </>
        ) : (
          <p>Loading…</p>
        )}
      </div>
    </div>
  );
}

export default TotalRangeSummaryCard;
