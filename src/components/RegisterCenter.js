import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReCAPTCHA from 'react-google-recaptcha';

const RegisterCenter = () => {
  const [formData, setFormData] = useState({
    name: '',
    piva: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    repeatPassword: ''
  });
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/centers/register', {
        ...formData,
        recaptchaToken
      });
      console.log(res.data);
      setMessage('Registrazione avvenuta con successo! Controlla la tua email per conferma.');
    } catch (err) {
      console.error('Error response:', err.response.data);
      setMessage('Errore nella registrazione. Riprova.');
    }
  };

  const handleRecaptcha = (value) => {
    setRecaptchaToken(value);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Register Center</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
        </div>
        <div className="mb-3">
          <label htmlFor="piva" className="form-label">P. IVA</label>
          <input type="text" className="form-control" id="piva" name="piva" value={formData.piva} onChange={handleChange} placeholder="P. IVA" required />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
        </div>
        <div className="mb-3">
          <label htmlFor="region" className="form-label">Region</label>
          <input type="text" className="form-control" id="region" name="region" value={formData.region} onChange={handleChange} placeholder="Region" required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Username" required />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
        </div>
        <div className="mb-3">
          <label htmlFor="repeatPassword" className="form-label">Repeat Password</label>
          <input type="password" className="form-control" id="repeatPassword" name="repeatPassword" value={formData.repeatPassword} onChange={handleChange} placeholder="Repeat Password" required />
        </div>
        <ReCAPTCHA
          sitekey="6LfhQhcqAAAAAHPx5jGmeyWyQLJIwLZwmbIk9iHp"  // Sostituisci con la tua Site Key
          onChange={handleRecaptcha}
        />
        <button type="submit" className="btn btn-primary mt-3">Register</button>
      </form>
    </div>
  );
};

export default RegisterCenter;

