import React, { useState } from "react";
import "../Styles/Signup.css";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const register = () => {
    Axios.post("http://localhost:4500/api/v1/register", {
      name,
      email,
      password,
    })
      .then((response) => {
        if (response.data === "success") {
          alert("Registered Successfully");
          navigate("/login"); // after signup → go to login
        } else {
          alert("You are already registered. Please login.");
          navigate("/login");
        }
      })
      .catch((err) => console.error("Registration error:", err));
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setname(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setemail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
      </div>
      <button onClick={register}>Sign Up</button>
      <p>
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="pointer text-blue-600 underline"
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default Signup;
