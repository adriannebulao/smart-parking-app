function ReservationStatusFilter({ value, onChange, className = "" }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`border px-3 py-2 rounded-md ${className}`}
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

export default ReservationStatusFilter;
