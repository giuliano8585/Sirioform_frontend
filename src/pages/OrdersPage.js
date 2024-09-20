import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
      try {
        const res = await axios.get('http://localhost:5000/api/orders', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setOrders(res.data);
      } catch (err) {
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2>I miei ordini</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>#Order Id</th>
            <th>Product Name</th>
            <th>Product Quantity</th>
            <th>Order Date</th>
            <th>Total Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>{item.productId?.title}</span>
                  ))}
                </td>
                <td>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>{item.quantity}</span>
                  ))}
                </td>
                <td>{order?.createdAt?.split('T')[0]}</td>
                <td>{order.totalPrice}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleShowModal(order)}
                  >
                    Dettagli
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-muted">
                Nessun ordine trovato.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modale per i dettagli dell'ordine */}
      {showModal && selectedOrder && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-between">
                <h5 className="modal-title">Dettagli Ordine</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                <p><strong>Order Date:</strong> {selectedOrder.createdAt?.split('T')[0]}</p>
                <p><strong>Prodotti:</strong></p>
                <ul>
                  {selectedOrder.orderItems.map((item) => (
                    <li key={item._id}>
                      {item.productId?.title} - Quantità: {item.quantity} - Prezzo: {item.price}
                      <div>
                        <h6>Kit Number:</h6>
                        {item?.progressiveNumbers?.map(progressivenumbers=><p className='ps-2'>{progressivenumbers}</p>)}
                      </div>
                    </li>
                  ))}
                </ul>
                <p><strong>Prezzo Totale:</strong> {selectedOrder.totalPrice}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button className="btn btn-secondary mt-4" onClick={() => navigate('/dashboard')}>
        Torna alla Dashboard
      </button>
    </div>
  );
}

export default OrdersPage;
