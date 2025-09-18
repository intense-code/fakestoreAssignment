import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function ButtonBar() {
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
              href={'/about'}
              variant="success"
              style={{ fontWeight: 600, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.10)', transition: 'transform 0.2s', margin: '0 6px' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            >About</Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
}

export default ButtonBar;