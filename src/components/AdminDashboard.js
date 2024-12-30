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
                <Link to="/centers-list" className=" btn btn-primary w-100 btn-lg">
                  Lista Centri
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/instructors-list" className=" btn btn-primary w-100 btn-lg">
                  Lista Istruttori
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/unapproved-centers" className=" btn btn-primary w-100 btn-lg">
                  Centri da Abilitare
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/unapproved-instructors" className=" btn btn-primary w-100 btn-lg">
                  Istruttori da Abilitare
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/all-orders" className=" btn btn-primary w-100 btn-lg">
                  All Orders
                </Link>
              </li>
              <li className="nav-item mb-2">
                <button className=" btn btn-primary w-100 btn-lg" onClick={goToCreateKit}>
                  Crea Kit
                </button>
              </li>
              <li className="nav-item mb-2">
                <Link to="/create-instructor-kit" className=" btn btn-primary w-100 btn-lg">
                  Create Instructor kit
                </Link>
              </li>
              <li className="nav-item mb-2">
                <button className=" btn btn-primary w-100 btn-lg" onClick={goToCreateSanitario}>
                  Crea Sanitario
                </button>
              </li>
              <li className="nav-item mb-2">
                <Link to="/sanitarios-list" className=" btn btn-primary w-100 btn-lg">
                  Lista Sanitari
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/all-corso" className=" btn btn-primary w-100 btn-lg">
                  Lista corso
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/unactive-corso" className=" btn btn-primary w-100 btn-lg">
                  Un Active Lista corso
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/all-refresh-corso" className=" btn btn-primary w-100 btn-lg">
                  Lista Refresh corso
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/unactive-refresh-corso" className=" btn btn-primary w-100 btn-lg">
                  Un Active Lista Refresh corso
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/view-kits" className=" btn btn-primary w-100 btn-lg">
                  Lista Kits
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/view-refresh-kits" className=" btn btn-primary w-100 btn-lg">
                  Lista Refresh Kits
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/view-instructor-kits" className=" btn btn-primary w-100 btn-lg">
                  Lista Instrcutor Kits
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/view-instructor-refresh-kits" className=" btn btn-primary w-100 btn-lg">
                  Lista Instrcutor Refresh Kits
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/view-descente" className=" btn btn-primary w-100 btn-lg">
                  Lista Descente
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/end-corso" className=" btn btn-primary w-100 btn-lg">
                  Finished Courses
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/complete-corso" className=" btn btn-primary w-100 btn-lg">
                  Complete Courses
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/communication" className=" btn btn-primary w-100 btn-lg">
                  Communication
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link to="/admin/document" className=" btn btn-primary w-100 btn-lg">
                  Document
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
