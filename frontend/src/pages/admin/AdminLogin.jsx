import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import Form from "../../components/Form";
import logo from "../../assets/logo.svg";
import "../../styles/index.css";

function AdminLogin() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 sm:px-6 relative">
      <Link
        to="/login"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 text-background hover:underline text-sm sm:text-base"
      >
        <LogIn size={18} />
        User Login
      </Link>

      <div className="w-full max-w-md bg-background rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-14 sm:h-16 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-primary text-center">
            ADMIN LOGIN
          </h2>
        </div>
        <Form route="/api/users/login/" method="login" userType="admin" />
      </div>
    </div>
  );
}

export default AdminLogin;
