import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateCenter = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const centerId = location.state?.id
  const [formData, setFormData] = useState({
    piva: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
    username: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the current center data by centerId
    const fetchCenterData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/centers/${centerId}`);
        setFormData({
          piva: res.data.piva,
          address: res.data.address,
          city: res.data.city,
          region: res.data.region,
          email: res.data.email,
          phone: res.data.phone,
          username: res.data.username
        });
      } catch (err) {
        console.error('Error fetching center data:', err.response.data);
      }
    };

    fetchCenterData();
  }, [centerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(`http://localhost:5000/api/centers/update/${centerId}`, formData);
      console.log(res.data);
      setMessage('Aggiornamento avvenuto con successo.');
    } catch (err) {
      console.error('Error updating center:', err.response.data);
      setMessage('Errore nell\'aggiornamento. Riprova.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Update Center</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="piva" className="form-label">P. IVA</label>
          <input type="text" className="form-control" id="piva" name="piva" value={formData.piva} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input type="text" className="form-control" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="region" className="form-label">Region</label>
          <input type="text" className="form-control" id="region" name="region" value={formData.region} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input type="text" className="form-control" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} required disabled />
        </div>
        <button type="submit" className="btn btn-primary mt-3">Update</button>
        <button type='buttom' className='btn btn-primary mt-4' onClick={()=>navigate('/center/view-profile')}>
            Go Back
          </button>
      </form>
    </div>
  );
};

export default UpdateCenter;
