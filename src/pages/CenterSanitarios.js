import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const CenterSanitarios = () => {
  const [sanitarios, setSanitarios] = useState([]);
  const navigate = useNavigate();
  const location = useLocation()
  console.log('location: ', location);


  useEffect(() => {
    const fetchSanitarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/centers/${location?.state?.ceneterId}/sanitarios`, {
          headers: {
            'x-auth-token': token
          }
        });
        setSanitarios(res.data);
      } catch (err) {
        console.error('Errore nel recupero dei sanitari associati', err);
      }
    };

    fetchSanitarios();
  }, []);

  const goBack = () => {
    navigate('/center-dashboard');
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Sanitari Associati</h1>
      <ul className="list-group">
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
      </ul>
      <button className="btn btn-secondary mt-4" onClick={goBack}>Indietro</button>
    </div>
  );
};

export default CenterSanitarios;
