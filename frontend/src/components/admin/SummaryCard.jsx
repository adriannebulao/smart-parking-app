import React from "react";

function SummaryCard({ title, date, total }) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col justify-between">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      {total !== null ? (
        <>
          <p className="text-sm text-gray-500 mb-1">{date}</p>
          <p className="text-3xl font-bold text-primary">{total}</p>
        </>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}

export default SummaryCard;
