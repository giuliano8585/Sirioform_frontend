import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState();
  console.log('quantities: ', quantities);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://18.171.180.225/api/kits', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setProducts(res.data);

        const initialQuantities = {};
        res.data.forEach((product) => {
          initialQuantities[product._id] = 6;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, value) => {
    const newValue = Math.max(6, Math.ceil(value / 6) * 6);
    setQuantities({
      ...quantities,
      [productId]: newValue,
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
    const quantity = quantities[productId] || 6;
    navigate('/payment', {
      state: {
        productName: productName,
        productId: productId,
        quantity: quantity,
        totalPrice: calculatePrice(
          products.find((p) => p._id === productId),
          quantity
        ),
        fromCart: false,
      },
    });
  };

  const handleAddToCart = async (itemId, type) => {
    const quantity = quantities[itemId] || 6;
    console.log('quantity handle add: ', quantity);
    try {
      const res = await axios.post(
        'http://18.171.180.225/api/cart/',
        { itemId, quantity },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      console.log('Item added to cart:', res.data);
      Swal.fire(`${type} added to the cart`, '', 'success');
    } catch (err) {
      console.log('err: ', err);
    }
  };

  return (
    <div className='container mt-4'>
      <h2>Acquista Kit</h2>
      <div className='row'>
        {Array.isArray(products) && products.length > 0 ? (
          products
            ?.filter(
              (items) =>
                items?.isRefreshKit !== true && items?.isForInstructor !== true
            )
            .map((product) => (
              <div key={product._id} className='col-md-4 mb-4'>
                <div className='card h-100'>
                  <div className='card-body d-flex flex-column'>
                    <img
                      src={`http://18.171.180.225/${product?.profileImage}`}
                      alt=''
                    />
                    <h5 className='card-title'>{product.code}</h5>
                    <h5 className='card-title'>{product.type}</h5>
                    <p className='card-text'>{product.description}</p>
                    <p className='card-text'>
                      <strong>
                        €{calculatePrice(product, quantities[product._id] || 6)}
                      </strong>
                    </p>
                    <input
                      type='number'
                      min='6'
                      step='6'
                      value={quantities[product._id] || 6}
                      onChange={(e) =>
                        handleQuantityChange(
                          product._id,
                          parseInt(e.target.value)
                        )
                      }
                      className='form-control mb-3'
                    />
                    <button
                      onClick={() =>
                        handleAddToCart(product?._id, product?.type)
                      }
                      className='btn btn-info mt-auto mb-2'
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() =>
                        handlePurchase(product?._id, product?.type)
                      }
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
