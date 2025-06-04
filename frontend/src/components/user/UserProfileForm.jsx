import FormInput from "./FormInput";

export default function UserProfileForm({
  editedProfile,
  password,
  saving,
  handleChange,
  setPassword,
  handleSubmit,
  cancelEditing,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <FormInput
        id="username"
        label="Username"
        value={editedProfile.username}
        onChange={handleChange}
        required
      />
      <FormInput
        id="first_name"
        label="First Name"
        value={editedProfile.first_name}
        onChange={handleChange}
        required
      />
      <FormInput
        id="last_name"
        label="Last Name"
        value={editedProfile.last_name}
        onChange={handleChange}
        required
      />
      <FormInput
        id="password"
        label="New Password (leave blank to keep current)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
      />

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={cancelEditing}
          disabled={saving}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
