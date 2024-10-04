import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ViewSanitarios = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [sanitarios, setSanitarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation()

  useEffect(() => {
    const fetchSanitarios = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token); // Verifica il token nel client
        const res = await axios.get(`http://localhost:5000/api/instructors/${location?.state?.instructorId}/sanitarios`, {
          headers: {
            'x-auth-token': token
          }
        });
        setSanitarios(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response ? err.response.data.error : 'An error occurred');
        setLoading(false);
      }
    };

    fetchSanitarios();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista Sanitari</h1>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              {/* <th>Numero Brevetto</th> */}
              <th>Nome</th>
              <th>Cognome</th>
              <th>E-Mail</th>
              <th>Telefono</th>
              <th>Partita IVA</th>
              <th>Indirizzo</th>
            </tr>
          </thead>
          <tbody>
            {sanitarios.map((sanitarios) => (
              <tr key={sanitarios._id}>
                <td>{sanitarios.firstName}</td>
                <td>{sanitarios.lastName}</td>
                <td>{sanitarios.email}</td>
                <td>{sanitarios.phone}</td>
                <td>{sanitarios.fiscalCode}</td>
                <td>{sanitarios.address},{sanitarios.city},{sanitarios.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-secondary mt-4" onClick={() => navigate(decodedToken.user.role=='admin'?"/admin-dashboard":decodedToken.user.role=='center'?'/center-dashboard':'/instructor-dashboard')}>
        Indietro
      </button>
    </div>
  );
};

export default ViewSanitarios;

