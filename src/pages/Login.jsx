// pages/Login.jsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      setAuth({ user, token });

      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        alert("You are not authorized!");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Login failed. Please try again.";
      alert("Login failed: " + errorMsg);
    }
  };

  return (
    <div style={{
      backgroundImage: "url('https://cdn.pixabay.com/photo/2016/10/22/01/54/wood-1759566_1280.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        padding: "2rem",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            style={{
              padding: "0.75rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <input
            style={{
              padding: "0.75rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem"
            }}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button
            type="submit"
            style={{
              padding: "0.75rem",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#4a6fa5",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer",
              transition: "background-color 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#3a5a8f"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#4a6fa5"}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;