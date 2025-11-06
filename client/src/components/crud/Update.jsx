import { useState } from 'react';

function Update() {
        const [formData, setFormData] = useState({
            id: '',
            title: '',
            price: '',
            description: '',
            category: '',
            image: ''
        });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input change
    const handleChange = (event) => {
        const { name, value } = event.target;
    
        // Step 3: Update the corresponding key in the state object
        setFormData((prevState) => ({
          ...prevState, // Keep the existing form data
          [name]: value, // Update the key corresponding to the input's name attribute
        }));
      };

    // Form validation
    const validateForm = () => {
        const {id, title, price,description,category,image} = formData;

        if (id.trim() === '' || title.trim() === '' || price.trim() === '' || description.trim() === '' || category.trim() === '' || image.trim() === '') {
            setSuccess('');
            setError('Post ID, title, price, description, category, and image are required');
            return false;
        }
        setError('');
        return true;
    };

    const updatePost = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return; // If validation fails, exit
        }

        try {
            const response = await fetch(`https://fakestoreapi.com/products/${formData.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: formData.title,
                    price: formData.price,
                    description: formData.description,
                    category: formData.category,
                    image: formData.image
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update product');
            }

            const updatedProduct = await response.json();
            setSuccess(
                <div>
                    <p>Product #{updatedProduct.id} Updated Successfully!</p>
                    New Title: {updatedProduct.title}<br/>
                    New Description: {updatedProduct.description}<br/>
                    New Price: {updatedProduct.price}<br/>
                    New Category: {updatedProduct.category}<br/>
                    New Image: {updatedProduct.image}<br/>
                </div>
            );
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
    };

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <h1 className="text-center">Update Product</h1>
                    <form onSubmit={updatePost}>
                        {/* ...existing code... */}
                        <div>
                            <label htmlFor="id">Product ID</label><br/>
                            <input
                                type="number"
                                id="id"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="title">Title:</label><br/>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="body">Description:</label><br/>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="body">Price:</label><br/>
                            <textarea
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="body">Category:</label><br/>
                            <textarea
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="body">Image:</label><br/>
                            <textarea
                                id="image"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                            />
                        </div>
                        <br/>
                        <button type="submit">Update Product</button>
                    </form>
                    {/* Display validation error or success message */}
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                </div>
            </div>
        );
}

export default Update;