import Modal from "../Modal";

function ParkingLocationModal({
  isOpen,
  title,
  form,
  onChange,
  onClose,
  onSubmit,
  isEdit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className={`px-4 py-2 ${
              isEdit
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white rounded`}
          >
            {isEdit ? "Save Changes" : "Create"}
          </button>
        </>
      }
    >
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => onChange({ ...form, name: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          placeholder="Slots"
          value={form.slots}
          onChange={(e) => onChange({ ...form, slots: Number(e.target.value) })}
          className="w-full border rounded p-2"
        />
      </div>
    </Modal>
  );
}

export default ParkingLocationModal;
