import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(
          'http://localhost:5000/api/orders/admin/orders',
          {
            headers: { 'x-auth-token': `${token}` },
          }
        );
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4'>All Orders</h2>
      <div className='mb-4'>
        <Link to='/admin-dashboard' className='btn btn-secondary'>
          Back to Dashboard
        </Link>
      </div>
      <table class='table table-hover'>
        <thead>
          <tr>
            <th scope='col'>#Order Id</th>
            <th scope='col'>User Name</th>
            <th scope='col'>Product Name</th>
            <th scope='col'>Product Quantity</th>
            <th scope='col'>Order Date</th>
            <th scope='col'>Total Price</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            <>
              {/* <div className="list-group">
          {orders.map(order => (
            <div key={order._id} className="list-group-item mb-3">
              <h5>Order #{order._id}</h5>
              <p>Customer: {order.userId?.firstName || 'Unknown'} {order.userId?.lastName || 'Unknown'}</p>
              <ul className="list-group">
                {order.orderItems.map(item => (
                  <li key={item._id} className="list-group-item">
                    Product ID: {item.productId} - Quantity: {item.quantity} - 
                    Code: {item.code || 'N/A'} - Price: €{item.price}
                  </li>
                ))}
              </ul>
              <p className="mt-2"><strong>Total Price:</strong> €{order.totalPrice}</p>
            </div>
          ))}
        </div> */}
              {orders.map((order) => (
                <tr>
                  <>
                    <th scope='row'>{order._id}</th>
                    <td>
                      {order.userId?.firstName || 'Unknown'}{' '}
                      {order.userId?.lastName || 'Unknown'}
                    </td>
                    <td>
                      {order.orderItems.map((item) => (
                        <span key={item._id} className=''>
                          {item.productId?.title}
                        </span>
                      ))}
                    </td>
                    <td>
                      {order.orderItems.map((item) => (
                        <span key={item._id} className=''>
                          {item.quantity}
                        </span>
                      ))}
                    </td>
                    <td>
                      {order?.createdAt?.split('T')[0]}
                    </td>
                    <td>{order.totalPrice}</td>
                    <td>
                      {' '}
                      <button type='button' class='btn btn-primary' data-toggle="modal" data-target="#exampleModalCenter" onClick={() => handleShowModal(order)}>
                        Details
                      </button>
                    </td>
                  </>
                </tr>
              ))}
            </>
          ) : (
            <p className='text-muted'>No orders found.</p>
          )}
        </tbody>
      </table>
      {showModal && selectedOrder && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Order Details
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Order Date:</strong> {selectedOrder?.createdAt?.split('T')[0]}</p>
                <p><strong>Customer Name:</strong> {selectedOrder.userId?.firstName} {selectedOrder.userId?.lastName}</p>
                <p><strong>Products:</strong></p>
                <ul>
                  {selectedOrder.orderItems.map((item) => (
                    <>
                    <li key={item._id}>
                     Product Name :{item.productId?.title} - Quantity: {item.quantity} - Price :{item.price} 
                     {item?.progressiveNumbers && item?.progressiveNumbers?.map((item)=><p className='py-0' style={{padding:"0px"}}>progressive Numbers : <strong>{item}</strong></p>)}
                    </li>
                    </>
                  ))}
                </ul>
                <p><strong>Total Price:</strong> {selectedOrder.totalPrice}</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;

