import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartData, setCartData] = useState();
  const [render, setRender] = useState(false);
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
  }, [render]);

  const handleProceedToPayment = () => {
    // const totalItems = cartData.reduce((sum, item) => sum + item.quantity, 0);
    const totalItems = cartData.map((item) => item.quantity);
    console.log('totalItems: ', totalItems);
    const totalPrice = cartData.map((item) => item.item.cost1);

    navigate('/payment', {
      state: {
        productName: cartData?.map((items) => items?.item?.type),
        productId: cartData?.map((items) => items?.item?._id),
        quantity: totalItems,
        totalPrice,
        shippingCost: 10,
        fromCart: true,
      },
    });
  };

  const handleRemove = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`, {
        headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
      });
      setCartData(cartData?.filter((a) => a?._id !== itemId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleAddToCart = async (itemId,quantity) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/cart/',
        { itemId, quantity },
        {
          headers: {
            'x-auth-token': localStorage.getItem('token'),
          },
        }
      );
      Swal.fire(`Add the Changes`, '', 'success');
      setRender(!render)
    } catch (err) {
      console.log('err: ', err);
    }
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
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cartData?.length > 0 ? (
            cartData?.map((corsoItem) => (
              <tr key={corsoItem._id}>
                <td>{corsoItem?.item?.type}</td>
                <td>{corsoItem?.item?.code}</td>
                <td>{corsoItem.item.isRefreshKit ? 'True' : 'False'}</td>
                <td><button disabled={corsoItem?.quantity <= 6} onClick={()=>handleAddToCart(corsoItem?.item?._id,-6)} className='btn btn-primary'>-</button> {corsoItem?.quantity} <button onClick={()=>handleAddToCart(corsoItem?.item?._id,6)} className='btn btn-primary'>+</button></td>
                <td>
                  <button onClick={() => handleRemove(corsoItem?._id)}>
                    <svg
                      width='24px'
                      height='24px'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
                      <g
                        id='SVGRepo_tracerCarrier'
                        stroke-linecap='round'
                        stroke-linejoin='round'
                      ></g>
                      <g id='SVGRepo_iconCarrier'>
                        {' '}
                        <path
                          d='M10 11V17'
                          stroke='#FF0000'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        ></path>{' '}
                        <path
                          d='M14 11V17'
                          stroke='#FF0000'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        ></path>{' '}
                        <path
                          d='M4 7H20'
                          stroke='#FF0000'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        ></path>{' '}
                        <path
                          d='M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z'
                          stroke='#FF0000'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        ></path>{' '}
                        <path
                          d='M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z'
                          stroke='#FF0000'
                          stroke-width='2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        ></path>{' '}
                      </g>
                    </svg>
                  </button>
                </td>
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
      <button
          className='btn btn-info mt-4'
          onClick={()=>navigate(-1)}
        >
          back
        </button>
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
