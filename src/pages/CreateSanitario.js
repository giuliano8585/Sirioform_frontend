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
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear specific error
  };

  const validateForm = () => {
    const newErrors = {};

    // Field validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = 'This field is required';
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone number validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    // Fiscal code validation (example format: alphanumeric, 16 characters)
    if (formData.fiscalCode && !/^[A-Za-z0-9]{16}$/.test(formData.fiscalCode)) {
      newErrors.fiscalCode = 'Fiscal Code must be 16 alphanumeric characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await axios.post(
        'http://172.232.209.245/api/sanitarios/create',
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
      navigate('/admin-dashboard');
    } catch (err) {
      setMessage('Errore nella creazione del sanitario.');
      console.error('Error response:', err.response?.data);
    }
  };

  const goBack = () => {
    navigate('/admin-dashboard');
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Create Sanitario</h2>
      {message && (
        <div
          className={`alert ${
            message.includes('successo') ? 'alert-success' : 'alert-danger'
          }`}
          role='alert'
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {[
          { label: 'First Name', name: 'firstName', type: 'text' },
          { label: 'Last Name', name: 'lastName', type: 'text' },
          { label: 'Fiscal Code', name: 'fiscalCode', type: 'text' },
          { label: 'Address', name: 'address', type: 'text' },
          { label: 'City', name: 'city', type: 'text' },
          { label: 'Email', name: 'email', type: 'email' },
          { label: 'Phone', name: 'phone', type: 'text' },
        ].map(({ label, name, type }) => (
          <div className='mb-3' key={name}>
            <label htmlFor={name} className='form-label'>
              {label}
            </label>
            <input
              type={type}
              className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
              id={name}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              placeholder={label}
            />
            {errors[name] && (
              <div className='invalid-feedback'>{errors[name]}</div>
            )}
          </div>
        ))}

        <div className='mb-3'>
          <label htmlFor='region' className='form-label'>
            Region
          </label>
          <select
            className={`form-select ${errors.region ? 'is-invalid' : ''}`}
            id='region'
            name='region'
            value={formData.region}
            onChange={handleChange}
          >
            <option value=''>Select</option>
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
          {errors.region && (
            <div className='invalid-feedback'>{errors.region}</div>
          )}
        </div>

        <button type='submit' className='btn btn-primary'>
          Create Sanitario
        </button>
        <button
          type='button'
          className='btn btn-secondary ms-3'
          onClick={goBack}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default CreateSanitario;
