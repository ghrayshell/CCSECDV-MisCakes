import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        productId: '',
        name: '',
        price: '',
        img: '',
        description: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        window.scrollTo(0, 0);
    }, []);

    const fetchProducts = () => {
        fetch('http://localhost:4000/GetAllProducts', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to get all products.');
                }
                return response.json();
            })
            .then((data) => setProducts(data))
            .catch((error) => console.error(error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const { productId, ...payload } = form;
        console.log('Payload:', payload);
        console.log('Product ID:', productId);
        const method = productId ? 'PUT' : 'POST';
        const endpoint = productId
            ? `http://localhost:4000/updateProduct/${productId}`
            : `http://localhost:4000/createProduct`;
            console.log('Form state:', form);
            console.log('Product ID:', productId);
            console.log('Endpoint:', endpoint);
        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include'
            });
    
            const result = await res.json();
    
            if (!res.ok) {
                console.error('Failed to save product:', result.error);
                alert(result.error || 'Something went wrong');
                return;
            }
    
            clearForm();
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product) => {
        //const confirmEdit = window.confirm('Are you sure you want to edit this product?');
        //if (!confirmEdit) return;
    
        setForm({
            productId: product._id,
            name: product.name,
            price: product.price,
            description: product.description
        });

    };

    const handleLogout = async () => {
        try {
            const res = await fetch('http://localhost:4000/logout', {
                method: 'GET',
                credentials: 'include',
            });

            if (res.ok) {
                navigate('/'); // redirect to login page or home
            } else {
                const error = await res.json();
                alert(error.message || 'Logout failed');
            }
        } catch (err) {
            console.error('Logout error:', err);
            alert('Error during logout');
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this product?');
        if (!confirmDelete) return;
    
        try {
            const res = await fetch(`http://localhost:4000/deleteProduct/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
    
            if (!res.ok) {
                const err = await res.json();
                console.error('Failed to delete:', err.message);
                alert(err.message || 'Delete failed');
                return;
            }
    
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Something went wrong while deleting the product.');
        }
    };

    const clearForm = () => {
        setForm({
            productId: '',
            name: '',
            price: '',
            description: ''
        });
    };
    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '40px'
    };

    const thStyle = {
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'left',
        backgroundColor: '#f4f4f4'
    };

    const tdStyle = {
        border: '1px solid #ccc',
        padding: '10px'
    };

    // Inline styles
const buttonStyle = {
    padding: '6px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#fff',
    fontWeight: 'bold',
};

const createButton = {
    ...buttonStyle,
    backgroundColor: '#4CAF50'
};

const updateButton = {
    ...buttonStyle,
    backgroundColor: '#4CAF50'
};

const cancelButton = {
    ...buttonStyle,
    backgroundColor: '#9E9E9E'
};

const editButton = {
    ...buttonStyle,
    backgroundColor: '#2196F3'
};

const deleteButton = {
    ...buttonStyle,
    backgroundColor: '#F44336'
};


    return (
        <main style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px' }}>
                {form.productId ? 'Update Product' : 'Create Product'}
            </h2>

            <button
                onClick={handleLogout}
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Logout
            </button>

            {/* Form as table */}
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Description</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={tdStyle}>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Product name" />
                        </td>
                        <td style={tdStyle}>
                            <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
                        </td>
                        <td style={tdStyle}>
                            <input name="description" value={form.description} onChange={handleChange} placeholder="Description" style={{ width: '100%' }} />
                        </td>
                        <td style={tdStyle}>
                        <button
                            style={form.productId ? updateButton : createButton}
                            onClick={handleSubmit}
                        >
                            {form.productId ? 'Update' : 'Create'}
                        </button>
                        {form.productId && (
                            <button
                                onClick={clearForm}
                                style={{ ...cancelButton, marginLeft: '10px' }}
                            >
                                Cancel
                            </button>
                        )}
                    </td>
                    </tr>
                </tbody>
            </table>

            {/* Products list */}
            <h3>All Products</h3>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Description</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id}>
                            <td style={tdStyle}>{product.name}</td>
                            <td style={tdStyle}>{product.price}</td>
                            <td style={tdStyle}>{product.description}</td>
                            <td style={tdStyle}>
                                <button
                                    onClick={() => handleEdit(product)}
                                    style={editButton}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    style={{ ...deleteButton, marginLeft: '10px' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </main>
    );
};


export default ProductManager;
