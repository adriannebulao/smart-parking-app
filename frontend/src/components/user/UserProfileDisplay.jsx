export default function UserProfileDisplay({ profile }) {
  return (
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
  );
}
