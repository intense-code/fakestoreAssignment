// CenterTest.jsx
// Ensure Bootstrap CSS is loaded ONCE globally:
// import 'bootstrap/dist/css/bootstrap.min.css';

import { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

export default function CenterTest() {
  const [items] = useState([ // static images just for test
    "https://picsum.photos/seed/a/800/400",
    "https://picsum.photos/seed/b/800/400",
    "https://picsum.photos/seed/c/800/400",
  ]);

  return (
    // Full-viewport, independent of parents
    <div
      className="center-viewport"
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        zIndex: 1,
        outline: "2px dashed #ff6", // <-- debug: full-screen box
        background: "transparent",   // don’t hide your app; just overlay to test
      }}
    >
      {/* The centered COLUMN */}
      <div
        className="d-flex flex-column align-items-center"
        style={{
          width: "min(92vw, 720px)",
          outline: "2px dashed #69f", // <-- debug: the centered column
          padding: 12,
          background: "transparent",
        }}
      >
        {/* ButtonBar */}
        <div className="w-100 d-flex justify-content-center mb-4">
          <ButtonGroup>
            <Button href="/" variant="primary">Home</Button>
            <Button href="/products" variant="secondary">Products</Button>
            <Button href="/about" variant="success">About</Button>
          </ButtonGroup>
        </div>

        {/* Carousel */}
        <Carousel className="w-100">
          {items.map((src, i) => (
            <Carousel.Item key={i}>
              <img
                src={src}
                className="d-block mx-auto img-fluid"
                style={{ maxHeight: 320, objectFit: "contain" }}
                alt={`slide ${i + 1}`}
              />
              <Carousel.Caption>
                <h5>Slide {i + 1}</h5>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
}
