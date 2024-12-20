import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateInstructor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const instructorId = location?.state?.id;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fiscalCode: '',
    brevetNumber: '',
    qualifications: [{ name: '', expirationDate: '' }],
    piva: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    username: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch instructor data to populate the form
    const fetchInstructor = async () => {
      try {
        const res = await axios.get(
          `http://18.171.180.225/api/instructors/${instructorId}`
        );
        setFormData(res.data);
      } catch (err) {
        console.error(err);
        setMessage('Error fetching instructor details.');
      }
    };
    fetchInstructor();
  }, [instructorId]);

  const handleChange = (e, index, field) => {
    if (field === 'qualifications') {
      const newQualifications = [...formData.qualifications];
      newQualifications[index][e.target.name] = e.target.value;
      setFormData({ ...formData, qualifications: newQualifications });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleQualificationChange = (index, e) => {
    const newQualifications = [...formData.qualifications];
    newQualifications[index][e.target.name] = e.target.value;
    setFormData({ ...formData, qualifications: newQualifications });
  };

  const handleAddQualification = () => {
    setFormData({
      ...formData,
      qualifications: [
        ...formData.qualifications,
        { name: '', expirationDate: '' },
      ],
    });
  };

  const handleRemoveQualification = (index) => {
    const newQualifications = formData.qualifications.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, qualifications: newQualifications });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://18.171.180.225/api/instructors/update/${instructorId}`,
        formData
      );
      setMessage('Instructor updated successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Error updating instructor. Please try again.');
    }
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Update Instructor</h2>
      {message && <div className='alert alert-info'>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-md-6 mb-3'>
            <label htmlFor='firstName' className='form-label'>
              First Name (Read-Only)
            </label>
            <input
              type='text'
              className='form-control'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='lastName' className='form-label'>
              Last Name (Read-Only)
            </label>
            <input
              type='text'
              className='form-control'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='fiscalCode' className='form-label'>
              Fiscal Code (Read-Only)
            </label>
            <input
              type='text'
              className='form-control'
              id='fiscalCode'
              name='fiscalCode'
              value={formData.fiscalCode}
              onChange={handleChange}
              readOnly
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='brevetNumber' className='form-label'>
              Brevet Number (Read-Only)
            </label>
            <input
              type='text'
              className='form-control'
              id='brevetNumber'
              name='brevetNumber'
              value={formData.brevetNumber}
              onChange={handleChange}
              readOnly
            />
          </div>

          {/* Editable fields */}
          <div className='col-md-6 mb-3'>
            <label htmlFor='piva' className='form-label'>
              PIVA
            </label>
            <input
              type='text'
              className='form-control'
              id='piva'
              name='piva'
              value={formData.piva}
              onChange={handleChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='address' className='form-label'>
              address
            </label>
            <input
              type='text'
              className='form-control'
              id='address'
              name='address'
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='city' className='form-label'>
              city
            </label>
            <input
              type='text'
              className='form-control'
              id='city'
              name='city'
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='region' className='form-label'>
              region
            </label>
            <input
              type='text'
              className='form-control'
              id='region'
              name='region'
              value={formData.region}
              onChange={handleChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='email' className='form-label'>
              email
            </label>
            <input
              type='text'
              className='form-control'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='phone' className='form-label'>
              phone
            </label>
            <input
              type='text'
              className='form-control'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary mt-4'>
            Update Instructor
          </button>
          <button
            type='buttom'
            className='btn btn-primary mt-4'
            onClick={() => navigate('/instructor/view-profile')}
          >
            Go Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInstructor;
