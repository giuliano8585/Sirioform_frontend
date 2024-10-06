import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const UnapprovedCenters = () => {
  const navigate = useNavigate()
  const [centers, setCenters] = useState([]);
  const token = localStorage.getItem('token')
  const decodedToken = jwtDecode(token);
  const [showApproveConfirmModal , setShowApproveConfirmModal] = useState(false)

  useEffect(() => {
    const fetchUnapprovedCenters = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/centers/unapproved', {
          headers: {
            'x-auth-token': token,
          }
        });
        setCenters(res.data);
      } catch (err) {
        console.error('Error fetching unapproved centers:', err);
      }
    };

    fetchUnapprovedCenters();
  }, []);

  const approveCenter = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/centers/approve/${id}`,{}, {
        headers: {
          'x-auth-token': token,
        }
      });
      setCenters(centers.filter(center => center._id !== id));
    } catch (err) {
      console.error('Error approving center:', err);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Centri da Abilitare</h1>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Nome</th>
              <th>Indirizzo</th>
              <th>Città</th>
              <th>Regione</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {centers.map((center) => (
              <tr key={center._id}>
                <td>{center.name}</td>
                <td>{center.address}</td>
                <td>{center.city}</td>
                <td>{center.region}</td>
                <td>{center.email}</td>
                <td>{center.phone}</td>
                <td>
                  <button className="btn btn-success mb-2" onClick={() =>setShowApproveConfirmModal(true)}>Approva</button>
                </td>
                {showApproveConfirmModal && (
                            <div
                              className='modal modal-xl show d-block'
                              tabIndex='-1'
                            >
                              <div className='modal-dialog'>
                                <div className='modal-content'>
                                  <div className='modal-header'>
                                    <h5 className='modal-title'>
                                      Confirm
                                    </h5>
                                    <button
                                      type='button'
                                      className='close'
                                      onClick={() =>
                                        setShowApproveConfirmModal(
                                          false
                                        )
                                      }
                                    >
                                      <span>&times;</span>
                                    </button>
                                  </div>
                                  <div className='modal-body'>
                                    <div className='table-responsive'>
                                      <p className='text-center'>
                                        are you sure want to Approve center
                                      </p>
                                      <div className='d-flex align-items-center justify-content-center gap-4'>
                                        <button
                                          onClick={() =>
                                            setShowApproveConfirmModal(
                                              false
                                            )
                                          }
                                          className='btn btn-info btn-sm'
                                        >
                                          No
                                        </button>
                                        <button
                                          onClick={() =>
                                            approveCenter(center._id)
                                          }
                                          className='btn btn-primary btn-sm'
                                        >
                                          Yes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="btn btn-primary"  onClick={() => navigate(decodedToken.user.role=='admin'?"/admin-dashboard":decodedToken.user.role=='center'?'/center-dashboard':'instructor-dashboard')}>Back</div>
    </div>
  );
};

export default UnapprovedCenters;
