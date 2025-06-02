import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { jwtDecode } from "jwt-decode";

function Form({ route, method, userType = "user" }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLogin = method === "login";
  const name = isLogin
    ? `${userType === "admin" ? "Admin" : ""} Login`
    : "Register ";

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          alert(
            `Logged in user role (${decoded.role}) does not match expected (${userType})`
          );
          localStorage.clear();
          setLoading(false);
          return;
        }

        navigate(userType === "admin" ? "/admin" : "/");
      } else {
        navigate("/login");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1>{name}</h1>

      {!isLogin && (
        <>
          <input
            className="form-input"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            required
          />
          <input
            className="form-input"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last name"
            required
          />
        </>
      )}

      <input
        className="form-input"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        className="form-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="form-button" type="submit">
        {name}
      </button>
    </form>
  );
}

export default Form;
