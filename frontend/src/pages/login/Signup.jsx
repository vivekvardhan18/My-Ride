import React, { useState } from 'react';
import './Login.css';
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", role: "user" });

    const handleSubmit = async () => {
        if (form.password !== form.confirm) return alert("Passwords do not match");

        const res = await fetch("http://localhost:5000/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                email: form.email,
                password: form.password,
                role: form.role
            })
        });

        const data = await res.json();
        if (res.ok) {
            alert("Signup successful. Please log in.");
            navigate("/login");
        } else {
            alert(data.error || "Signup failed");
        }
    };

    return (
        <div className="app">
            <div className="container">
                <div className="logo"><img src={logo} alt="App Logo" /></div>
                <h2>Create a New Account</h2>
                <input type="text" placeholder="Full Name" onChange={e => setForm({ ...form, name: e.target.value })} />
                <input type="email" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
                <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
                <input type="password" placeholder="Confirm Password" onChange={e => setForm({ ...form, confirm: e.target.value })} />

                {/* Role Selection */}
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="user">User</option>
                    <option value="driver">Driver</option>
                </select>

                <button className="login-button" onClick={handleSubmit}>Sign Up</button>
                <p>Already have an account? <a href="/login">Log In</a></p>
            </div>
        </div>
    );
};

export default Signup;