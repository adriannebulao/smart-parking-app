import { useState } from "react";

export default function ReserveModal({ isOpen, onClose, onConfirm, location }) {
  const [form, setForm] = useState({ start_time: "", end_time: "" });

  const nowISOString = () => new Date().toISOString().slice(0, 16);

  const handleStartChange = (value) => {
    if (new Date(value) < new Date()) return;
    setForm((prev) => ({
      ...prev,
      start_time: value,
      end_time:
        prev.end_time && new Date(prev.end_time) <= new Date(value)
          ? ""
          : prev.end_time,
    }));
  };

  const handleEndChange = (value) => {
    if (form.start_time && new Date(value) <= new Date(form.start_time)) return;
    setForm((prev) => ({ ...prev, end_time: value }));
  };

  const handleReserve = () => {
    onConfirm(form);
  };

  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-bold mb-4">
          Reserve Parking: {location.name}
        </h2>

        <div className="space-y-3">
          <label className="block">
            Start Time:
            <input
              type="datetime-local"
              value={form.start_time}
              onChange={(e) => handleStartChange(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              min={nowISOString()}
            />
          </label>
          <label className="block">
            End Time:
            <input
              type="datetime-local"
              value={form.end_time}
              onChange={(e) => handleEndChange(e.target.value)}
              className="w-full border rounded p-2 mt-1"
              min={form.start_time || nowISOString()}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleReserve}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
