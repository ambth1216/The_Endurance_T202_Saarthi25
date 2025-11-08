import React, { useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setlemail] = useState("");
  const [password, setlpassword] = useState("");

  const navigate = useNavigate();

  const login = () => {
    Axios.post("http://localhost:4500/api/v1/login", {
      email,
      password,
    })
      .then((response) => {
        if (response.data === "success") {
          alert("Login Successful!");
          navigate("/new"); // your home/dashboard route
        } else {
          alert("User not found. Please register first.");
          navigate("/signup");
        }
      })
      .catch((err) => console.error("Login error:", err));
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setlemail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setlpassword(e.target.value)}
        />
      </div>
      <button onClick={login}>Login</button>
      <p>
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="pointer text-blue-600 underline"
        >
          Sign up here
        </span>
      </p>
    </div>
  );
};

export default Login;
