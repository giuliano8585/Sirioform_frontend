import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/instructors/me', {
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

  const goToViewProfile = () => {
    navigate('/instructor/view-profile');
  };

  const goToViewSanitarios = () => {
    navigate('/instructor/view-sanitarios', {
      state: { instructorId: data?._id },
    });
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <nav className='col-md-2 d-none d-md-block bg-light sidebar'>
          <div className='sidebar-sticky'>
            <h5 className='sidebar-heading'>Instructor Dashboard</h5>
            <ul className='nav flex-column'>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  // onClick={() => alert(JSON.stringify(data, null, 2))}
                  onClick={goToViewProfile}
                >
                  Anagrafica
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={goToViewKits}
                >
                  Visualizza Kit
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={goToViewSanitarios}
                >
                  Visualizza Sanitari
                </button>
              </li>
              {/* Bottone per visualizzare gli ordini */}
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/orders')}
                >
                  I miei ordini
                </button>
              </li>

              {/* Bottone per creare un discente */}
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/create-discente')}
                >
                  Crea Discente
                </button>
              </li>

              {/* Bottone per visualizzare la lista dei discenti */}
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/lista-discenti')}
                >
                  Lista Discenti
                </button>
              </li>

              {/* Bottone per creare un corso */}
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/create-corso')}
                >
                  Crea Corso
                </button>
              </li>

              {/* Bottone per visualizzare il magazzino (i miei kit) */}
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/store')}
                >
                  I miei Kit
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-5 pb-2 mb-3 border-bottom'>
            <h1 className='h2'>Instructor Dashboard</h1>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InstructorDashboard;
