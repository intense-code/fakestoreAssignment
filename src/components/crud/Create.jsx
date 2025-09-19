import { useState } from 'react';

function Create() {
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
          Description: {data.description}<br/>
          Category: {data.category}<br/>
          Image: {data.image}<br/>
        </div>
      );
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <h1>Create New Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label><br/>
          <input
            type="text"
            id="title"
            name="title"
            value={product.title}
            onChange={handleInputChange}
            placeholder="Enter title"
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label><br/>
          <input
            type="text"
            id="price"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="Enter the price"
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label><br/>
          <textarea
            id="description"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            placeholder="Enter Description"
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label><br/>
          <input
            type="text"
            id="category"
            name="category"
            value={product.category}
            onChange={handleInputChange}
            placeholder="Enter Category"
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label><br/>
          <input
            type="text"
            id="image"
            name="image"
            value={product.image}
            onChange={handleInputChange}
            placeholder="Enter Image URL"
          />
        </div>
        <br/>
        <button type="submit">Create Product</button>
      </form>
      {/* Display validation error or success message */}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
    </div>
  );
}

export default Create;