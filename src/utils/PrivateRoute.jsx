import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AxiosWithAuth from './AxiosWithAuth';

const PrivateRoute = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [online,setOnline]=useState([])
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await AxiosWithAuth().get('/users/me');
        setUser(response.data);
         const onlineres = await AxiosWithAuth().get('/users/online');
        setOnline(onlineres.data);
        console.log('Online',online);
        console.log('Users/me/',user)
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError(err);
        // If token is invalid, remove it
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" replace />;
  }

  if (error && error.response?.status === 401) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {user && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          padding: '10px 15px',
          backgroundColor: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          Welcome, {user.username}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default PrivateRoute;