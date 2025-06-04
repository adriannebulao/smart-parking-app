import UserLayout from "../../layouts/UserLayout";
import LoadingScreen from "../../components/LoadingScreen";
import useUserProfile from "../../hooks/user/useUserProfile";
import UserProfileForm from "../../components/user/UserProfileForm";
import UserProfileDisplay from "../../components/user/UserProfileDisplay";
import { ToastContainer } from "react-toastify";

function UserProfile() {
  const {
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
  } = useUserProfile();

  if (loading)
    return (
      <UserLayout>
        <LoadingScreen />
      </UserLayout>
    );

  return (
    <UserLayout>
      <div className="p-4 flex flex-col mx-auto sm:mx-0 w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold">My Profile</h2>
          {!isEditing && (
            <button
              onClick={startEditing}
              className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
            >
              Edit
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          {isEditing ? (
            <UserProfileForm
              editedProfile={editedProfile}
              password={password}
              saving={saving}
              handleChange={handleChange}
              setPassword={setPassword}
              handleSubmit={handleSubmit}
              cancelEditing={cancelEditing}
            />
          ) : (
            <UserProfileDisplay profile={profile} />
          )}
        </div>

        <ToastContainer />
      </div>
    </UserLayout>
  );
}

export default UserProfile;
