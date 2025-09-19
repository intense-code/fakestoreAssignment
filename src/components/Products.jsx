// src/components/products.js

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ButtonBar from './ButtonBar';
// import { useParams } from 'react-router-dom';
function Products() {
  const navigate = useNavigate();
  // const { userId } = useParams();   
  const [products, setProducts] = useState([]);     // State to store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);    // Error state

  // useEffect to fetch products when component mounts
  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products`)
      .then(response => {
        setProducts(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(`Failed to fetch products: ${error.message}`);
        setLoading(false);
      });

  }, []); // Empty dependency array ensures this runs only once

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
        
        <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '32px 0' }}>
          <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(92vw, 720px)' }}>
            <h1>
              <Spinner
                animation="border"
                variant="info"
                style={{ marginRight: '15px' }}
                role="status"
              />
              Loading Products...
            </h1>
          </div>
        </main>
        <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
          &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
        </footer>
      </div>
    )
  }

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
      
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '32px 0' }}>
        <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(92vw, 720px)' }}>
          <p>{error}</p>
        </div>
      </main>
      <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
        &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
      </footer>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
      
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '32px 0' }}>
        <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(96vw, 1400px)' }}>
          <h3 className="text-center" style={{color: '#f0eeeeff'}}>Product List</h3>
          <Row>
            {products.map(product => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mt-4 d-flex align-items-stretch">
                <Card
                  className="w-100 shadow-sm"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/buy/${product.id}`)}
                >
                  <Card.Img variant="top" src={product.image} className="img-fluid" style={{ maxHeight: '200px', objectFit: 'contain' }} />
                  <Card.Body>
                    <Card.Title style={{color: '#111'}}>{product.title}</Card.Title>
                    <Card.Text className="mt-3" style={{marginLeft:"50px",color: '#222'}}>{product.category}</Card.Text>
                    <Card.Subtitle className="mb-2 text-muted" style={{color: '#222'}}>${product.price}</Card.Subtitle>
                    <Card.Text className="mt-3" style={{color: '#222'}}>{product.description}</Card.Text>
                    <Button
                      variant="success"
                      onClick={e => {
                        e.stopPropagation();
                        const stored = localStorage.getItem('cart');
                        const cart = stored ? JSON.parse(stored) : [];
                        localStorage.setItem('cart', JSON.stringify([...cart, product]));
                        window.dispatchEvent(new Event('cartUpdated'));
                      }}
                    >Add to Cart</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </main>
      <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
        &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
      </footer>
    </div>
  );
}

export default Products;