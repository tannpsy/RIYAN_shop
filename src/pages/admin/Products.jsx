import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { v4 as uuidv4 } from 'uuid'; // Ensure this package is installed
import '../../css/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: ''});
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const addProduct = async () => {
        try {
            if (!newProduct.name || !newProduct.price) {
            alert("Please fill all required fields.");
            return;
            }

            const { error } = await supabase.from('products').insert([{
            uid: uuidv4(),
            name: newProduct.name.trim(),
            price: newProduct.price.trim(),
            }]);

            if (error) throw error;

            setNewProduct({ name: '', price: '' });
            setShowAddForm(false);
            fetchProducts();
        } catch (err) {
            alert('Failed to add product: ' + err.message);
        }
    };


  const deleteProduct = async (uid) => {
    try {
      const { error } = await supabase.from('products').delete().eq('uid', uid);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err.message);
    }
  };

  const updateProduct = async (uid, key, value) => {
        try {
            let updateData = {};

            if (key === 'category') {
            updateData[key] = [value.trim()];
            } else {
            updateData[key] = value;
            }

            const { error } = await supabase.from('products').update(updateData).eq('uid', uid);
            if (error) throw error;

            fetchProducts();
        } catch (err) {
            alert(`Failed to update ${key}: ${err.message}`);
        }
    };


  return (
    <div className="dashboard-card">
      <h2 className="text-xl font-bold mb-4">Product Management</h2>

      <button className="btn-add mb-4" onClick={() => setShowAddForm(true)}>
        Add Product
      </button>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h2>Add New Product</h2>

            <label>Product Name*</label>
            <input
              type="text"
              placeholder="Enter name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />

            <label>Price*</label>
            <input
              type="text"
              placeholder="Enter price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />


            <div className="modal-buttons">
              <button onClick={addProduct} className="btn-submit">Submit</button>
              <button onClick={() => setShowAddForm(false)} className="btn-cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <table className="users-table mt-6">
        <thead>
          <tr>
            <th>UID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.uid}>
                <td>{product.uid}</td>
                <td>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(product.uid, 'name', e.target.value)}
                    className="inline-input"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={product.price}
                    onChange={(e) => updateProduct(product.uid, 'price', e.target.value)}
                    className="inline-input"
                  />
                </td>

                <td>
                  <button className="btn-delete" onClick={() => deleteProduct(product.uid)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="5">No products found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
