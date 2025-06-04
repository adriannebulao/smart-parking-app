import { Search } from "lucide-react";

function SearchInput({ value, onChange }) {
  return (
    <div className="relative flex items-center w-full sm:max-w-xs">
      <Search className="absolute left-3 text-gray-400" size={16} />
      <input
        type="text"
        placeholder="Search by name..."
        value={value}
        onChange={onChange}
        className="pl-8 pr-3 py-2 border rounded w-full"
      />
    </div>
  );
}

export default SearchInput;
