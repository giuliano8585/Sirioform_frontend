import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Document = () => {
  const [documents, setDocuments] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchdocument = async (e) => {
      try {
        const response = await axios.get(
          'http://172.232.209.245/api/document',
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': `${localStorage.getItem('token')}`,
            },
          }
        );
        setDocuments(response?.data);
      } catch (error) {
        console.error('Error submitting data:', error);
      }
    };
    fetchdocument();
  }, []);

  return (
    <div className='container mt-5'>
      <div className=''>
        <h2>documents</h2>
        <div className='p-4'>
          {documents?.map((data) => (
            <div className='p-3 border m-2'>
              {data.docUrl && (
                <a
                  href={'http://172.232.209.245' + data.docUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  View Document
                </a>
              )}
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

export default Document;
