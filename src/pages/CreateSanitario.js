// src/pages/CreateSanitario.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const CreateSanitario = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fiscalCode: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://18.171.180.225/api/sanitarios/create',
        formData
      );
      setMessage('Sanitario creato con successo!');
      setFormData({
        firstName: '',
        lastName: '',
        fiscalCode: '',
        address: '',
        city: '',
        region: '',
        email: '',
        phone: '',
      });
      setShowApproveConfirmModal(false);
      navigate('/admin-dashboard');
    } catch (err) {
      setMessage('Errore nella creazione del sanitario.');
      console.error('Error response:', err.response.data);
    }
  };

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Inserisci Sanitario</h2>
      {message && <div className='alert alert-info'>{message}</div>}
      <form>
        <div className='mb-3'>
          <label htmlFor='firstName' className='form-label'>
            Nome
          </label>
          <input
            type='text'
            className='form-control'
            id='firstName'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            placeholder='Nome'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='lastName' className='form-label'>
            Cognome
          </label>
          <input
            type='text'
            className='form-control'
            id='lastName'
            name='lastName'
            value={formData.lastName}
            onChange={handleChange}
            placeholder='Cognome'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='fiscalCode' className='form-label'>
            Codice Fiscale
          </label>
          <input
            type='text'
            className='form-control'
            id='fiscalCode'
            name='fiscalCode'
            value={formData.fiscalCode}
            onChange={handleChange}
            placeholder='Codice Fiscale'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='address' className='form-label'>
            Indirizzo
          </label>
          <input
            type='text'
            className='form-control'
            id='address'
            name='address'
            value={formData.address}
            onChange={handleChange}
            placeholder='Indirizzo'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='city' className='form-label'>
            Città
          </label>
          <input
            type='text'
            className='form-control'
            id='city'
            name='city'
            value={formData.city}
            onChange={handleChange}
            placeholder='Città'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='region' className='form-label'>
            Regione
          </label>
          {/* <input
            type='text'
            className='form-control'
            id='region'
            name='region'
            value={formData.region}
            onChange={handleChange}
            placeholder='Regione'
            required
          /> */}
          <select
            className={`form-select`}
            id='region'
            name='region'
            value={formData.region}
            onChange={handleChange}
          >
            <option selected>Select</option>
            <option value='ABRUZZO'>ABRUZZO</option>
            <option value='BASILICATA'>BASILICATA</option>
            <option value='CALABRIA'>CALABRIA</option>
            <option value='CAMPANIA'>CAMPANIA</option>
            <option value='EMILIA-ROMAGNA'>EMILIA-ROMAGNA</option>
            <option value='FRIULI-VENEZIA GIULIA'>FRIULI-VENEZIA GIULIA</option>
            <option value='LAZIO'>LAZIO</option>
            <option value='LIGURIA'>LIGURIA</option>
            <option value='LOMBARDIA'>LOMBARDIA</option>
            <option value='MARCHE'>MARCHE</option>
            <option value='MOLISE'>MOLISE</option>
            <option value='PIEMONTE'>PIEMONTE</option>
            <option value='PUGLIA'>PUGLIA</option>
            <option value='SARDEGNA'>SARDEGNA</option>
            <option value='SICILIA'>SICILIA</option>
            <option value='TOSCANA'>TOSCANA</option>
            <option value='TRENTINO-ALTO ADIGE'>TRENTINO-ALTO ADIGE</option>
            <option value='UMBRIA'>UMBRIA</option>
            <option value="VALLE D'AOSTA">VALLE D'AOSTA</option>
            <option value='VENETO'>VENETO</option>
          </select>
        </div>
        <div className='mb-3'>
          <label htmlFor='email' className='form-label'>
            E-mail
          </label>
          <input
            type='email'
            className='form-control'
            id='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            placeholder='E-mail'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='phone' className='form-label'>
            Telefono
          </label>
          <input
            type='text'
            className='form-control'
            id='phone'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            placeholder='Telefono'
            required
          />
        </div>
        <button
          type='button'
          onClick={() => setShowApproveConfirmModal(true)}
          className='btn btn-primary'
        >
          Salva
        </button>
        <button
          type='button'
          className='btn btn-secondary ml-3'
          onClick={goBack}
        >
          Indietro
        </button>
      </form>
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
                    are you sure want to Approve center
                  </p>
                  <div className='d-flex align-items-center justify-content-center gap-4'>
                    <button
                      onClick={() => setShowApproveConfirmModal(false)}
                      className='btn btn-info btn-sm'
                    >
                      No
                    </button>
                    <button
                      onClick={handleSubmit}
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
    </div>
  );
};

export default CreateSanitario;
