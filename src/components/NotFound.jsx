import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import Badge from 'react-bootstrap/Badge';
import ButtonBar from './ButtonBar';
function NotFound() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate('/'); 
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
    
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '32px 0' }}>
        <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(92vw, 720px)' }}>
          <h2 className="text-center" style={{color: '#fff'}}>404 Not Found</h2>
          <p style={{color: '#ccc'}}>I am sorry, that location does not exist 😭</p>
          <p><b style={{color: '#fff'}}>You will be redirected to the home page in...</b></p>
          <Badge bg="primary" className="mb-3 fs-2">{countdown}</Badge>
          <p style={{color: '#ccc'}}>Or you can always <Link to="/">go home!</Link></p>
        </div>
      </main>
      <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
        &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
      </footer>
    </div>
  );
}

export default NotFound;