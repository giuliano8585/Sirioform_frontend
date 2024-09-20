import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ code: '', title: '', description: '', price1: 0, price2: 0, price3: 0 });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  const handleCreateProduct = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/products', newProduct, {
        headers: { 'x-auth-token': `${localStorage.getItem('token')}` }
      });
      setProducts([...products, res.data]);
      setNewProduct({ code: '', title: '', description: '', price1: 0, price2: 0, price3: 0 });
      alert('Product created successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to create product');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestisci Prodotti</h2>
      <div className="card p-4 mb-4">
        <h4 className="mb-3">Crea Nuovo Prodotto</h4>
        <div className="form-group">
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Codice"
            value={newProduct.code}
            onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Titolo"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Descrizione"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Prezzo 1"
            value={newProduct.price1}
            onChange={(e) => setNewProduct({ ...newProduct, price1: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Prezzo 2"
            value={newProduct.price2}
            onChange={(e) => setNewProduct({ ...newProduct, price2: e.target.value })}
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Prezzo 3"
            value={newProduct.price3}
            onChange={(e) => setNewProduct({ ...newProduct, price3: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleCreateProduct}>Crea Prodotto</button>
        </div>
      </div>

      <h3 className="mb-3">Prodotti Esistenti</h3>
      <ul className="list-group">
        {products.map(product => (
          <li key={product._id} className="list-group-item">
            <strong>{product.title}</strong> - {product.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductManagement;
