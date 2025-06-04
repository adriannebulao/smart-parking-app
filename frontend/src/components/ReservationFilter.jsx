function StatusFilter({ value, onChange }) {
  return (
    <select
      className="border px-3 py-2 rounded-md w-full sm:w-48"
      value={value}
      onChange={onChange}
      aria-label="Filter reservations by status"
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="upcoming">Upcoming</option>
      <option value="completed">Completed</option>
      <option value="cancelled">Cancelled</option>
    </select>
  );
}

export default StatusFilter;
