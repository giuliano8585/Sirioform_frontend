import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; // Percorso corretto per il file CSS
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'center',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Imposta lo stato di caricamento
    try {
      const res = await axios.post(
        'http://172.232.209.245/api/auth/login',
        formData
      );
      localStorage.setItem('token', res.data.token);
      setLoading(false);
      const decodedToken = jwtDecode(res.data.token);
      if (decodedToken.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (decodedToken.user.role === 'instructor') {
        navigate('/instructor-dashboard');
      } else {
        navigate('/center-dashboard');
      }
    } catch (err) {
      setLoading(false); // Rimuove lo stato di caricamento in caso di errore
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className='container'>
      <h2 className='my-4'>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label className='form-label'>Username</label>
          <input
            type='text'
            className='form-control'
            name='username'
            value={formData.username}
            onChange={handleChange}
            placeholder='Username'
            required
          />
        </div>
        <div className='mb-3'>
          <label className='form-label'>Password</label>
          <input
            type='password'
            className='form-control'
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            required
          />
        </div>
        {/* <div className="mb-3">
          <label className="form-label">Role</label>
          <select 
            className="form-select" 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
          >
            <option value="center">Center</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
        <button type='submit' className='btn btn-primary'>
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      {errorMessage && (
        <div className='alert alert-danger mt-3'>{errorMessage}</div>
      )}
    </div>
  );
};

export default Login;
