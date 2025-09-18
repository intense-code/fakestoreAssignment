import { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => setProducts(response.data));
  }, []);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center">
  <div className="mx-auto" style={{maxWidth: '700px', width: '100%'}}>
        <div className="text-center mb-4">
          <h3>Welcome to the 🏠 page!</h3>
          <p>Check out our featured products below:</p>
        </div>
        <Carousel>
          {products.map(product => (
            <Carousel.Item key={product.id}>
              <img
                className="d-block w-100 img-fluid"
                src={product.image}
                alt={product.title}
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
              <Carousel.Caption>
                <h5>{product.title}</h5>
                <p>${product.price}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
 
  );
}

 


export default HomePage;