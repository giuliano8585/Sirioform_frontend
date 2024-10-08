import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/kits', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setProducts(res.data);

        const initialQuantities = {};
        res.data.forEach((product) => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    setQuantities({
      ...quantities,
      [productId]: value,
    });
  };

  const calculatePrice = (product, quantity) => {
    if (quantity <= 10) {
      return product.cost1;
    } else if (quantity <= 20) {
      return product.cost2;
    } else {
      return product.cost3;
    }
  };

  const handlePurchase = (productId, productName) => {
    const quantity = quantities[productId] || 1;
    navigate('/payment', {
      state: {
        productName: productName,
        productId: productId,
        quantity: quantity,
        totalPrice: calculatePrice(
          products.find((p) => p._id === productId),
          quantity
        ),
      },
    });
  };

  return (
    <div className='container mt-4'>
      <h2>Acquista Kit</h2>
      <div className='row'>
        {Array.isArray(products) && products.length > 0 ? (
          products?.filter((items)=>items?.isRefreshKit!==true).map((product) => (
            <div key={product._id} className='col-md-4 mb-4'>
              <div className='card h-100'>
                <div className='card-body d-flex flex-column'>
                  <img
                    src={`http://localhost:5000/${product?.profileImage}`}
                    alt=''
                  />
                  <h5 className='card-title'>{product.code}</h5>
                  <h5 className='card-title'>{product.type}</h5>
                  <p className='card-text'>{product.description}</p>
                  <p className='card-text'>
                    <strong>
                      €{calculatePrice(product, quantities[product._id] || 1)}
                    </strong>
                  </p>
                  <input
                    type='number'
                    min='1'
                    value={quantities[product._id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(
                        product._id,
                        parseInt(e.target.value)
                      )
                    }
                    className='form-control mb-3'
                  />
                  <button
                    onClick={() => handlePurchase(product?._id, product?.type)}
                    className='btn btn-primary mt-auto'
                  >
                    Acquista
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-muted'>Nessun prodotto disponibile.</p>
        )}
      </div>
      <button className='btn btn-secondary mt-4' onClick={() => navigate(-1)}>
        Torna alla Dashboard
      </button>
    </div>
  );
}

export default ProductsPage;
