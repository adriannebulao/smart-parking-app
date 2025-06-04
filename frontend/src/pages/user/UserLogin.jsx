import { Link } from "react-router-dom";
import { UserCog } from "lucide-react";
import Form from "../../components/Form";
import logo from "../../assets/logo.svg";
import "../../styles/index.css";

function UserLogin() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 sm:px-6 relative">
      <Link
        to="/admin/login"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 text-background hover:underline text-sm sm:text-base"
      >
        <UserCog size={18} />
        Admin Login
      </Link>

      <div className="w-full max-w-md bg-background rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-14 sm:h-16 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
            LOG IN
          </h2>
        </div>
        <Form route="/api/users/login/" method="login" userType="user" />
        <div className="text-center mt-6 text-sm text-text">
          Don’t have an account?{" "}
          <Link to="/register" className="text-primary font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
