import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const ViewInstructors = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedQualification, setSelectedQualification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  const handleShowModal = (order) => {
    setSelectedQualification(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedQualification(null);
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Inizio del fetchInstructors');
        const token = localStorage.getItem('token');
        console.log('Token recuperato:', token);

        console.log('Invio richiesta API...');
        const res = await axios.get(
          `http://localhost:5000/api/centers/${location?.state?.ceneterId}/instructors`,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );

        console.log('Risposta API completa:', res);
        console.log('Dati della risposta:', res.data);

        if (Array.isArray(res.data)) {
          setInstructors(res.data);
        } else {
          console.error(
            'La risposta non contiene un array di istruttori:',
            res.data
          );
          setError('Formato della risposta non valido');
        }
      } catch (err) {
        console.error('Errore completo:', err);
        console.error('Errore dettagliato:', err.response?.data || err.message);
        console.error('Stack trace:', err.stack);
        setError(
          `Errore nel recupero degli istruttori: ${
            err.response?.data?.msg || err.message
          }`
        );
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
      <div className='alert alert-danger' role='alert'>
        {error}
      </div>
    );
  }

  return (
    <div className='container mt-4'>
      <h1 className='mb-4'>Lista Istruttori</h1>
      {instructors.length === 0 ? (
        <p>Nessun istruttore trovato.</p>
      ) : (
        <>
          <div className='table-responsive'>
            <table className='table table-striped table-bordered'>
              <thead className='thead-dark'>
                <tr>
                  {/* <th>Numero Brevetto</th> */}
                  <th>Nome</th>
                  <th>Cognome</th>
                  <th>E-Mail</th>
                  <th>Telefono</th>
                  <th>Numero Brevetto</th>
                  <th>Codice Fiscale</th>
                  <th>Partita IVA</th>
                  <th>Indirizzo</th>
                  <th>Qualifiche Details</th>
                </tr>
              </thead>
              <tbody>
                {instructors.map((instructor) => (
                  <tr key={instructor._id}>
                    <td>{instructor.firstName}</td>
                    <td>{instructor.lastName}</td>
                    <td>{instructor.email}</td>
                    <td>{instructor.phone}</td>
                    <td>{instructor.brevetNumber}</td>
                    <td>{instructor.piva}</td>
                    <td>{instructor.fiscalCode}</td>
                    <td>
                      {instructor.address},{instructor.city},{instructor.region}
                    </td>
                    <td>
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={() =>
                          handleShowModal(instructor?.qualifications)
                        }
                      >
                        Dettagli
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <button
        className='btn btn-secondary mt-3'
        onClick={() => window.history.back()}
      >
        Indietro
      </button>
      {showModal && selectedQualification && (
        <div className='modal fade show d-block' tabIndex='-1' role='dialog'>
          <div
            className='modal-dialog modal-dialog-centered modal-lg'
            role='document'
          >
            <div className='modal-content'>
              <div className='modal-header d-flex justify-content-between'>
                <h5 className='modal-title'>Instructor Qualifications</h5>
                <button
                  type='button'
                  className='close'
                  onClick={handleCloseModal}
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {selectedQualification?.map((items, index) => (
                  <div className='d-flex col-12'>
                    <p className='col-6'>
                      <strong>Qualification Type:</strong> {items.name}
                    </p>
                    <p className='col-6'>
                      <strong>Expiration Date:</strong>
                      {items.expirationDate?.split('T')[0]}
                    </p>
                  </div>
                ))}
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={handleCloseModal}
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewInstructors;
