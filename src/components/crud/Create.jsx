// src/components/CreatePost.jsx
import { useState } from 'react';

function Create() {
  const [product,setProduct] =useState({
    title: '',
    price: '',
    category: '',
    image: '',
    body: ''
  });
   
// Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value
    }));
  };
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

// Handle input change
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };
  const handleBodyChange = (event) => {
    setBody(event.target.value);
  };
  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };
  const handleImageChange = (event) => {
    setImage(event.target.value);
  };

  // Form validation to trim whitespace and mandate a price that is a positive number
  const validateForm = () => {
    if (
      title.trim() === '' ||
      price.trim() === '' ||
      category.trim() === '' ||
      image.trim() === '' ||
      body.trim() === ''
    ) {
      setError('All fields are required');
      return false;
    }
    else if (isNaN(price) || Number(price) <= 0) {
      setError('Price must be a positive number');
      return false;
    }
    setError('');
    return true;
  };

// Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      return; // If validation fails, exit
    }

    try {
      const response = await fetch('https://fakestoreapi.com/products', {
        method: 'POST',
        body: JSON.stringify({
          id: 1,
          title: title,
          price:price,
          description: body,
          category: category,
          image: image
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();

      setTitle('');  // Reset title
      setBody('');   // Reset body
      setPrice('');  // Reset price
      setCategory(''); // Reset category
      setImage(''); // Reset image

      // Show success message with created post details
      setSuccess(
        <div>
            <p>New Product Created Successfully:</p>
            ID: {data.id}<br/>
            Title: {data.title}<br/>
            Description: {data.description}
            <br/>
            Category: {data.category}<br/>
            Image: {data.image}<br/>
            Price: {data.price}
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
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter title"
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label><br/>
          <input
            type="text"
						id="price"
            value={price}
            onChange={handlePriceChange}
            placeholder="Enter the price"
          />
        </div>
        <div>
          <label htmlFor="body">Description:</label><br/>
          <textarea
						id="body"
            value={body}
            onChange={handleBodyChange}
            placeholder="Enter Description"
          />
        </div>
        <div>
          <label htmlFor="category">Category:</label><br/>
          <textarea
						id="category"
            value={category}
            onChange={handleCategoryChange}
            placeholder="Enter Description"
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label><br/>
          <textarea
						id="image"
            value={image}
            onChange={handleImageChange}
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