import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SiriformDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://18.171.180.225/api/auth/centers/me',
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.error || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goToViewKits = () => {
    navigate('/view-kits');
  };
  const goToViewRefreshKits = () => {
    navigate('/view-refresh-kits');
  };

  const goToSanitarios = () => {
    navigate('/center-sanitarios', { state: { ceneterId: data?._id } });
  };

  const goToInstructors = () => {
    navigate('/center/view-instructors', { state: { ceneterId: data?._id } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <nav className='col-md-2 d-none d-md-block bg-light sidebar'>
          <div className='sidebar-sticky'>
            <h5 className='sidebar-heading'>Siriform</h5>
            <ul className='nav flex-column'>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  // onClick={() => alert(JSON.stringify(data, null, 2))}
                  onClick={() =>
                    navigate('/center/view-profile', {
                      state: { isCenter: true },
                    })
                  }
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
                  onClick={goToViewRefreshKits}
                >
                  Visualizza refresh Kit
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/admin/view-instructor-kits')}
                >
                  Visualizza Instructor Kit
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() =>
                    navigate('/admin/view-instructor-refresh-kits')
                  }
                >
                  Visualizza Instructor refresh Kit
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={goToSanitarios}
                >
                  Visualizza Sanitari Associati
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={goToInstructors}
                >
                  Visualizza Istruttori Associati
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
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/create-referesh-corso')}
                >
                  Creat Refresh Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/create-instructor-corso')}
                >
                  Creat Instructor Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/create-instructor-referesh-corso')}
                >
                  Creat Instructor Refresh Corso
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

              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/corso')}
                >
                  Lista Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/refresh-corso')}
                >
                  Lista Refresh Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/instructor-corso')}
                >
                  Lista instructor Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/instructor-refresh-corso')}
                >
                  Lista Instructor Refresh Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/unactive-corso')}
                >
                  Unactive Lista Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/unactive-refresh-corso')}
                >
                  Unactive Lista Refresh Corso
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/finish-corso')}
                >
                  Finish Course
                </button>
              </li>
              <li className='nav-item mb-2'>
                <button
                  className='btn btn-primary w-100'
                  onClick={() => navigate('/complete-corso')}
                >
                  complete Course
                </button>
              </li>
            </ul>
          </div>
        </nav>
        <main role='main' className='col-md-9 ml-sm-auto col-lg-10 px-4'>
          <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom'>
            <h1 className='h2'>Siriform</h1>
          </div>
          <div>{/* Add content here */}</div>
        </main>
      </div>
    </div>
  );
};

export default SiriformDashboard;
