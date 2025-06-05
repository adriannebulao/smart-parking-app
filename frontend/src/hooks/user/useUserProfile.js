import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../services/user/userProfileService";
import { toast } from "react-toastify";

/**
 * Custom hook for managing the user profile form.
 * Handles fetching, editing, validating, and updating user profile data.
 *
 * @returns {Object} Profile state, form state, and handlers.
 */
export default function useUserProfile() {
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

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile()
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Failed to fetch profile"))
      .finally(() => setLoading(false));
  }, []);

  /**
   * Starts editing mode by copying the current profile to the edit state.
   */
  const startEditing = () => {
    setEditedProfile(profile);
    setPassword("");
    setIsEditing(true);
  };

  /**
   * Cancels editing and resets the edit state.
   */
  const cancelEditing = () => {
    setEditedProfile(null);
    setPassword("");
    setIsEditing(false);
  };

  /**
   * Handles changes to the edit form fields.
   * @param {Object} e - The input change event.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles profile form submission.
   * Only sends changed fields to the API.
   * Logs out the user if username or password changes.
   * @param {Object} e - The form submit event.
   */
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
      const res = await updateUserProfile(updateData);
      setProfile(res.data);
      setIsEditing(false);
      toast.success("Profile updated successfully");

      // Log out if credentials changed
      if (usernameChanged || passwordChanged) {
        toast.info("Logging out due to credential change", {
          autoClose: 2000,
          onClose: () => {
            localStorage.clear();
            navigate("/login");
          },
        });
      }
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    editedProfile,
    password,
    loading,
    saving,
    isEditing,
    startEditing,
    cancelEditing,
    handleChange,
    setPassword,
    handleSubmit,
  };
}
