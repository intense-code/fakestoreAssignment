// filepath: /home/rivit/w3/w/webdesign/fullstack/loginRegister/loginregisterFullstack/loginregisterFE/src/utils/useLogout.js
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Redirect to login page
    navigate('/login');
  };

  return logout;
};

export default useLogout;