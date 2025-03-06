import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // ✅ Redirect function

  const [formData, setFormData] = useState({
    identifier: "", // Can be email or phone
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/Schemes/Backend/login.php", // ✅ Backend API for login
        formData
      );

      if (response.data.status === "success") {
        window.alert("Login Successful! Redirecting...");

        // ✅ Store login details in localStorage (for session management)
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // ✅ Redirect to dashboard or home page
        navigate("/schemes"); 
      } else {
        setError(response.data.message);
        window.alert("Login Failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
      window.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="identifier" 
          placeholder="Email or Phone" 
          required 
          onChange={handleChange} 
          value={formData.identifier} 
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
