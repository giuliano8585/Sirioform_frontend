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
    phone: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/sanitarios/create', formData);
      setMessage('Sanitario creato con successo!');
      setFormData({
        firstName: '',
        lastName: '',
        fiscalCode: '',
        address: '',
        city: '',
        region: '',
        email: '',
        phone: ''
      });
    } catch (err) {
      setMessage('Errore nella creazione del sanitario.');
      console.error('Error response:', err.response.data);
    }
  };

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Inserisci Sanitario</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">Nome</label>
          <input type="text" className="form-control" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Nome" required />
        </div>
        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">Cognome</label>
          <input type="text" className="form-control" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Cognome" required />
        </div>
        <div className="mb-3">
          <label htmlFor="fiscalCode" className="form-label">Codice Fiscale</label>
          <input type="text" className="form-control" id="fiscalCode" name="fiscalCode" value={formData.fiscalCode} onChange={handleChange} placeholder="Codice Fiscale" required />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Indirizzo</label>
          <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Indirizzo" required />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">Città</label>
          <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Città" required />
        </div>
        <div className="mb-3">
          <label htmlFor="region" className="form-label">Regione</label>
          <input type="text" className="form-control" id="region" name="region" value={formData.region} onChange={handleChange} placeholder="Regione" required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">E-mail</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="E-mail" required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Telefono</label>
          <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Telefono" required />
        </div>
        <button type="submit" className="btn btn-primary">Salva</button>
        <button type="button" className="btn btn-secondary ml-3" onClick={goBack}>Indietro</button>
      </form>
    </div>
  );
};

export default CreateSanitario;
