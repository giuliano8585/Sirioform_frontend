import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [kits, setKits] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({
    type: '',
    sortBy: 'date',
    order: 'asc',
    startDate: '',
    endDate: '',
  });

  const navigate = useNavigate();

  const handleShowModal = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://18.171.180.225/api/orders', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setOrders(res.data);
        setFilteredOrders(res.data); // Initialize with full data
      } catch (err) {
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let sortedOrders = [...orders];

    // Filter by type if provided
    if (filter.type) {
      sortedOrders = sortedOrders.filter((order) =>
        order.orderItems.some((item) => item.productId?.type === filter.type)
      );
    }

    // Sort by date or totalPrice
    if (filter.sortBy === 'date') {
      sortedOrders.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt) * (filter.order === 'asc' ? 1 : -1)
      );
    } else if (filter.sortBy === 'price') {
      sortedOrders.sort(
        (a, b) =>
          (a.totalPrice - b.totalPrice) * (filter.order === 'asc' ? 1 : -1)
      );
    }

    setFilteredOrders(sortedOrders);
  }, [filter, orders]);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const res = await axios.get('http://18.171.180.225/api/kits', {
          headers: { 'x-auth-token': `${localStorage.getItem('token')}` },
        });
        setKits(res.data);
      } catch (err) {
        console.error(err);
        alert('Errore nel recupero dei kit.');
      }
    };

    fetchKits();
  }, []);

  useEffect(() => {
    let filtered = [...orders];
    if (filter.startDate) {
      filtered = filtered.filter(
        (c) =>
          new Date(c?.createdAt?.split('T')[0]) >= new Date(filter.startDate)
      );
    }
    if (filter.endDate) {
      filtered = filtered.filter(
        (c) => new Date(c.createdAt?.split('T')[0]) <= new Date(filter.endDate)
      );
    }
    setFilteredOrders(filtered);
  }, [filter, orders]);

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getTime = (time) => {
    const date = new Date(time);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours} : ${minutes}`;
  };

  return (
    <div className='container mt-4'>
      <div className='d-flex align-items-center justify-content-between'>
        <h2>I miei ordini</h2>
        <div>
          <input
            type='date'
            name='startDate'
            value={filter.startDate}
            onChange={handleFilterChange}
            placeholder='Start Date'
          />
          <input
            type='date'
            name='endDate'
            value={filter.endDate}
            onChange={handleFilterChange}
            placeholder='End Date'
          />
          <select name='type' value={filter.type} onChange={handleFilterChange}>
            <option value=''>All Types</option>
            {[...new Set(kits.map((kit) => kit?.type))].map(
              (uniqueType, index) => (
                <option key={index} value={uniqueType}>
                  {uniqueType}
                </option>
              )
            )}
          </select>
          <select
            name='sortBy'
            value={filter.sortBy}
            onChange={handleFilterChange}
          >
            <option value='date'>Order Date</option>
            <option value='price'>Total Price</option>
          </select>
          <select
            name='order'
            value={filter.order}
            onChange={handleFilterChange}
          >
            <option value='asc'>Ascending</option>
            <option value='desc'>Descending</option>
          </select>
        </div>
      </div>

      <table className='table table-hover'>
        <thead>
          <tr>
            <th>#Order Id</th>
            <th>Product Name</th>
            <th>total Quantity</th>
            <th>remaining Quantity</th>
            <th>Order Date</th>
            <th>Order Time</th>
            <th>Total Price</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>{item.productId?.type}</span>
                  ))}
                </td>
                <td>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>{item.totalQuantity}</span>
                  ))}
                </td>
                <td>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>{item.quantity}</span>
                  ))}
                </td>
                <td>{formatDate(order?.createdAt?.split('T')[0])}</td>
                <td>{getTime(order?.createdAt)}</td>
                <td>{order.totalPrice}</td>
                <td>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => handleShowModal(order)}
                  >
                    Dettagli
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='6' className='text-muted'>
                Nessun ordine trovato.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && selectedOrder && (
        <div className='modal fade show d-block' tabIndex='-1' role='dialog'>
          <div
            className='modal-dialog modal-dialog-centered modal-lg'
            role='document'
          >
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between'>
                <h5 className='modal-title'>Dettagli Ordine</h5>
                <button
                  type='button'
                  className='close'
                  onClick={handleCloseModal}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p>
                  <strong>Order ID:</strong> {selectedOrder._id}
                </p>
                <p>
                  <strong>Order Date:</strong>{' '}
                  {selectedOrder.createdAt?.split('T')[0]}
                </p>
                <p>
                  <strong>Prodotti:</strong>
                </p>
                <ul>
                  {selectedOrder.orderItems.map((item) => (
                    <li key={item._id}>
                      {item.productId?.title} - Quantità: {item.totalQuantity} -
                      Prezzo: {item.price}
                      <div>
                        <h6>Kit Number:</h6>
                        {item?.progressiveNumbers?.map((progressivenumbers) => (
                          <p className='ps-2'>{progressivenumbers}</p>
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
                <p>
                  <strong>Prezzo Totale:</strong> {selectedOrder.totalPrice}
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={handleCloseModal}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button className='btn btn-secondary mt-4' onClick={() => navigate(-1)}>
        Torna alla Dashboard
      </button>
    </div>
  );
}

export default OrdersPage;
