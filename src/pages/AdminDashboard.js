import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Admin Dashboard</h2>
      <div className="list-group mb-4">
        <Link to="/admin/products" className="btn btn-primary w-25">
          Manage Products
        </Link>
        <Link to="/admin/create-product" className="btn btn-primary w-25">
          Create New Product
        </Link>
        <Link to="/admin/orders" className="btn btn-primary w-25">
          Manage Orders
        </Link>
        <Link to="/admin/all-orders" className="btn btn-primary w-25">
          View All Orders
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
