import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Products from './components/Products';
import NotFound from './components/NotFound';
{/* added code stops here */}			


function App() {
  return (
    <>
			
			<Routes>
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<HomePage />} />
				<Route path="/products" element={<Products />} />
				 	
      </Routes>
    </>
  );
}

export default App;