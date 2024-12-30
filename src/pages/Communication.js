import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Communication = () => {
  const [commincation, setCommincation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommunication = async (e) => {
      try {
        const response = await axios.get(
          'http://172.232.209.245/api/communication',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': `${localStorage.getItem('token')}`,
            },
          }
        );
        setCommincation(response?.data);
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    };
    fetchCommunication();
  }, []);

  return (
    <div className='container mt-5'>
      <div className=''>
        <h2>Communications</h2>
        <div className='p-4'>
          {commincation?.map((data) => (
            <div className='p-3 border m-2'>
              <img
                className='h-12 w-6'
                style={{
                  maxWidth: '600px',
                  height: '300px',
                  objectFit: 'cover',
                }}
                src={'http://172.232.209.245' + data?.imageUrl}
                alt=''
              />
              <h2>{data?.title}</h2>
              <p>{data?.description}</p>
              <small>{data?.createdAt?.split('T')[0]}</small>
            </div>
          ))}
        </div>
      </div>
      <button
        type='button'
        className='btn btn-primary ms-auto '
        onClick={() => navigate(-1)}
      >
        back
      </button>
    </div>
  );
};

export default Communication;
