import { XCircle } from "lucide-react";
import { getStatus, formatDateTime } from "../utils/reservationUtils";

function ReservationCard({ resv, onCancel, showUser = true }) {
  const status = getStatus(resv);

  const statusStyles = {
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
    active: "bg-blue-100 text-blue-800",
    upcoming: "bg-yellow-100 text-yellow-800",
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow border gap-4">
      <div className="flex-grow min-w-0 space-y-1">
        <p className="font-semibold text-base truncate">
          {resv.parking_location_name}
        </p>
        <p className="text-sm text-gray-600">
          Start: {formatDateTime(resv.start_time)}
        </p>
        <p className="text-sm text-gray-600">
          End: {formatDateTime(resv.end_time)}
        </p>
        {showUser && (
          <p className="text-sm text-gray-700 font-medium">
            User: {resv.user_username}
          </p>
        )}
      </div>

      <div className="flex items-center gap-6 flex-shrink-0">
        {status !== "inactive" && (
          <span
            className={`px-3 py-1 rounded text-sm font-semibold ${statusStyles[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}

        {!resv.is_cancelled &&
          status !== "completed" &&
          status !== "active" && (
            <button
              onClick={() => onCancel(resv)}
              title="Cancel Reservation"
              className="flex items-center gap-1 text-black hover:text-gray-700"
            >
              <XCircle size={20} />
              <span>Cancel</span>
            </button>
          )}
      </div>
    </div>
  );
}

export default ReservationCard;
