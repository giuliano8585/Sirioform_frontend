import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/orders', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` }
        });
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container">
      <h2 className="my-4">Order Management</h2>
      <ul className="list-group">
        {orders.map(order => (
          <li key={order._id} className="list-group-item">
            <strong>Order #{order._id}</strong>
            <ul className="list-group mt-2">
              {order.orderItems.map(item => (
                <li key={item.productId} className="list-group-item">
                  Product ID: {item.productId} - Quantity: {item.quantity} - Price: €{item.price}
                  <ul className="list-group">
                    {item.progressiveNumbers.map((num, index) => (
                      <li key={index} className="list-group-item">Kit Number: {num}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <p className="mt-2">Total Price: €{order.totalPrice}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderManagement;
