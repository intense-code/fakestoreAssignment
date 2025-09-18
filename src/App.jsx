import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Products from './components/Products';
import NotFound from './components/NotFound'; 
import Buy from './components/Buy'; 
import CenteredPage from './components/CenteredPage';
{/* added code stops here */}			


function App() {
  return (
    <> 
      <Routes>
        <Route path="center" element={<CenteredPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<Products />} />
  <Route path="/buy/:id" element={<Buy />} />
      </Routes>
    </>
  );
}

export default App;