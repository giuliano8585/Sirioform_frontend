import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const AdminUpdateCenter = () => {
  //   const { centerId } = useParams();
  const location = useLocation();
  const centerId = location?.state?.centerId;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    piva: '',
    address: '',
    city: '',
    region: '',
    email: '',
    phone: '',
  });
  const [message, setMessage] = useState('');

  // Fetch the existing center data
  useEffect(() => {
    const fetchCenterData = async () => {
      try {
        const res = await axios.get(
          `http://18.171.180.225/api/centers/${centerId}`
        );
        setFormData(res.data); // Assuming the API returns an object with all the fields
      } catch (err) {
        console.error('Error fetching center data:', err);
        setMessage('Error fetching center data.');
      }
    };

    fetchCenterData();
  }, [centerId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `http://18.171.180.225/api/centers/${centerId}`,
        formData
      );
      console.log(res.data);
      setMessage('Center updated successfully.');
    } catch (err) {
      console.error('Error response:', err.response.data);
      setMessage('Error updating the center.');
    }
  };

  const handleCloseModal = () => {
    setMessage('');
    navigate('/admin-dashboard'); // Redirect after update
  };

  return (
    <div className='container mt-5'>
      <h2 className='mb-4'>Update Center</h2>
      {message && (
        <div className='modal modal-xl show d-block' tabIndex='-1'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Update Center</h5>
                <button
                  type='button'
                  className='close'
                  onClick={handleCloseModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <p className='text-center'>{message}</p>
                <div className='d-flex align-items-center justify-content-center gap-4'>
                  <button
                    onClick={handleCloseModal}
                    className='btn btn-primary btn-sm'
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='name' className='form-label'>
            Name
          </label>
          <input
            type='text'
            className='form-control'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            placeholder='Name'
            required
          />
        </div>
        <div className='mb-3'>
          <label htmlFor='piva' className='form-label'>
            P. IVA
          </label>
          <input
            type='text'
            className='form-control'
            id='piva'
            name='piva'
            value={formData.piva}
            onChange={handleChange}
            placeholder='P. IVA'
            required
          />
        </div>
        <div className='mb-3'>
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
        <div className='mb-3'>
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
        <div className='mb-3'>
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
        <div className='mb-3'>
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
        <div className='mb-3'>
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
        <button type='submit' className='btn btn-primary mt-3'>
          Update
        </button>
      </form>
      <button
        type='button'
        onClick={() => navigate('/centers-list')}
        className='btn btn-info mt-3'
      >
        Back
      </button>
    </div>
  );
};

export default AdminUpdateCenter;
