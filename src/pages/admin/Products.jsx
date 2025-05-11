import { useState, useEffect } from 'react';
import { db, storage } from '../../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';
import '../../css/Products.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: null });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

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

  const unformatRupiah = (value) => value.replace(/[^0-9]/g, '');

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'items'));
      const productsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setProducts(productsData);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const storageRef = ref(storage, `product-images/${fileName}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.image) {
        alert("Please fill all required fields and upload an image.");
        return;
      }

      const imageUrl = await uploadImage(newProduct.image);

      await addDoc(collection(db, 'items'), {
        name: newProduct.name.trim(),
        price: newProduct.price.trim(),
        description: newProduct.description.trim(),
        image: imageUrl,
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
    setEditingProduct({ ...product });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const saveEdit = async () => {
    try {
      const { id, name, price, description } = editingProduct;
      await updateDoc(doc(db, 'items', id), {
        name,
        price,
        description
      });
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
                  ) : product.price}
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
                  ) : product.description}
                </td>

                <td>
                  {product.image ? (
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
