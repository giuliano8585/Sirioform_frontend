import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminOrders() {
  const token = localStorage.getItem('token');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [kits, setKits] = useState([]);

    const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
  });

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
        const res = await axios.get(
          'http://localhost:5000/api/orders/admin/orders',
          {
            headers: { 'x-auth-token': `${token}` },
          }
        );
        setOrders(res.data);
        setFilteredOrders(res.data);
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchKits = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/kits',{headers:{'x-auth-token': `${token}`}});
        setKits(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchKits();
  }, []);

  const handleSort = (orderType) => {
    setSortOrder(orderType);
    let sortedOrders = [...filteredOrders];

    if (orderType === 'date-asc') {
      sortedOrders.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );
    } else if (orderType === 'date-desc') {
      sortedOrders.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (orderType === 'type-asc') {
      sortedOrders.sort((a, b) =>
        a.orderItems[0]?.productId?.type.localeCompare(
          b.orderItems[0]?.productId?.type
        )
      );
    } else if (orderType === 'type-desc') {
      sortedOrders.sort((a, b) =>
        b.orderItems[0]?.productId?.type.localeCompare(
          a.orderItems[0]?.productId?.type
        )
      );
    }

    setFilteredOrders(sortedOrders);
  };

  const handleFilterType = (type) => {
    setFilterType(type);
    if (type) {
      const filtered = orders.filter((order) =>
        order.orderItems.some((item) => item.productId?.type === type)
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders);
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = orders.filter((order) => {
      const fullName = `${order.userId?.firstName || ''} ${order.userId?.lastName || ''}`.toLowerCase();
      const centerName = order.userId?.name?.toLowerCase() || '';
      const searchValue = e.target.value.toLowerCase();

      return fullName.includes(searchValue) || centerName.includes(searchValue);
    });
    setFilteredOrders(filtered);
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    let filtered = [...orders];
    if (filters.startDate) {
      filtered = filtered.filter(
        (c) =>
          new Date(c?.createdAt?.split('T')[0]) >=
          new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (c) =>
          new Date(c.createdAt?.split('T')[0]) <=
          new Date(filters.endDate)
      );
    }
    setFilteredOrders(filtered);
  }, [filters, orders]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className='container mt-5'>
      <h2 className='text-center mb-4'>All Orders</h2>
      <div className='mb-4 d-flex align-items-center justify-content-between'>
        <Link to='/admin-dashboard' className='btn btn-secondary'>
          Back to Dashboard
        </Link>
        <div className='filters'>
          <div className='d-flex'>
          <input
            type='date'
            name='startDate'
            value={filters.startDate}
            onChange={handleFilterChange}
            placeholder='Start Date'
          />
          <input
            type='date'
            name='endDate'
            value={filters.endDate}
            onChange={handleFilterChange}
            placeholder='End Date'
          />
          <input
              type='text'
              className='form-control me-2'
              placeholder='Search by User Name'
              value={searchTerm}
              onChange={handleSearch} // Attach search handler
            />
            <select
              className='form-control me-2'
              value={sortOrder}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value=''>Sort by</option>
              <option value='date-asc'>Date Ascending</option>
              <option value='date-desc'>Date Descending</option>
              <option value='type-asc'>Type Ascending</option>
              <option value='type-desc'>Type Descending</option>
            </select>
            <select
              className='form-control'
              value={filterType}
              onChange={(e) => handleFilterType(e.target.value)}
            >
              <option value=''>Filter by Type</option>
              {[...new Set(kits.map((kit) => kit?.type))].map(
                (uniqueType, index) => (
                  <option key={index} value={uniqueType}>
                    {uniqueType}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </div>
      <table className='table table-hover'>
        <thead>
          <tr>
            <th scope='col'>#Order Id</th>
            <th scope='col'>User Name</th>
            <th scope='col'>Product Name</th>
            <th scope='col'>Product Type</th>
            <th scope='col'>total Quantity</th>
            <th scope='col'>remaining Quantity</th>
            <th scope='col'>Order Date</th>
            <th scope='col'>Total Price</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order._id}>
                <th scope='row'>{order._id}</th>
                <td>
                  {order?.userId?.role === 'center'
                    ? order.userId?.name
                    : `${order.userId?.firstName} ${order.userId?.lastName}`}
                </td>
                <td>
                  {order.orderItems.map((item) => (
                    <span key={item._id}>{item.productId?.code}</span>
                  ))}
                </td>
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
                <td>{order.totalPrice}</td>
                <td>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => handleShowModal(order)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <p className='text-muted'>No orders found.</p>
          )}
        </tbody>
      </table>
      {showModal && selectedOrder && (
        <div
          className='modal fade show d-block'
          tabIndex='-1'
          role='dialog'
          aria-labelledby='exampleModalCenterTitle'
          aria-hidden='true'
        >
          <div
            className='modal-dialog modal-dialog-centered modal-lg'
            role='document'
          >
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between'>
                <h5 className='modal-title' id='exampleModalLongTitle'>
                  Order Details
                </h5>
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
                  {selectedOrder?.createdAt?.split('T')[0]}
                </p>
                <p>
                  <strong>Customer Name:</strong>{' '}
                  {selectedOrder.userId?.firstName}{' '}
                  {selectedOrder.userId?.lastName}
                </p>
                <p>
                  <strong>Products:</strong>
                </p>
                <ul>
                  {selectedOrder.orderItems.map((item) => (
                    <>
                      <li key={item._id}>
                        Product Name :{item.productId?.title} - Quantity:{' '}
                        {item.quantity} - Price :{item.price}
                        {item?.progressiveNumbers &&
                          item?.progressiveNumbers?.map((item) => (
                            <p className='py-0' style={{ padding: '0px' }}>
                              progressive Numbers : <strong>{item}</strong>
                            </p>
                          ))}
                      </li>
                    </>
                  ))}
                </ul>
                <p>
                  <strong>Total Price:</strong> {selectedOrder.totalPrice}
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
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
