import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userId: "", // Unique 10-digit ID
  });

  const [error, setError] = useState("");

  // Function to generate a unique 10-digit ID
  const generateUserId = () => {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Generate unique ID
    const uniqueId = generateUserId();
    setFormData({ ...formData, userId: uniqueId });

    // Show ID in a popup
    alert(`Your Login ID: ${uniqueId}`);

    try {
      // Send data to backend
      const response = await axios.post("http://localhost:3001/api/signup", {
        ...formData,
        userId: uniqueId, // Sending the ID to the backend
      });

      console.log("User Registered:", response.data);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
};

export default SignUp;
