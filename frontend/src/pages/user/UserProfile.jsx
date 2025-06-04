import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import UserLayout from "../../layouts/UserLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    username: "",
    first_name: "",
    last_name: "",
  });
  const [editedProfile, setEditedProfile] = useState(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    api
      .get("/api/users/profile/")
      .then((res) => {
        setProfile({
          username: res.data.username,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
        });
      })
      .catch(() => toast.error("Failed to fetch profile"))
      .finally(() => setLoading(false));
  }, []);

  const startEditing = () => {
    setEditedProfile(profile);
    setPassword("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedProfile(null);
    setPassword("");
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = {};

    const usernameChanged = editedProfile.username !== profile.username;
    const passwordChanged = password.trim() !== "";

    if (usernameChanged) updateData.username = editedProfile.username;
    if (editedProfile.first_name !== profile.first_name)
      updateData.first_name = editedProfile.first_name;
    if (editedProfile.last_name !== profile.last_name)
      updateData.last_name = editedProfile.last_name;
    if (passwordChanged) updateData.new_password = password;

    if (Object.keys(updateData).length === 0) {
      toast.info("No changes to save");
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch("/api/users/profile/", updateData);
      setProfile({
        username: res.data.username,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
      });
      setIsEditing(false);
      setEditedProfile(null);
      setPassword("");
      toast.success("Profile updated successfully");

      if (usernameChanged || passwordChanged) {
        toast.info("You will be logged out due to username/password change", {
          autoClose: 2000,
          onClose: () => {
            localStorage.clear();
            navigate("/login");
          },
        });
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <UserLayout>
        <div className="p-4 h-screen flex flex-col">
          <p>Loading...</p>
        </div>
      </UserLayout>
    );

  return (
    <UserLayout>
      <div className="p-4 h-screen flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">My Profile</h2>
          {!isEditing && (
            <button
              onClick={startEditing}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Edit
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="block font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={editedProfile.username}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="first_name">
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={editedProfile.first_name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="last_name">
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={editedProfile.last_name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1" htmlFor="password">
                New Password (leave blank to keep current)
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

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
        ) : (
          <div className="space-y-4 bg-white p-6 rounded shadow border max-w-lg">
            <div>
              <h3 className="font-semibold text-gray-700">Username</h3>
              <p>{profile.username}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">First Name</h3>
              <p>{profile.first_name}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700">Last Name</h3>
              <p>{profile.last_name}</p>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </UserLayout>
  );
}

export default UserProfile;
