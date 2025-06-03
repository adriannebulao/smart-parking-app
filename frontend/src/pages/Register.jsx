import Form from "../components/Form";
import logo from "../assets/logo.svg";
import "../styles/index.css";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

function Register() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center relative">
      <Link
        to="/login"
        className="absolute top-6 right-6 flex items-center gap-2 text-background hover:underline"
      >
        <LogIn size={18} />
        Log in
      </Link>

      <div className="w-full max-w-md bg-background rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Logo" className="h-16 mb-4" />
          <h2 className="text-2xl font-bold text-primary">REGISTER</h2>
        </div>
        <Form route="/api/users/register/" method="register" />
      </div>
    </div>
  );
}

export default Register;
