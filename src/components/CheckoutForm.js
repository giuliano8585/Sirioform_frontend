import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = ({ productId, quantity, onOrderSuccess }) => {
  const navigate = useNavigate()
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      // confirmParams: {
      //   return_url: "http://localhost:3000/dashboard",
      // },
    });

    if (result.error) {
      setMessage(result.error.message);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      setMessage('Payment successful!');
      handlePurchase(productId, quantity);
    } else {
      setMessage(`Payment status: ${result.paymentIntent.status}`);
    }

    setIsProcessing(false);
  };

  const handlePurchase = async (productId, quantity) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/orders',
        {
          productIds: [productId],
          quantities: [quantity],
        },
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      alert('Order placed successfully!')
      onOrderSuccess(res.data);
      navigate('/center-dashboard');
      //we can redirect to center dashbor, if I login with center role, instructor dashboard if I login with instructor
      // you can give route over here. what's root? when order is ok, and payment is ok we can redirect on home dashboard,yeah, just put the page name over here
      // it will redict after order and payment completion, payment and order is now ok
      //yes but currently we dont have any role becouse both are comming from diffrent schemas,
      // we will do that functionality when we do it to one schema (user). ok. can you start to work for that tomorrow?yaeh tomorrow we will do a meeting and discuss these things. ok thanks. 
      //tomorrow send me 30$ request also
      //no worries, thank you. thanks
      //my pleasure, Bye see. bye. good night, good night
    } catch (err) {
      alert("Error placing the order");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe || isProcessing} className='btn btn-primary w-100 my-2'>
        {isProcessing ? "Processing..." : "Submit Payment"}
      </button>
      {message && <div>{message}</div>}
    </form>
  );
};

export default CheckoutForm;
