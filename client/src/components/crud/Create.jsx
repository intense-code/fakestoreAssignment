import { useState } from 'react';
import ReadDelete from './ReadDelete';
import Update from './Update';


function Create() {
  const [activeView, setActiveView] = useState('create');

  // --- Create logic ---
  const [product, setProduct] = useState({
    title: '',
    price: '',
    category: '',
    image: '',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (
      product.title.trim() === '' ||
      product.price.trim() === '' ||
      product.category.trim() === '' ||
      product.image.trim() === '' ||
      product.description.trim() === ''
    ) {
      setError('All fields are required');
      return false;
    }
    else if (isNaN(product.price) || Number(product.price) <= 0) {
      setError('Price must be a positive number');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        body: JSON.stringify(product),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to create post');
      }
      const data = await response.json();
      setProduct({ title: '', price: '', category: '', image: '', description: '' });
      setSuccess(
        <div>
          <p>New Product Created Successfully:</p>
          ID: {data.id}<br/>
          Title: {data.title}<br/>
          Price: {data.price}<br/>
          Category: {data.category}<br/>
          Image: {data.image}<br/>
          Description: {data.description}
        </div>
      );
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  return (
    <div className="container ">
      


        <div >
          <h2>Create New Product</h2>
          <form onSubmit={handleSubmit} className="mb-3">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input type="text" className="form-control" id="title" name="title" value={product.title} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="price" className="form-label">Price</label>
              <input type="text" className="form-control" id="price" name="price" value={product.price} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <input type="text" className="form-control" id="category" name="category" value={product.category} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image URL</label>
              <input type="text" className="form-control" id="image" name="image" value={product.image} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea className="form-control" id="description" name="description" value={product.description} onChange={handleInputChange} />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <button type="submit" className="btn btn-primary">Create Product</button>
          </form>
        </div>
      

    
    </div>
  );
}

export default Create;