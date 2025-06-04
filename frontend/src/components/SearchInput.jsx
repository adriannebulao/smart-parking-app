import { Search } from "lucide-react";

function SearchInput({ value, onChange, className = "" }) {
  return (
    <input
      type="search"
      value={value}
      onChange={onChange}
      className={`border px-3 py-2 rounded-md ${className}`}
      placeholder="Search..."
      aria-label="Search"
    />
  );
}

export default SearchInput;
