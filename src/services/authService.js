// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

const login = async (username, password, role) => {
  const res = await axios.post(API_URL + 'login', { username, password, role });
  if (res.data.token) {
    localStorage.setItem('token', res.data.token);
  }
  return res.data;
};

const logout = () => {
  localStorage.removeItem('token');
};

export default {
  login,
  logout
};
