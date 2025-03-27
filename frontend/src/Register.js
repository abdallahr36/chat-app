import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/api/auth/register", formData);
      alert("🎉 Registered successfully! Now log in.");
      navigate("/login"); // redirects to login
    } catch (err) {
      setError("Registration failed. Email might be in use.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register 📝</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        /><br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Register;
