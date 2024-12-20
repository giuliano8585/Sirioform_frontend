import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CheckoutForm = ({ productId, quantity, onOrderSuccess, fromCart }) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

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
    } else if (
      result.paymentIntent &&
      result.paymentIntent.status === 'succeeded'
    ) {
      setMessage('Payment successful!');
      handlePurchase(productId, quantity, fromCart);
    } else {
      setMessage(`Payment status: ${result.paymentIntent.status}`);
    }

    setIsProcessing(false);
  };

  const handlePurchase = async (productId, quantity, fromCart) => {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    try {
      const res = await axios.post(
        'http://18.171.180.225/api/orders',
        {
          productIds: Array.isArray(productId) ? productId : [productId],
          quantities: Array.isArray(quantity) ? quantity : [quantity],
          fromCart,
        },
        {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        }
      );
      alert('Order placed successfully!');
      onOrderSuccess(res.data);
      navigate(
        decodedToken.user.role == 'admin'
          ? '/admin-dashboard'
          : decodedToken.user.role == 'center'
          ? '/center-dashboard'
          : '/instructor-dashboard'
      );
      setShowApproveConfirmModal(false);
    } catch (err) {
      console.log('err: ', err);
      alert('Error placing the order');
    }
  };

  return (
    <form>
      <PaymentElement />
      <button
        disabled={!stripe || isProcessing}
        className='btn btn-primary w-100 my-2'
        type='button'
        onClick={() => setShowApproveConfirmModal(true)}
      >
        {isProcessing ? 'Processing...' : 'Submit Payment'}
      </button>
      {message && <div>{message}</div>}
      {showApproveConfirmModal && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Confirm</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setShowApproveConfirmModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='table-responsive'>
                  <p className='text-center'>are you sure want to Buy</p>
                  <div className='d-flex align-items-center justify-content-center gap-4'>
                    <button
                      onClick={() => setShowApproveConfirmModal(false)}
                      className='btn btn-info btn-sm'
                    >
                      No
                    </button>
                    <button
                      onClick={handleSubmit}
                      className='btn btn-primary btn-sm'
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default CheckoutForm;
