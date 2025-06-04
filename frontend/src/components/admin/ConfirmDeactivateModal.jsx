import Modal from "../../components/Modal";

export default function ConfirmDeactivateModal({
  user,
  isOpen,
  onClose,
  onConfirm,
}) {
  if (!user) return null;

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
            Confirm Deactivate
          </button>
        </>
      }
    >
      <h2 className="text-lg font-bold mb-4">Confirm Deactivation</h2>
      <p>
        Are you sure you want to deactivate user{" "}
        <strong>{user.username}</strong> ({user.first_name} {user.last_name})?
      </p>
    </Modal>
  );
}
