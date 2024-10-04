import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewProfile = () => {
  const token = localStorage.getItem('token');
  const decodedToken = jwtDecode(token);
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5000/api/auth/centers/me',
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
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
  return (
    <div className='container'>
      <h2 className='my-4'>Profile</h2>
      <div className=''>
        {/* {data} */}
        <div className='d-flex justify-items-between col-12'>
          {location?.state?.isCenter ? (
            <></>
          ) : (
            <>
              <div className='d-flex justify-items-between col-6'>
                <h2 className='col-6'>First Name :</h2>{' '}
                <h3 className='col-6'>{data?.firstName}</h3>
              </div>
              <div className='d-flex justify-items-between col-6'>
                <h2 className='col-6'>Last Name :</h2>{' '}
                <h3 className='col-6'>{data?.lastName}</h3>
              </div>
            </>
          )}
        </div>
        <div className='d-flex justify-items-between col-12'>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>username :</h2>{' '}
            <h3 className='col-6'>{data?.username}</h3>
          </div>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>email :</h2>{' '}
            <h3 className='col-6'>{data?.email}</h3>
          </div>
        </div>
        {!location?.state?.isCenter &&
        <div className='d-flex justify-items-between  col-12'>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>brevetNumber :</h2>{' '}
            <h3 className='col-6'>{data?.brevetNumber}</h3>
          </div>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>fiscalCode :</h2>{' '}
            <h3 className='col-6'>{data?.fiscalCode}</h3>
          </div>
        </div>
        }
        <div className='d-flex justify-items-between  col-12'>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>piva :</h2>{' '}
            <h3 className='col-6'>{data?.piva}</h3>
          </div>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>phone :</h2>{' '}
            <h3 className='col-6'>{data?.phone}</h3>
          </div>
        </div>
        <div className='d-flex justify-items-between  col-12'>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>address :</h2>{' '}
            <h3 className='col-6'>{data?.address}</h3>
          </div>
          <div className='d-flex justify-items-between  col-6'>
            <h2 className='col-6'>region:</h2>{' '}
            <h3 className='col-6'>{data?.region}</h3>
          </div>
        </div>
        {!location?.state?.isCenter&&<h2 className='col-6'>Qualifications:</h2>}
        {!location?.state?.isCenter && data?.qualifications?.map((data) => (
          <div className='d-flex justify-items-between  col-12'>
            <div className='d-flex justify-items-between  col-6'>
              <h2 className='col-6'>Qualification Type :</h2>{' '}
              <h3 className='col-6'>{data?.name}</h3>
            </div>
            <div className='d-flex justify-items-between  col-6'>
              <h2 className='col-6'>expriration Date:</h2>{' '}
              <h3 className='col-6'>{data?.expirationDate?.split('T')[0]}</h3>
            </div>
          </div>
        ))}
        {location?.state?.isCenter&&<h2 className='col-6'>sanitarios:</h2>}
        {location?.state?.isCenter && data?.sanitarios?.map((data) => (
          <div className='d-flex justify-items-between  col-12'>
            <div className='d-flex justify-items-between  col-6'>
              <h2 className='col-6'>sanitarios Name :</h2>{' '}
              <h3 className='col-6'>{data?.firstName +" "+ data?.lastName}</h3>
            </div>
            <div className='d-flex justify-items-between  col-6'>
              <h2 className='col-6'> sanitarios Email:</h2>{' '}
              <h3 className='col-6'>{data?.email}</h3>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex gap-5">
      <div className="btn btn-primary"  onClick={() => navigate(decodedToken.user.role=='instructor'?'/instructor-dashboard':'/center-dashboard')}>Back</div>
      <div className="btn btn-primary"  onClick={() => navigate(decodedToken.user.role=='instructor'?'/instructor/update-profile':'/center/update-profile',{state:{id:data?._id}})}>Edit</div>
      </div>
    </div>
  );
};

export default ViewProfile;
