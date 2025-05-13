import { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import '../../css/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatRupiah = (number) => {
    if (!number) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  const unformatRupiah = (value) => {
    return parseInt(value.replace(/[^\d]/g, '')) || 0;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const addProduct = async () => {
    try {
      const { name, price, description, image } = newProduct;

      if (!name || !price || !description || !image) {
        alert("Please fill all required fields and upload an image.");
        return;
      }

      const imageBase64 = await convertToBase64(image);
      const cleanPrice = unformatRupiah(price);

      await addDoc(collection(db, 'items'), {
        name: name.trim(),
        price: cleanPrice,
        description: description.trim(),
        image: imageBase64,
        category: 'Hoodie'
      });

      setNewProduct({ name: '', price: '', description: '', image: null });
      setShowAddForm(false);
      fetchProducts();
    } catch (err) {
      alert('Failed to add product: ' + err.message);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err.message);
    }
  };

  const startEditing = (product) => {
    setEditingProduct({ ...product, price: formatRupiah(product.price), imageFile: null });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const saveEdit = async () => {
    try {
      const { id, name, price, description, imageFile } = editingProduct;
      let updateData = {
        name: name.trim(),
        price: unformatRupiah(price),
        description: description.trim()
      };

      if (imageFile) {
        const imageBase64 = await convertToBase64(imageFile);
        updateData.image = imageBase64;
      }

      await updateDoc(doc(db, 'items', id), updateData);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Failed to save product changes: ' + err.message);
    }
  };

  return (
    <div className="dashboard-card">
      <h2 className="text-xl font-bold mb-4">Product Management</h2>

      <button className="btn-add mb-4" onClick={() => setShowAddForm(true)}>Add Product</button>

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <h2>Add New Product</h2>

            <label>Product Name*</label>
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />

            <label>Price*</label>
            <input
              type="text"
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
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />

            <label>Image*</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
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
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Image</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>

                <td>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="inline-input"
                    />
                  ) : product.name}
                </td>

                <td>
                  {editingProduct?.id === product.id ? (
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
                  ) : formatRupiah(product.price)}
                </td>

                <td>
                  {editingProduct?.id === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                      className="inline-input"
                    />
                  ) : (
                    <>
                      {product.description.length > 20 && !expandedDescriptions[product.id]
                        ? product.description.slice(0, 20) + "..."
                        : product.description}
                      {product.description.length > 20 && (
                        <button
                          className="see-more-btn"
                          onClick={() =>
                            setExpandedDescriptions((prev) => ({
                              ...prev,
                              [product.id]: !prev[product.id],
                            }))
                          }
                        >
                          {expandedDescriptions[product.id] ? " See Less" : " See More"}
                        </button>
                      )}
                    </>
                  )}
                </td>  

                <td>
                  {editingProduct?.id === product.id ? (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, imageFile: e.target.files[0] })
                        }
                      />
                      {editingProduct.image && (
                        <img
                          src={editingProduct.image}
                          alt="Preview"
                          style={{ width: 60, height: 60, objectFit: 'cover', marginTop: '0.5rem' }}
                        />
                      )}
                    </>
                  ) : product.image ? (
                    <img src={product.image} alt="Product" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                  ) : 'No image'}
                </td>

                <td>
                  <input type="text" value="Hoodie" disabled className="inline-input" />
                </td>

                <td>
                  {editingProduct?.id === product.id ? (
                    <>
                      <button className="btn-submit" onClick={saveEdit}>Save</button>
                      <button className="btn-cancel" onClick={cancelEditing}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="btn-edit" onClick={() => startEditing(product)}>Edit</button>
                      <button className="btn-delete" onClick={() => deleteProduct(product.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7">No products found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
