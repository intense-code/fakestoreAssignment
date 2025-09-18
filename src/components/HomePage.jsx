// HomePage.jsx (or page.tsx)
// Make sure Bootstrap CSS is loaded once in your app entry:
// import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel"; 
import axios from "axios";
import ButtonBar from "./ButtonBar";



export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    axios.get("https://fakestoreapi.com/products").then((r) => setProducts(r.data));
  }, []);

  return (

    <div className="center-viewport" style={{ position:'fixed', inset:0, display:'grid', placeItems:'center' }}>
  <ButtonBar />
  <div className="d-flex flex-column align-items-center" style={{ width:'min(92vw, 720px)' }}>
    <Carousel className="w-100" activeIndex={activeIndex} onSelect={setActiveIndex}>
      {products.map((p) => (
        <Carousel.Item key={p.id}>
          <img
            className="d-block w-100 img-fluid"
            src={p.image}
            alt={p.title}
            style={{ maxHeight: "320px", objectFit: "contain" }}
          />
        </Carousel.Item>
      ))}
    </Carousel>
    {/* Show caption for the currently active product below the carousel */}
    {products.length > 0 && (
      <div className="text-center mt-3">
        <h5>{products[activeIndex].title}</h5>
        <p>${products[activeIndex].price}</p>
      </div>
    )}
  </div>
</div>

    
  );
}
