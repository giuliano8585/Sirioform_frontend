import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState();
  useEffect(() => {
    const handleAddToCart = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/cart/', {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        });
        setCartData(res?.data?.items);
      } catch (err) {
        console.log('err: ', err);
      }
    };
    handleAddToCart();
  }, []);

  const handleProceedToPayment = () => {
    // const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const totalItems = cartData.map((item) =>item.quantity);
    console.log('totalItems: ', totalItems);
    const totalPrice = cartData.map((item) => item.item.cost1);

    navigate('/payment', {
      state: {
        productName: cartData?.map((items) => items?.item?.type),
        productId: cartData?.map((items) => items?.item?._id),
        quantity: totalItems,
        totalPrice,
        shippingCost: 10,
      },
    });
  };

  return (
    <div className='container'>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th>type</th>
            <th>code</th>
            <th>isRefreshKit</th>
            <th>quantity</th>
          </tr>
        </thead>
        <tbody>
          {cartData?.length > 0 ? (
            cartData?.map((corsoItem) => (
              <tr key={corsoItem._id}>
                <td>{corsoItem?.item?.type}</td>
                <td>{corsoItem?.item?.code}</td>
                <td>{corsoItem.item.isRefreshKit ? 'True' : 'False'}</td>
                <td>{corsoItem.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='8' className='text-muted'>
                Nessun corso trovato.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {cartData?.length > 0 && (
        <button
          className='btn btn-primary mt-4'
          onClick={handleProceedToPayment}
        >
          Proceed to Payment
        </button>
      )}
    </div>
  );
};

export default CartPage;
