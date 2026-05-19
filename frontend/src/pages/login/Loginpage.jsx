import React, { useState } from 'react';
import './Login.css';
import logo from "../../assets/logo.png";
import { useNavigate } from 'react-router-dom';

const Loginpage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please enter both email and password.");
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        localStorage.setItem("role", data.role);

        alert("Login successful!");

        // Navigate based on role
        if (data.role === "driver") {
          navigate("/driver");
        } else if (data.role === "user") {
          navigate("/main");
        } else {
          alert("Unknown role: " + data.role);
        }

      } else {
        alert(data.error || "Login failed");
      }
    } catch (err) {
      alert("Network error. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <div className="logo"><img src={logo} alt="App Logo" /></div>
        <h2>Sign in to your Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>Log In</button>
        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
      </div>
    </div>
  );
};

export default Loginpage;