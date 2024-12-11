import React from 'react';
import Strip from '../components/Stripe';
import { useLocation } from 'react-router-dom';

const Checkout = () => {
  const location = useLocation();
  console.log('location: ', location);

  // Extract data from location state
  const {
    productName,
    quantity,
    totalPrice,
    shippingCost = 10, // Default shipping cost
    productId,
    fromCart,
  } = location?.state || {};
  console.log('quantity: ', quantity);
  
  // Check if multiple products or a single product
  const isMultipleProducts = Array?.isArray(productName);

  // Calculate total price based on condition
  const totalQuantity = Array?.isArray(quantity)?quantity?.reduce((sum, item) => sum + item, 0):quantity
  const calculatedTotalPrice = isMultipleProducts
    ? totalPrice?.reduce((acc, price, index) => acc + price * (totalQuantity / totalPrice.length), 0) + shippingCost
    : Number(totalPrice) * Number(totalQuantity) + shippingCost;

  return (
    <div className="w-50 vh-100 mx-auto d-flex align-items-center justify-content-between">
      <div>
        <h4>Product Name:</h4>
        <p>
          <strong>
            {isMultipleProducts
              ? productName?.filter(Boolean).join(', ') || 'N/A'
              : productName || 'N/A'}
          </strong>
        </p>
        <h4>Product Quantity:</h4>
        <p>
          <strong>{Array?.isArray(quantity)?quantity?.map((i)=>i)?.join(",") || 0 : quantity}</strong>
        </p>
        <h4>Shipping Cost:</h4>
        <p>
          <strong>{shippingCost}</strong>
        </p>
        <h4>Item Price:</h4>
        <p>
          <strong>
            {isMultipleProducts
              ? totalPrice?.map((price) => price)?.join(', ')  || 0
              : Number(totalPrice) || 0}
          </strong>
        </p>
        <h4>Total Price:</h4>
        <p>
          <strong>{calculatedTotalPrice}</strong>
        </p>
      </div>
      <div>
        <Strip
          productId={productId}
          quantity={quantity}
          fromCart={fromCart}
        />
      </div>
    </div>
  );
};

export default Checkout;






// import React from 'react';
// import Strip from '../components/Stripe';
// import { useLocation } from 'react-router-dom';

// const Checkout = () => {
//   const location = useLocation();
//   console.log('location: ', location);
//   return (
//     <div className='w-50 vh-100 mx-auto d-flex align-items-center justify-content-between'>
//       <div className=''>
//         <h4>Product Name : </h4>
//         <p>
//           <strong>{location?.state?.productName}</strong>
//         </p>
//         <h4>Product Quantity : </h4>
//         <p>
//           <strong>{location?.state?.quantity}</strong>
//         </p>
//         <h4>Shipping Cost : </h4>
//         <p>
//           <strong>10</strong>
//         </p>
//         <h4>Item Price : </h4>
//         <p>
//           <strong>{Number(location?.state?.totalPrice)}</strong>
//         </p>
//         <h4>Total Price : </h4>
//         <p>
//           <strong>{Number(location?.state?.totalPrice)*Number(location?.state?.quantity)+10}</strong>
//         </p>
//       </div>
//       <div className=''>
//         <Strip
//           productId={location?.state?.productId}
//           quantity={location?.state?.quantity}
//         />
//       </div>
//     </div>
//   );
// };

// export default Checkout;

