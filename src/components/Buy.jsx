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
      <Container>
        <ButtonBar />
        <h3>
          <Spinner animation="border" variant="info" role="status" />
          Loading Product...
        </h3>
      </Container>
    );
  }

  if (error) return <Container><p>{error}</p></Container>;
  if (!product) return null;

  return (
    <Container className="mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <Card className="shadow-sm">
            <Card.Img variant="top" src={product.image} className="img-fluid" style={{ maxHeight: '300px', objectFit: 'contain' }} />
            <Card.Body>
              <Card.Title>{product.title}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">${product.price}</Card.Subtitle>
              <Card.Text>{product.description}</Card.Text>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
}

export default Buy;
