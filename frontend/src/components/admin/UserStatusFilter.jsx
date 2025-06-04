function UserStatusFilter({ value, onChange }) {
  return (
    <select
      className="border px-3 py-2 rounded-md w-full sm:w-48"
      value={value}
      onChange={onChange}
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="deactivated">Deactivated</option>
    </select>
  );
}

export default UserStatusFilter;
