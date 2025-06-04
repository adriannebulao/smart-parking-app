import Modal from "../Modal";

function ConfirmDeleteModal({ isOpen, name, onClose, onDelete }) {
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
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </>
      }
    >
      <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
      <p>Are you sure you want to delete "{name}"?</p>
    </Modal>
  );
}

export default ConfirmDeleteModal;
