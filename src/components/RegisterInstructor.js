import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReCAPTCHA from 'react-google-recaptcha';

const RegisterInstructor = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fiscalCode: '',
    brevetNumber: '',
    qualifications: [{ name: '', expirationDate: '' }], // Updated to include an array of qualifications
    piva: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    repeatPassword: '',
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

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
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/instructors/register',
        {
          ...formData,
          recaptchaToken,
        }
      );
      console.log(res.data);
      setMessage(
        'Registrazione avvenuta con successo! Controlla la tua email per conferma.'
      );
    } catch (err) {
      console.error(err.response.data);
      setMessage('Errore nella registrazione. Riprova.');
    }
  };

  const handleRecaptcha = (value) => {
    setRecaptchaToken(value);
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Register Instructor</h2>
      {message && <div className='alert alert-info'>{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-md-6 mb-3'>
            <label htmlFor='firstName' className='form-label'>
              First Name
            </label>
            <input
              type='text'
              className='form-control'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={handleChange}
              placeholder='First Name'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='lastName' className='form-label'>
              Last Name
            </label>
            <input
              type='text'
              className='form-control'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={handleChange}
              placeholder='Last Name'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='fiscalCode' className='form-label'>
              Fiscal Code
            </label>
            <input
              type='text'
              className='form-control'
              id='fiscalCode'
              name='fiscalCode'
              value={formData.fiscalCode}
              onChange={handleChange}
              placeholder='Fiscal Code'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='brevetNumber' className='form-label'>
              Brevet Number
            </label>
            <input
              type='text'
              className='form-control'
              id='brevetNumber'
              name='brevetNumber'
              value={formData.brevetNumber}
              onChange={handleChange}
              placeholder='Brevet Number'
              required
            />
          </div>

          {/* Qualification Fields */}
          {formData.qualifications.map((qualification, index) => (
            <>
              <div key={index} className='col-md-12 mb-3'>
                <div className='row'>
                  <div className='col-md-5'>
                    <label
                      htmlFor={`qualification-name-${index}`}
                      className='form-label'
                    >
                      Qualification
                    </label>
                    <select
                      class='form-select'
                      aria-label='Default select example'
                      id={`qualification-name-${index}`}
                      name='name'
                      value={qualification.name}
                      onChange={(e) => handleQualificationChange(index, e)}
                      placeholder='Qualification'
                    >
                      <option selected>Select Qualification</option>
                      <option value='blsk'>BLSK</option>
                      <option value='bls'>BLS</option>
                      <option value='blsd'>BLSD</option>
                    </select>
                    {/* <input
                      type='text'
                      className='form-control'
                      id={`qualification-name-${index}`}
                      name='name'
                      value={qualification.name}
                      onChange={(e) => handleQualificationChange(index, e)}
                      placeholder='Qualification'
                      required
                    /> */}
                  </div>
                  <div className='col-md-5'>
                    <label
                      htmlFor={`expirationDate-${index}`}
                      className='form-label'
                    >
                      Expiration Date
                    </label>
                    <input
                      type='date'
                      className='form-control'
                      id={`expirationDate-${index}`}
                      name='expirationDate'
                      value={qualification.expirationDate}
                      onChange={(e) => handleQualificationChange(index, e)}
                      required
                    />
                  </div>
                  <div className='col-md-2 d-flex align-items-end'>
                    <button
                      type='button'
                      className='btn btn-danger'
                      onClick={() => handleRemoveQualification(index)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </>
          ))}

          <div className='col-md-12 mb-3 text-end'>
            <button
              type='button'
              className='btn btn-secondary'
              onClick={handleAddQualification}
            >
              Add Qualification
            </button>
          </div>

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
              placeholder='PIVA'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='address' className='form-label'>
              Address
            </label>
            <input
              type='text'
              className='form-control'
              id='address'
              name='address'
              value={formData.address}
              onChange={handleChange}
              placeholder='Address'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='city' className='form-label'>
              City
            </label>
            <input
              type='text'
              className='form-control'
              id='city'
              name='city'
              value={formData.city}
              onChange={handleChange}
              placeholder='City'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='region' className='form-label'>
              Region
            </label>
            <input
              type='text'
              className='form-control'
              id='region'
              name='region'
              value={formData.region}
              onChange={handleChange}
              placeholder='Region'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='email' className='form-label'>
              Email
            </label>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Email'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='phone' className='form-label'>
              Phone
            </label>
            <input
              type='text'
              className='form-control'
              id='phone'
              name='phone'
              value={formData.phone}
              onChange={handleChange}
              placeholder='Phone'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='username' className='form-label'>
              Username
            </label>
            <input
              type='text'
              className='form-control'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Username'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='password' className='form-label'>
              Password
            </label>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              required
            />
          </div>
          <div className='col-md-6 mb-3'>
            <label htmlFor='repeatPassword' className='form-label'>
              Repeat Password
            </label>
            <input
              type='password'
              className='form-control'
              id='repeatPassword'
              name='repeatPassword'
              value={formData.repeatPassword}
              onChange={handleChange}
              placeholder='Repeat Password'
              required
            />
          </div>
        </div>
        <ReCAPTCHA
          sitekey='6LfhQhcqAAAAAHPx5jGmeyWyQLJIwLZwmbIk9iHp'
          onChange={handleRecaptcha}
        />
        <button type='submit' className='btn btn-primary mt-4'>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterInstructor;
