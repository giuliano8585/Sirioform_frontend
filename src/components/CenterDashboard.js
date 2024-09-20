import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CenterDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/centers/me', {
          headers: {
            'x-auth-token': token
          }
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.error || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const goToViewKits = () => {
    navigate('/view-kits');
  };

  const goToSanitarios = () => {
    navigate('/center-sanitarios');
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-2 d-none d-md-block bg-light sidebar">
          <div className="sidebar-sticky">
            <h5 className="sidebar-heading">Center Dashboard</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <button className="btn btn-primary w-100" onClick={() => alert(JSON.stringify(data, null, 2))}>
                  Anagrafica
                </button>
              </li>
              <li className="nav-item mb-2">
                <button className="btn btn-primary w-100" onClick={goToViewKits}>
                  Visualizza Kit
                </button>
              </li>
              <li className="nav-item mb-2">
                <button className="btn btn-primary w-100" onClick={goToSanitarios}>
                  Visualizza Sanitari Associati
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Center Dashboard</h1>
          </div>
          <div>
            {/* Add content here */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CenterDashboard;
