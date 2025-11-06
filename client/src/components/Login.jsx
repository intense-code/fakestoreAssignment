import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  
  const [userInfo, setUserInfo] = useState({
    userAgent: "",
    ip: ""
  });

  // Get user agent and IP when component mounts
  useEffect(() => {
    // Get user agent
    const userAgent = navigator.userAgent;
    setUserInfo(prev => ({ ...prev, userAgent }));
    
    // Get IP address (optional - using a public service)
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => {
        setUserInfo(prev => ({ ...prev, ip: data.ip }));
      })
      .catch(err => {
        console.log("Could not get IP:", err);
        setUserInfo(prev => ({ ...prev, ip: "Unknown" }));
      });
  }, []);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("🔐 Attempting login with:", { username: credentials.username });
    console.log("🌐 User Agent:", userInfo.userAgent);
    console.log("🌐 IP Address:", userInfo.ip);

    // Use regular axios for login (no token needed)
    axios.post("http://127.0.0.1:55505/api/auth/login", credentials)
      .then(res => {
        console.log("✅ Login successful:", res.data);
        
        // Clean and store the token
        const token = res.data.token;
        if (token) {
          const cleanToken = token.trim();
          localStorage.setItem("token", cleanToken);
          console.log("💾 Token stored successfully");
        }
        
        // Store user info for display
        localStorage.setItem("userInfo", JSON.stringify({
          username: res.data.user.username,
          userAgent: userInfo.userAgent,
          ip: userInfo.ip,
          loginTime: new Date().toISOString()
        }));
        
        // alert("Login successful!");
        window.location.href = "/dashboard";
      })
      .catch(err => {
        console.error("❌ Login error:", err);
        console.error("❌ Error response:", err.response?.data);
        alert("Login failed: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="App">
      <h1>Login Page</h1>
      <Link to="/register">Register</Link>
      
      {/* Display user info */}
      <div style={{ 
        margin: "20px 0", 
        padding: "10px", 
        backgroundColor: "#f5f5f5", 
        borderRadius: "5px",
        fontSize: "12px",
        color: "#666"
      }}>
        <div><strong>Your Browser:</strong> {userInfo.userAgent}</div>
        <div><strong>Your IP:</strong> {userInfo.ip || "Loading..."}</div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <input 
          onChange={handleChange} 
          name="username" 
          value={credentials.username}
          type="text" 
          placeholder="Username"
          required
        />
        <input 
          onChange={handleChange}
          type="password" 
          name="password" 
          value={credentials.password}
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;