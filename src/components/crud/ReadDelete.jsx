import { useState } from 'react';
function ReadDelete() {
    const [postId, setPostId] = useState('');
    const [post, setPost] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle input change
    const handlePostIdChange = (event) => {
        setPostId(event.target.value);
    };

    // Form validation
    const validateForm = () => {
        if (postId.trim() === '') {
            setError('Product ID is required');
            return false;
        }
        setError('');
        return true;
    };

    // Handle form submission
    const findPost = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${postId}`);
            if (!response.ok) {
                setPost('');
                throw new Error('Failed to find product');
            }
            const data = await response.json();
            setPost(data);
            setPostId(data.id);
        } catch (error) {
            setError(error.message);
        }
    };

    const deletePost = async () => {
        try {
            const response = await fetch(`https://fakestoreapi.com/products/${postId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete product');
            }
            setSuccess(`Product #${postId} deleted successfully`);
            setPost(null);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', width: '100%' }}>
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <h1 className="text-center">Find a Product</h1>
                    <form onSubmit={findPost}>
                        <div>
                            <label htmlFor="postId">Product ID:</label><br/>
                            <input
                                type="number"
                                id="postId"
                                value={postId}
                                onChange={handlePostIdChange}
                                placeholder="Enter product id"
                            />
                        </div><br/>
                        <button type="submit">Find Product</button>
                    </form>

                    {post && (
                        <div>
                            <p><b>Product Title</b></p>
                            <p>{post.title}</p>
                            <p><b>Price:</b> ${post.price}</p>
                            <p><b>Category:</b> {post.category}</p>
                            <p><b>Description:</b> {post.description}</p>
                            <img src={post.image} alt={post.title} style={{maxWidth: '180px', maxHeight: '180px'}} />
                            <br/>
                            <button onClick={deletePost}>Delete Product</button>
                        </div>
                    )}

                    {/* Display validation error or success message */}
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    {success && <div style={{ color: 'green' }}>{success}</div>}
                </div>
            </div>
    );
}

export default ReadDelete;