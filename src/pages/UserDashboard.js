// src/pages/UserDashboard.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/secure-endpoint', {
          headers: { 'x-auth-token': token }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome to your dashboard</h1>
      <h2>User Details</h2>
      <p><strong>ID:</strong> {user.user.id}</p>
      <p><strong>Role:</strong> {user.user.role}</p>
      <h2>Protected Message</h2>
      <p>{user.message}</p>
    </div>
  );
};

export default UserDashboard;

