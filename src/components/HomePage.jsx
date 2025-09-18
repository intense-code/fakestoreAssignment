// src/components/HomePage.jsx

// this importing method works but isn't the preferred way
// imports a lot of extra things that make the App less efficient
import { Container, Carousel, Row, Col } from 'react-bootstrap';

function HomePage() {

  return (
    <Container>
      <Row>
        <Col>
          <h3>Hi, welcome to the 🏠 page!</h3>
          <p>This app will let you see all of the very important fake users JSONPlaceholder gives us.</p>
        </Col>
      </Row>

      <Row>
        <Col>
         
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;