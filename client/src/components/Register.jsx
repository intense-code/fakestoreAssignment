import axios from "axios";
import {Link} from "react-router-dom";
import { useState } from "react";

const Register = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    department: "",
    role: "2" // Set default role to "2" (user) instead of empty string
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Debug: Log what we're sending
    console.log("📤 Sending registration data:", credentials);

    // Use regular axios (not AxiosWithAuth) since registration doesn't need a token
    axios.post("/api/auth/register", credentials)
      .then(res => {
        console.log("✅ Registration response:", res.data);
        alert("Registration successful! Please login.");
        window.location.href = "/login";
      })
      .catch(err => {
        console.error("❌ Registration error:", err);
        console.error("❌ Error response:", err.response?.data);
        alert("Registration failed: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="App">
      <h1>Register Page</h1>
      <Link to="/login">Login</Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input 
          id="username"
          onChange={handleChange} 
          name="username" 
          value={credentials.username}
          type="text" 
          placeholder="Username"
          required
        />
        
        <label htmlFor="password">Password:</label>
        <input 
          id="password"
          onChange={handleChange}
          type="password" 
          name="password" 
          value={credentials.password}
          placeholder="Password"
          required
        />
        
        <label htmlFor="department">Department:</label>
        <input 
          id="department"
          onChange={handleChange} 
          name="department" 
          value={credentials.department}
          type="text" 
          placeholder="Department (e.g., IT, Marketing)"
          required
        />
        
        <label htmlFor="role">Role:</label>
        <select 
          id="role"
          onChange={handleChange} 
          name="role" 
          value={credentials.role}
          required
        >
          <option value="2">User</option>
          <option value="1">Admin</option>
        </select>
        
        <div className="terms-container">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            required 
          />
          <label htmlFor="terms">Agree to Terms & Conditions</label>
        </div>
          
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;