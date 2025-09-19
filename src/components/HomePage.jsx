// HomePage.jsx (or page.tsx)
// Make sure Bootstrap CSS is loaded once in your app entry:
// import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ButtonBar from "./ButtonBar";



export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((r) => setProducts(r.data));
  }, []);

  return (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #181818 0%, #232526 100%)', display: 'flex', flexDirection: 'column', width: '100vw' }}>
   
      <main className="flex-grow-1 d-flex flex-column align-items-center justify-content-center" style={{ width: '100%', padding: '3vw 0' }}>
        <div className="shadow-lg rounded-4 p-4" style={{ background: 'rgba(30,30,30,0.95)', width: 'min(98vw, 1100px)', maxWidth: '1100px' }}>
          <Carousel className="w-100" activeIndex={activeIndex} onSelect={setActiveIndex}>
            {products.map((p) => (
              <Carousel.Item key={p.id}>
                <img
                  className="d-block w-100 img-fluid"
                  src={p.image}
                  alt={p.title}
                  style={{ maxHeight: "320px", objectFit: "contain", cursor: "pointer" }}
                  onClick={() => navigate(`/buy/${p.id}`)}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          {/* Show caption for the currently active product below the carousel */}
          {products.length > 0 && (
            <div className="text-center mt-3">
              <h5 style={{cursor: "pointer", color: '#fff'}} onClick={() => navigate(`/buy/${products[activeIndex].id}`)}>{products[activeIndex].title}</h5>
              <p style={{color: '#ccc'}}>${products[activeIndex].price}</p>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4" style={{ background: '#111', color: '#bbb', letterSpacing: '1px', fontSize: '1.05rem' }}>
        &copy; {new Date().getFullYear()} Nicholas Lacapria of FakeStore. All rights reserved.
      </footer>
    </div>
  );
}
