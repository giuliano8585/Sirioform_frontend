import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListaSanitari.css'; // Assicurati di creare e importare questo file CSS

const ListaSanitari = () => {
  const [sanitarios, setSanitarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSanitarios = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/sanitarios');
        setSanitarios(res.data);
      } catch (err) {
        console.error('Errore nel recupero dei sanitari', err);
      }
    };

    fetchSanitarios();
  }, []);

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Lista Sanitari</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Codice Fiscale</th>
            <th>Indirizzo</th>
            <th>Città</th>
            <th>Regione</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Azione</th>
          </tr>
        </thead>
        <tbody>
          {sanitarios.map(sanitario => (
            <tr key={sanitario._id}>
              <td>{sanitario.firstName}</td>
              <td>{sanitario.lastName}</td>
              <td>{sanitario.fiscalCode}</td>
              <td>{sanitario.address}</td>
              <td>{sanitario.city}</td>
              <td>{sanitario.region}</td>
              <td>{sanitario.email}</td>
              <td>{sanitario.phone}</td>
              <td>
                <button className="btn btn-danger btn-sm">Elimina</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-secondary mt-4" onClick={goBack}>Indietro</button>
    </div>
  );
};

export default ListaSanitari;


