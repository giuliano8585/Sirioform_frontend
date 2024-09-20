import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ViewInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation()

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Inizio del fetchInstructors');
        const token = localStorage.getItem('token');
        console.log('Token recuperato:', token);
        
        console.log('Invio richiesta API...');
        const res = await axios.get(`http://localhost:5000/api/centers/${location?.state?.ceneterId}/instructors`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        console.log('Risposta API completa:', res);
        console.log('Dati della risposta:', res.data);
        
        if (Array.isArray(res.data)) {
          setInstructors(res.data);
        } else {
          console.error('La risposta non contiene un array di istruttori:', res.data);
          setError('Formato della risposta non valido');
        }
      } catch (err) {
        console.error('Errore completo:', err);
        console.error('Errore dettagliato:', err.response?.data || err.message);
        console.error('Stack trace:', err.stack);
        setError(`Errore nel recupero degli istruttori: ${err.response?.data?.msg || err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  if (loading) {
    return <div>Caricamento in corso...</div>;
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Lista Istruttori</h1>
      {instructors.length === 0 ? (
        <p>Nessun istruttore trovato.</p>
      ) : (
        <>
        {/* <ul className="list-group">
          {instructors.map((instructor) => (
            <li key={instructor._id} className="list-group-item">
              <h5>{instructor.firstName} {instructor.lastName}</h5>
              <p><strong>Email:</strong> {instructor.email}</p>
              <p><strong>Telefono:</strong> {instructor.phone}</p>
              <p><strong>Qualifiche:</strong> {instructor.qualifications}</p>
              <p><strong>Numero Brevetto:</strong> {instructor.brevetNumber}</p>
              <p><strong>Codice Fiscale:</strong> {instructor.fiscalCode}</p>
              <p><strong>Partita IVA:</strong> {instructor.piva}</p>
              <p><strong>Indirizzo:</strong> {instructor.address}, {instructor.city}, {instructor.region}</p>
            </li>
          ))}
        </ul> */}
        <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              {/* <th>Numero Brevetto</th> */}
              <th>Nome</th>
              <th>Cognome</th>
              <th>E-Mail</th>
              <th>Telefono</th>
              <th>Qualifiche</th>
              <th>Numero Brevetto</th>
              <th>Codice Fiscale</th>
              <th>Partita IVA</th>
              <th>Indirizzo</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>{instructor.firstName}</td>
                <td>{instructor.lastName}</td>
                <td>{instructor.email}</td>
                <td>{instructor.phone}</td>
                <td>{instructor.qualifications}</td>
                <td>{instructor.brevetNumber}</td>
                <td>{instructor.piva}</td>
                <td>{instructor.fiscalCode}</td>
                <td>{instructor.address},{instructor.city},{instructor.region}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          </>
      )}
      <button className="btn btn-secondary mt-3" onClick={() => window.history.back()}>Indietro</button>
    </div>
  );
};

export default ViewInstructors;