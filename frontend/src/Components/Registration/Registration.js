import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    scheme_id: "",
    scheme_name: "",
    discount_percentage: "",
    discount_applicable_on: "",
    start_date: "",
    end_date: "",
    amount: "",
  });

  const [error, setError] = useState("");

  // ✅ Retrieve selected scheme from localStorage when the component mounts
  useEffect(() => {
    const selectedScheme = JSON.parse(localStorage.getItem("selectedScheme"));
    if (selectedScheme) {
      setFormData((prevData) => ({
        ...prevData,
        scheme_id: selectedScheme.scheme_id,
      }));
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      window.alert("Passwords do not match!");
      return;
    }

    if (!formData.scheme_id) {
      window.alert("Scheme ID is missing! Please select a scheme first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/Schemes/Backend/register.php",
        formData
      );

      if (response.data.status === "success") {
        window.alert("Registration Successful! Redirecting to Login Page...");

        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          address: "",
          scheme_id: "",
          scheme_name: "",
          discount_percentage: "",
          discount_applicable_on: "",
          start_date: "",
          end_date: "",
          amount: "",
        });

        window.location.href = "/login";
      } else {
        window.alert("Registration Failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      window.alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required onChange={handleChange} value={formData.username} />
        <input type="email" name="email" placeholder="Email" required onChange={handleChange} value={formData.email} />
        <input type="number" name="phone" placeholder="Phone" required onChange={handleChange} value={formData.phone} />
        <input type="password" name="password" placeholder="Password" required onChange={handleChange} value={formData.password} />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} value={formData.confirmPassword} />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Registration;
