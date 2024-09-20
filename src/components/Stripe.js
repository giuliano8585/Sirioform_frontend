import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import { useEffect, useState } from 'react';

const stripePromise = loadStripe(
  'pk_test_51Pv1mPP9Idf6ukG6NA9Rg7vu859L39i6ndnarIV33AI21xAyu2rkARBjBCkzbMuBN3h8F7gzf02muEJIvMN5JY7G00pyGjmQLX'
);

export default function Strip({ productId, quantity }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/payment/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': `${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        productIds: [productId],
        quantities: [quantity],
      }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [productId, quantity]);

  const options = {
    clientSecret,
  };

  const handleOrderSuccess = (orderData) => {
    // Handle successful order placement (e.g., update state, redirect, etc.)
    console.log('Order placed successfully:', orderData);
  };

  return (
    clientSecret && (
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm productId={productId} quantity={quantity} onOrderSuccess={handleOrderSuccess} />
      </Elements>
    )
  );
}


// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';
// import CheckoutForm from './CheckoutForm';

// // Make sure to call `loadStripe` outside of a component’s render to avoid
// // recreating the `Stripe` object on every render.
// const stripePromise = loadStripe('pk_test_51Pv1mPP9Idf6ukG6NA9Rg7vu859L39i6ndnarIV33AI21xAyu2rkARBjBCkzbMuBN3h8F7gzf02muEJIvMN5JY7G00pyGjmQLX');

// export default function Strip() {
//   const options = {
//     // passing the client secret obtained from the server
//     clientSecret: 'sk_test_51Pv1mPP9Idf6ukG6tRxbcf0Rgh5NbfnpP0MNzqX0g3gWcbylXAxlF6kTpH2HjfDy00UnbKrI6gK4o7T5XrR2e5vm00jhQjet1T',
//   };

//   return (
//     <Elements stripe={stripePromise} options={options}>
//       <CheckoutForm />
//     </Elements>
//   );
// };
