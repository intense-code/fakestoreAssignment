import AxiosWithAuth from './AxiosWithAuth';
  const handleLogout = () => {
    AxiosWithAuth()
      .post("/auth/logout")
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/";
      })
      .catch(err => {
        console.error("Logout error:", err);
        // Force logout even if API call fails
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        window.location.href = "/";
      });
  };
export default handleLogout;