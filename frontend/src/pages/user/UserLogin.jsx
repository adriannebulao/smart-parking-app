import { Link } from "react-router-dom";
import { UserCog } from "lucide-react";
import Form from "../../components/Form";
import logo from "../../assets/logo.svg";
import "../../styles/index.css";

function UserLogin() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center relative">
      <Link
        to="/admin/login"
        className="absolute top-6 right-6 flex items-center gap-2 text-background hover:underline"
      >
        <UserCog size={18} />
        Admin Login
      </Link>

      <div className="w-full max-w-md bg-background rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mb-4" />
          <h2 className="text-2xl font-bold text-primary">LOG IN</h2>
        </div>
        <Form route="/api/users/login/" method="login" userType="user" />
        <div className="text-center mt-6 text-sm text-text">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
