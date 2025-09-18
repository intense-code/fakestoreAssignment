// src/components/products.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
// import { useParams } from 'react-router-dom';
function Products() {
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
      <Container>
        <h1>
          <Spinner
            animation="border"
            variant="info"
            style={{ marginRight: '15px' }}
            role="status"
          />
          Loading Products...
        </h1>
      </Container>
    )
  }

  if (error) return <p>{error}</p>;

  return (
    <Container>
      <h3>Product List</h3>
      <Row>
        {products.map(product => (
          <Col key={product.id} className="mt-4">
            <Card style={{ width: '18rem' }} >
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">👤 {product.price}</Card.Subtitle>
                <Card.Text className="mt-3">📞 {product.description}</Card.Text>
                <Card.Img variant="top" src={product.image} />
                <Button href={`/buy/${product.id}`}>Buy</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Products;