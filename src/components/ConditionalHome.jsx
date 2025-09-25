import React, { useState, useEffect } from 'react';
import { isAuthed } from '../utils/auth';
import HomePage from './HomePage';
import AxiosWithAuth from '../utils/AxiosWithAuth';

const ConditionalHome = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        // Verify token is still valid by making a request
        const response = await AxiosWithAuth().get('/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Authentication failed:', err);
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // If authenticated, show the authenticated home page
  if (isAuthenticated) {
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
        <HomePage />
      </div>
    );
  }

  // If not authenticated, show the public home page
  return (
    <div className="App">
      <h1>Welcome</h1>
      <nav style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <a href="/login">Login</a>
        <span>|</span>
        <a href="/register">Register</a>
      </nav>
    </div>
  );
};

export default ConditionalHome;
