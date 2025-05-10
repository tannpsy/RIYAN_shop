import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import '../../css/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // store product being edited

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatRupiah = (value) => {
    const number = value.replace(/[^,\d]/g, '').toString();
    const split = number.split(',');
    let rupiah = split[0].length % 3;
    let formatted = split[0].substr(0, rupiah);
    const thousands = split[0].substr(rupiah).match(/\d{3}/gi);

    if (thousands) {
      const separator = rupiah ? '.' : '';
      formatted += separator + thousands.join('.');
    }

    formatted = split[1] !== undefined ? formatted + ',' + split[1] : formatted;
    return 'Rp' + formatted;
  };

  const unformatRupiah = (value) => {
    return value.replace(/[^0-9]/g, '');
  };


  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('items').select('*');
      if (error) throw error;
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const addProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.description) {
        alert("Please fill all required fields.");
        return;
      }

      const { error } = await supabase.from('items').insert([
        {
          name: newProduct.name.trim(),
          price: newProduct.price.trim(),
          description: newProduct.description.trim(),
        }
      ]);

      if (error) throw error;

      setNewProduct({ name: '', price: '', description: '' });
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  const deleteProduct = async (uid) => {
    try {
      const { error } = await supabase.from('items').delete().eq('uid', uid);
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err.message);
    }
  };

  const startEditing = (product) => {
    setEditingProduct({ ...product }); // create a copy to edit
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const saveEdit = async () => {
    try {
      const { uid, name, price, description } = editingProduct;
      const { error } = await supabase.from('items')
        .update({ name, price, description })
        .eq('uid', uid);
      if (error) throw error;

      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product changes: ' + err.message);
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
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: formatRupiah(unformatRupiah(e.target.value))
                })
              }
            />


            <label>Description*</label>
            <textarea
              placeholder="Enter description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />

            <label>Category</label>
            <input type="text" value="Hoodie" disabled />

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
            <th>Description</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.uid}>
                <td>{product.uid}</td>

                <td>
                  {editingProduct?.uid === product.uid ? (
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                      className="inline-input"
                    />
                  ) : (
                    product.name
                  )}
                </td>

                <td>
                  {editingProduct?.uid === product.uid ? (
                    <input
                      type="text"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          price: formatRupiah(unformatRupiah(e.target.value))
                        })
                      }
                      className="inline-input"
                    />

                  ) : (
                    product.price
                  )}
                </td>

                <td>
                  {editingProduct?.uid === product.uid ? (
                    <input
                      type="text"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="inline-input"
                    />
                  ) : (
                    product.description
                  )}
                </td>

                <td>
                  <input type="text" value="Hoodie" disabled className="inline-input" />
                </td>

                <td>
                  {editingProduct?.uid === product.uid ? (
                    <>
                      <button className="btn-submit" onClick={saveEdit}>Save</button>
                      <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => startEditing(product)}>
                        Edit
                      </button>
                      <button className="btn-delete" onClick={() => deleteProduct(product.uid)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="6">No products found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
