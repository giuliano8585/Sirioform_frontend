import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/instructors/me', {
          headers: {
            'x-auth-token': token
          }
        });
        setData(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.response.data.error || 'An error occurred');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const goToViewKits = () => {
    navigate('/view-kits');
  };

  return (
    <div>
      <h1>Instructor Dashboard</h1>
      <button onClick={() => alert(JSON.stringify(data, null, 2))}>Anagrafica</button>
      <button onClick={goToViewKits}>Visualizza Kit</button>
    </div>
  );
};

export default InstructorDashboard;
