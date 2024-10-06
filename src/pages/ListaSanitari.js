import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListaSanitari.css'; // Assicurati di creare e importare questo file CSS

const ListaSanitari = () => {
  const [render, setRender] = useState(false);
  const [sanitarios, setSanitarios] = useState([]);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedSanitario, setSelectedSanitario] = useState(null);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

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
  }, [render]);

  const handleDeleteSanitario = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/sanitarios/${id}`
      );
      setRender(!render);
      setShowModal(false);
      setShowApproveConfirmModal(false)
    } catch (err) {
      console.error('Errore nel recupero dei sanitari', err);
    }
  };

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  const handleShowModal = (data) => {
    setShowModal(true);
    setSelectedSanitario(data);
  };
  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Lista Sanitari</h2>
      <table className='table table-bordered'>
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
          {sanitarios.map((sanitario) => (
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
                <button
                  onClick={() => setShowApproveConfirmModal(true)}
                  className='btn btn-danger btn-sm'
                >
                  Elimina
                </button>
              </td>
              {showApproveConfirmModal && (
                <div className='modal modal-xl show d-block' tabIndex='-1'>
                  <div className='modal-dialog'>
                    <div className='modal-content'>
                      <div className='modal-header'>
                        <h5 className='modal-title'>Confirm</h5>
                        <button
                          type='button'
                          className='close'
                          onClick={() => setShowApproveConfirmModal(false)}
                        >
                          <span>&times;</span>
                        </button>
                      </div>
                      <div className='modal-body'>
                        <div className='table-responsive'>
                          <p className='text-center'>
                            are you sure want to delete sanitari
                          </p>
                          <div className='d-flex align-items-center justify-content-center gap-4'>
                            <button
                              onClick={() => setShowApproveConfirmModal(false)}
                              className='btn btn-info btn-sm'
                            >
                              No
                            </button>
                            <button
                              onClick={() => handleShowModal(sanitario?._id)}
                              className='btn btn-primary btn-sm'
                            >
                              Yes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <button className='btn btn-secondary mt-4' onClick={goBack}>
        Indietro
      </button>
      {showModal && selectedSanitario && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Delete Sanitari</h5>
                <button
                  type='button'
                  className='close'
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <div className='table-responsive'>
                  <p className='text-center'>are you sure want to delete</p>
                  <div className='d-flex align-items-center justify-content-center gap-4'>
                    <button
                      onClick={() => setShowModal(false)}
                      className='btn btn-primary btn-sm'
                    >
                      No
                    </button>
                    <button
                      onClick={() => handleDeleteSanitario(selectedSanitario)}
                      className='btn btn-danger btn-sm'
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaSanitari;
