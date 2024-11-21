import React from 'react';
import Strip from '../components/Stripe';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  return (
    <div className='w-50 vh-100 mx-auto d-flex align-items-center justify-content-between'>
      <div className=''>
        <h4>Product Name : </h4>
        <p>
          <strong>{location?.state?.productName}</strong>
        </p>
        <h4>Product Quantity : </h4>
        <p>
          <strong>{location?.state?.quantity}</strong>
        </p>
        <h4>Shipping Cost : </h4>
        <p>
          <strong>10</strong>
        </p>
        <h4>Item Price : </h4>
        <p>
          <strong>{Number(location?.state?.totalPrice)}</strong>
        </p>
        <h4>Total Price : </h4>
        <p>
          <strong>{Number(location?.state?.totalPrice)*Number(location?.state?.quantity)+10}</strong>
        </p>
      </div>
      <div className=''>
        <Strip
          productId={location?.state?.productId}
          quantity={location?.state?.quantity}
        />
      </div>
    </div>
  );
};

export default Checkout;
