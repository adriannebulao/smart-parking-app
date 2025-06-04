import { XCircle } from "lucide-react";

function UserCard({ user, onDeactivate }) {
  const status = user.is_active ? "Active" : "Deactivated";

  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow border">
      <div className="flex-grow min-w-0">
        <p className="font-semibold text-lg truncate">
          {user.first_name} {user.last_name}
        </p>
        <p className="text-sm text-gray-600 truncate">{user.username}</p>
      </div>

      <div className="flex items-center gap-6 flex-shrink-0">
        <span
          className={`px-3 py-1 rounded text-sm font-semibold ${
            user.is_active
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>

        {user.is_active && (
          <button
            onClick={() => onDeactivate(user)}
            title="Deactivate User"
            className="flex items-center gap-1 text-black hover:text-gray-700"
          >
            <XCircle size={20} />
            <span>Deactivate</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default UserCard;
