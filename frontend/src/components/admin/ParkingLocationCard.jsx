import { Pencil, Trash } from "lucide-react";

function ParkingLocationCard({ loc, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow border">
      <div className="flex-grow min-w-0">
        <span className="font-semibold text-base truncate">{loc.name}</span>
        <div className="text-sm text-gray-600 mt-1">
          {loc.available_slots} / {loc.slots} slots
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={onEdit} className="text-black hover:text-gray-700">
          <Pencil size={20} />
        </button>
        <button onClick={onDelete} className="text-black hover:text-gray-700">
          <Trash size={20} />
        </button>
      </div>
    </div>
  );
}

export default ParkingLocationCard;
