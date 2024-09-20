// src/pages/AdminDashboard.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const goToCreateKit = () => {
    navigate('/create-kit');
  };

  const goToCreateSanitario = () => {
    navigate('/create-sanitario');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <h1 className="h4">Admin Dashboard</h1>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link to="/centers-list" className="nav-link btn btn-primary w-100 btn-lg">
                  Lista Centri
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/instructors-list" className="nav-link btn btn-primary w-100 btn-lg">
                  Lista Istruttori
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/unapproved-centers" className="nav-link btn btn-primary w-100 btn-lg">
                  Centri da Abilitare
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/unapproved-instructors" className="nav-link btn btn-primary w-100 btn-lg">
                  Istruttori da Abilitare
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/all-orders" className="nav-link btn btn-primary w-100 btn-lg">
                  All Orders
                </Link>
              </li>
              <li className="nav-item mb-2">
                <button className="nav-link btn btn-primary w-100 btn-lg" onClick={goToCreateKit}>
                  Crea Kit
                </button>
              </li>
              <li className="nav-item mb-2">
                <button className="nav-link btn btn-primary w-100 btn-lg" onClick={goToCreateSanitario}>
                  Crea Sanitario
                </button>
              </li>
              <li className="nav-item mb-2">
                <Link to="/sanitarios-list" className="nav-link btn btn-primary w-100 btn-lg">
                  Lista Sanitari
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
