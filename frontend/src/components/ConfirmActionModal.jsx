import Modal from "./Modal";

function ConfirmActionModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

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
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {confirmText}
          </button>
        </>
      }
    >
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      <p>{message}</p>
    </Modal>
  );
}

export default ConfirmActionModal;
