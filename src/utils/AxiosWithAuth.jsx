import axios from "axios";

const AxiosWithAuth = () => {
  const token = localStorage.getItem("token");
  
  console.log("🔍 Token from localStorage:", token ? "Present" : "Missing");
  
  if (token) {
    // Clean the token - remove any whitespace, quotes, or invalid characters
    const cleanToken = token.trim().replace(/['"]/g, ''); // Remove quotes if any
    console.log("🧹 Cleaned token:", cleanToken.substring(0, 20) + "...");
    
    return axios.create({
      headers: {
        Authorization: `Bearer ${cleanToken}`, // Use capital A for Authorization
      },
      baseURL: "http://127.0.0.1:55505/api",
    });
  }

  return axios.create({
    baseURL: "http://127.0.0.1:55505/api",
  });
};

export default AxiosWithAuth;