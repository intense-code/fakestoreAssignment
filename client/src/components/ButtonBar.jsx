import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import handleLogout from '../utils/handleLogout';
function ButtonBar({ cartCount }) {
  return (
    <div className="container-fluid p-0 m-0">
      <div className="d-flex justify-content-center align-items-center my-4" style={{ minHeight: '56px' }}>
        <div
          style={{
            background: 'linear-gradient(90deg, #111 0%, #222 100%)',
            borderRadius: '16px',
            padding: '12px 36px',
            width: 'fit-content',
            boxShadow: '0 4px 24px rgba(0,0,0,0.28)',
            border: '1px solid #111',
            display: 'flex',
            gap: '18px',
            alignItems: 'center',
          }}
        >
          <ButtonGroup aria-label="Basic example">
            <Button
              href={'/'}
              variant="primary"
              style={{ fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'transform 0.2s', margin: '0 6px' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >Home</Button>
            <Button
              href={'/products'}
              variant="secondary"
              style={{ fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'transform 0.2s', margin: '0 6px' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >Products</Button>
            <Button
              href={'/crud'}
              variant="success"
              style={{ fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'transform 0.2s', margin: '0 6px' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >CRUD Products</Button>
            <Button
              href={'/cart'}
              variant="warning"
              style={{ fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'transform 0.2s', margin: '0 6px', position: 'relative' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >Cart{cartCount > 0 && <span style={{ position: 'absolute', top: '-8px', right: '-18px', background: '#dc3545', color: '#fff', borderRadius: '50%', padding: '2px 8px', fontSize: '0.9rem', fontWeight: 700 }}>{cartCount}</span>}</Button>
          <Button 
        onClick={handleLogout}
        style={{
          backgroundColor: "#f44336",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

export default ButtonBar;