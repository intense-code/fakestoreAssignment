import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ButtonBar from './ButtonBar';

function Buy() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(response => {
        setProduct(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(`Failed to fetch product: ${error.message}`);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
        <ButtonBar />
        <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '32px 0' }}>
          <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(92vw, 720px)' }}>
            <h3>
              <Spinner animation="border" variant="info" role="status" />
              Loading Product...
            </h3>
          </div>
        </main>
        <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
          &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
        </footer>
      </div>
    );
  }

  if (error) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
      <ButtonBar />
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
  if (!product) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
      <ButtonBar />
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '32px 0' }}>
        <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(92vw, 720px)' }}>
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <Card className="shadow-sm">
                <Card.Img variant="top" src={product.image} className="img-fluid" style={{ maxHeight: '300px', objectFit: 'contain' }} />
                <Card.Body>
                  <Card.Title style={{color: '#fff'}}>{product.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">${product.price}</Card.Subtitle>
                  <Card.Text style={{color: '#ccc'}}>{product.description}</Card.Text>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
        &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
      </footer>
    </div>
  );
}

export default Buy;
