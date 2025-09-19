import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ButtonBar from './ButtonBar';

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('cart');
    setCart(stored ? JSON.parse(stored) : []);
  }, []);

  const handleRemove = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column', width: '100vw' }}>
      <ButtonBar cartCount={cart.length} />
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '3vw 0' }}>
        <div className="shadow-lg rounded-4 p-4 d-flex flex-column align-items-center" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(98vw, 1100px)', maxWidth: '1100px' }}>
          <h2 className="text-center" style={{color: '#fff'}}>Your Cart</h2>
          <div style={{color: '#ffc107', fontWeight: 700, fontSize: '1.2rem', marginBottom: '12px'}}>
            {`Items in cart: ${cart.length}`}
          </div>
          {cart.length === 0 ? (
            <p style={{color: '#bbb'}}>Your cart is empty.</p>
          ) : (
            cart.map(item => (
              <Card key={item.id} className="mb-4 w-100" style={{ maxWidth: '500px' }}>
                <Card.Img variant="top" src={item.image} className="img-fluid" style={{ maxHeight: '180px', objectFit: 'contain' }} />
                <Card.Body>
                  <Card.Title style={{color: '#111'}}>{item.title}</Card.Title>
                  <Card.Text style={{color: '#222'}}>{item.category}</Card.Text>
                  <Card.Subtitle className="mb-2 text-muted" style={{color: '#222'}}>${item.price}</Card.Subtitle>
                  <Card.Text style={{color: '#222'}}>{item.description}</Card.Text>
                  <button className="btn btn-danger w-100 mt-2" onClick={() => handleRemove(item.id)}>Remove</button>
                </Card.Body>
              </Card>
            ))
          )}
        </div>
      </main>
      <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
        &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
      </footer>
    </div>
  );
}

export default Cart;
