import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/auth/login", {
        email,
        password
      });

      localStorage.setItem("token", res.data.token); // ✅ Store token
      alert("Login successful!");
      onLogin(); // Go to chat
    } catch (err) {
      alert("Login failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          style={{ display: "block", margin: "1rem 0" }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={{ display: "block", marginBottom: "1rem" }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
  Don't have an account? <Link to="/register">Register</Link>
</p>

    </div>
  );
};

export default Login;
