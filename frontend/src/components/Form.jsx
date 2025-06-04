import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Form({ route, method, userType = "user" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLogin = method === "login";
  const name = isLogin ? `${userType === "admin" ? "" : ""} Login` : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    const data = {
      username,
      password,
      ...(method === "register" && {
        first_name: firstName,
        last_name: lastName,
      }),
    };

    try {
      const res = await api.post(route, data);

      if (isLogin) {
        const accessToken = res.data.access;
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        const decoded = jwtDecode(accessToken);

        if (decoded.role !== userType) {
          if (userType === "admin") {
            toast.error(
              "This is a user account. Please use the user login page."
            );
          } else {
            toast.error(
              "This is an admin account. Please use the admin login page."
            );
          }
          setLoading(false);
          return;
        }

        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);

        toast.success("Login successful!");
        navigate(userType === "admin" ? "/admin" : "/user/parking-locations");
      } else {
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (e) {
      toast.error("Login failed. Please check your credentials.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isLogin && (
        <>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
            className="p-3 rounded-md bg-background-gray text-text"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
            className="p-3 rounded-md bg-background-gray text-text"
          />
        </>
      )}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        className="p-3 rounded-md bg-background-gray text-text"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="p-3 rounded-md bg-background-gray text-text"
        autoComplete="new-password"
      />
      {!isLogin && (
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          required
          className="p-3 rounded-md bg-background-gray text-text"
          autoComplete="new-password"
        />
      )}
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white py-3 rounded-md font-semibold hover:bg-accent transition"
      >
        {loading ? "Processing..." : name}
      </button>
    </form>
  );
}

export default Form;
