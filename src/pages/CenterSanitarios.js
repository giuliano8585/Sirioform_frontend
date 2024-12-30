import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CenterSanitarios = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const [sanitarios, setSanitarios] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  console.log('location: ', location);

  useEffect(() => {
    const fetchSanitarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `http://172.232.209.245/api/centers/${location?.state?.ceneterId}/sanitarios`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        setSanitarios(res.data);
      } catch (err) {
        console.error('Errore nel recupero dei sanitari associati', err);
      }
    };

    fetchSanitarios();
  }, []);

  const goBack = () => {
    navigate(
      decodedToken.user.role == 'admin'
        ? '/admin-dashboard'
        : decodedToken.user.role == 'center'
        ? '/center-dashboard'
        : '/instructor-dashboard'
    );
  };

  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>Sanitari Associati</h1>
      {/* <ul className="list-group">
        {sanitarios.map(sanitario => (
          <li key={sanitario._id} className="list-group-item">
            <p>Nome: {sanitario.firstName}</p>
            <p>Cognome: {sanitario.lastName}</p>
            <p>Codice Fiscale: {sanitario.fiscalCode}</p>
            <p>Indirizzo: {sanitario.address}</p>
            <p>Città: {sanitario.city}</p>
            <p>Regione: {sanitario.region}</p>
            <p>Email: {sanitario.email}</p>
            <p>Telefono: {sanitario.phone}</p>
          </li>
        ))}
      </ul> */}
      <div className='table-responsive'>
        <table className='table table-striped table-bordered'>
          <thead className='thead-dark'>
            <tr>
              {/* <th>Numero Brevetto</th> */}
              <th>Nome</th>
              <th>Cognome</th>
              <th>Codice Fiscale</th>
              <th>Indirizzo</th>
              <th>Città</th>
              <th>Regione</th>
              <th>Email</th>
              <th>Telefono</th>
            </tr>
          </thead>
          <tbody>
            {sanitarios?.map((instructor) => (
              <tr key={instructor._id}>
                <td>{instructor.firstName}</td>
                <td>{instructor.lastName}</td>
                <td>{instructor.fiscalCode}</td>
                <td>{instructor.address}</td>
                <td>{instructor.city}</td>
                <td>{instructor.region}</td>
                <td>{instructor.email}</td>
                <td>{instructor.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className='btn btn-secondary mt-4' onClick={goBack}>
        Indietro
      </button>
    </div>
  );
};

export default CenterSanitarios;
