import { useState, useEffect } from 'react'; // React hooks
import { useNavigate } from 'react-router-dom'; // Navigation
import axios from 'axios'; // HTTP requests
import Row from 'react-bootstrap/Row'; // Bootstrap grid
import Col from 'react-bootstrap/Col'; // Bootstrap grid
import Card from 'react-bootstrap/Card'; // Bootstrap card UI
import Button from 'react-bootstrap/Button'; // Bootstrap button
import Spinner from 'react-bootstrap/Spinner'; // Loading spinner
import ButtonBar from './ButtonBar'; // Navigation bar
// Products.jsx - Displays product list and allows adding to cart
// Uses fakestoreapi.com/products and localStorage for cart
// src/components/products.js

function Products() {
  const navigate = useNavigate();
  // const { userId } = useParams();   
  const [products, setProducts] = useState([]);     // State to store products
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);    // Error state

  // Pagination state and logic
  const [page, setPage] = useState(1);
  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const paginatedProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);

  // useEffect to fetch products when component mounts
  // Fetch products from fakestoreapi.com/products
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

  // Show loading spinner while fetching products
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

  // Show error message if API fails
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

  // Render product cards and allow adding to cart, with pagination
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column' }}>
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '32px 0' }}>
        <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(96vw, 1400px)' }}>
          <h3 className="text-center" style={{color: '#f0eeeeff'}}>Product List</h3>
          <Row>
            {paginatedProducts.map(product => (
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
          {/* Pagination controls with clickable page numbers */}
          {totalPages > 1 && (
            <div className="d-flex flex-wrap justify-content-center align-items-center mt-4 gap-2">
              <Button
                variant="outline-light"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="mx-2"
              >Previous</Button>
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx + 1}
                  variant={page === idx + 1 ? "primary" : "outline-light"}
                  onClick={() => setPage(idx + 1)}
                  style={{ minWidth: 36, fontWeight: 600 }}
                >{idx + 1}</Button>
              ))}
              <Button
                variant="outline-light"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                className="mx-2"
              >Next</Button>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
        &copy; {new Date().getFullYear()} FakeStore. All rights reserved.
      </footer>
    </div>
  );
}

export default Products;