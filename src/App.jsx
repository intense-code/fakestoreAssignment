import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Products from './components/Products';
import NotFound from './components/NotFound'; 
import Buy from './components/Buy'; 
import Crud from './components/Crud';
{/* added code stops here */}			

import ButtonBar from './components/ButtonBar';
import Cart from './components/Cart';

function App() {
  // Get cart count from localStorage
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
    // Listen for storage changes (other tabs)
    const handleStorage = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(updatedCart.length);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="App"> 
      {window.location.pathname !== '/cart' && <ButtonBar cartCount={cartCount} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/buy/:id" element={<Buy />} />
        <Route path="/crud" element={<Crud />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;